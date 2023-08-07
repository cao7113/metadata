import axios from "axios";
import slugify from "slugify";

import { logger } from "../../shared/logger";

import { fetchTokens as fetchTokensOnChain } from "../../fetchers/onchain";

export const extendCollection = async (_chainId, metadata, tokenId) => {
  if (isNaN(Number(tokenId))) {
    throw new Error(`Invalid tokenId ${tokenId}`);
  }

  const startTokenId = tokenId - (tokenId % 1000000);
  const endTokenId = startTokenId + 1000000 - 1;

  let baseUrl = "https://token.artblocks.io";
  if (_chainId === 42161) {
    baseUrl = "https://token.arbitrum.artblocks.io";
  } else if ([4, 5].includes(_chainId)) {
    baseUrl = "https://token.staging.artblocks.io";
  }

  const url = `${baseUrl}/${metadata.contract}/${tokenId}`;
  const { data } = await axios.get(url);

  return {
    ...metadata,
    metadata: {
      ...metadata.metadata,
      imageUrl: data.image,
      description: data.description,
      externalUrl: data.website,
    },
    name: data.collection_name,
    slug: metadata.isFallback ? slugify(data.collection_name, { lower: true }) : metadata.slug,
    community: data.platform.toLowerCase(),
    id: `${metadata.contract}:${startTokenId}:${endTokenId}`.toLowerCase(),
    tokenIdRange: [startTokenId, endTokenId],
    tokenSetId: `range:${metadata.contract}:${startTokenId}:${endTokenId}`,
    isFallback: undefined,
  };
};

export const extend = async (_chainId, metadata) => {
  try {
    const startTokenId = metadata.tokenId - (metadata.tokenId % 1000000);
    const endTokenId = startTokenId + 1000000 - 1;

    let baseUrl = "https://token.artblocks.io";
    if (_chainId === 42161) {
      baseUrl = "https://token.arbitrum.artblocks.io";
    } else if ([4, 5].includes(_chainId)) {
      baseUrl = "https://token.staging.artblocks.io";
    }

    const url = `${baseUrl}/${metadata.contract}/${metadata.tokenId}`;
    const { data } = await axios.get(url);

    const imageUrl = metadata.imageUrl ?? data.image;
    const mediaUrl = metadata.mediaUrl ?? data.animation_url ?? data.generator_url;

    const attributes = [];

    if (data.features) {
      // Add None value for core traits
      for (const [key, value] of Object.entries(data.features)) {
        attributes.push({
          key,
          rank: 1,
          value,
          kind: "string",
        });
      }
    } else {
      logger.info(
        "artblocks-engine-extend",
        `extend - features fallback. _chainId=${_chainId}, contract=${metadata.contract}, tokenId=${
          metadata.tokenId
        }, metadata=${JSON.stringify(metadata)}, url=${url}, data=${JSON.stringify(data)}`
      );

      try {
        const tokens = await fetchTokensOnChain(_chainId, [
          { contract: metadata.contract, tokenId: metadata.tokenId },
        ]);

        logger.info(
          "artblocks-engine-extend",
          `extend - fetchTokensOnChain. _chainId=${_chainId}, contract=${
            metadata.contract
          }, tokenId=${metadata.tokenId}, metadata=${JSON.stringify(
            metadata
          )}, url=${url}, data=${JSON.stringify(data)}, tokens=${JSON.stringify(tokens)}`
        );
      } catch (error) {
        logger.error(
          "artblocks-engine-extend",
          `fetchTokensOnChain error. _chainId=${_chainId}, contract=${metadata.contract}, tokenId=${
            metadata.tokenId
          }, metadata=${JSON.stringify(metadata)}, data=${JSON.stringify(data)}, error=${error}`
        );
      }
    }

    return {
      ...metadata,
      attributes,
      imageUrl,
      mediaUrl,
      collection: `${metadata.contract}:${startTokenId}:${endTokenId}`.toLowerCase(),
    };
  } catch (error) {
    logger.error(
      "artblocks-engine-extend",
      `extend. _chainId=${_chainId}, contract=${metadata.contract}, tokenId=${
        metadata.tokenId
      }, metadata=${JSON.stringify(metadata)}, error=${error}`
    );

    throw error;
  }
};
