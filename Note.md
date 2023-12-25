# Notes

## Bugs

http://localhost:3000/api/v4/x1-testnet/metadata/collection?method=onchain&token=0x4B8763334Fee8e52d604342e69f968D06E7eAec0:1
http://localhost:3000/api/v4/x1-testnet/metadata/token?method=onchain&token=0x4B8763334Fee8e52d604342e69f968D06E7eAec0:1

```
Error: Missing RPC_URL for chain X_1 TESTNET id 195
at Module.fetchTokens (/Users/rj/alien/metadata/.next/server/chunks/7519.js:664:51)
at api (/Users/rj/alien/metadata/.next/server/pages/api/v4/[network]/metadata/token.js:316:75)
at Object.apiResolver (/Users/rj/alien/metadata/node_modules/next/dist/server/api-utils.js:102:15)
at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
at async Server.handleApiRequest (/Users/rj/alien/metadata/node_modules/next/dist/server/next-server.js:1017:9)
at async Object.fn (/Users/rj/alien/metadata/node_modules/next/dist/server/next-server.js:904:37)
at async Router.execute (/Users/rj/alien/metadata/node_modules/next/dist/server/router.js:210:32)
at async Server.run (/Users/rj/alien/metadata/node_modules/next/dist/server/next-server.js:1088:29)
at async Server.handleRequest (/Users/rj/alien/metadata/node_modules/next/dist/server/next-server.js:304:20)
^Ctask: Signal received: "interrupt"
task: Failed to run task "run": exit status 130
```
