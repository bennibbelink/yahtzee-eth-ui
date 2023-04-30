# yahtzee-eth-ui
A frontend for the [yahtzee-eth](https://github.com/bennibbelink/yahtzee-eth) smart contract.

## How to run
1. Copy your Yahtzee.json file that was generated when you deployed the smart contract using truffle into `./src/ContractABI/` directory.  In this repo there is some version saved, but you will need to update it with your own when you deploy the contract.
2. (Windows) `npm i && set PROVIDER="{your ethereum network RPC URL}" && npm run build`\
(Unix) `npm i && export PROVIDER="{your ethereum network RPC URL}" && npm run build`\
 The provider will default to `ws://127.0.0.1` if the PROVIDER environment variable is not set.  Make sure to use a websocket connection to avoid latency and provide a better user experience.
3. `serve -s build`

## Blockchain interaction
To use the web app you must have some ethereum provided installed in your browser (tested with Metamask).
I originally used Metamask to facilitate all transactions, however it required you to manually approve
each transaction which was bothersome and significantly affected the user experience.  Thus, you 
must provide your account address and private key for transactions to be signed programatically.  This
results in decreased security as you must provide this information (and it can be stored in the browser 
if you choose to have it remember this info) however the user experience greatly benefits (and since it's a game with fake money I prioritize user experience over security :smile:).  Additionally, if the game smart contract is deployed on a blockchain with slow block times (not instantaneous) then the gameplay is affected significantly (users must wait for blocks to be confirmed after each interaction).  Thus it is recommended to use a local network (such as Ganache) that confirms transactions instantly. 

The smart contract governing the game logs events on any state change, thus when you (or the other player) calls a method that changes the state (such as selecting a die, or banking a roll) the updated state will be reflected in your UI.
