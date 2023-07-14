## WavePortal
This is my implementation of WavePortal project from from buildspace.so. The projects have been moved from their main page and are now at [buildspace.so/builds](https://buildspace.so/builds) with repos at [buildspace's Github](https://github.com/buildspace/buildspace-projects).

The application lets the user submit a wave with or without a message. The user can see the previous messages that have been sent as well as the total waves and waves per address. There is a random chance that the user sumbitting a wave will be rewarded with 0.00001 gETH when they wave. However, there is a limit to only be able to submit a wave every 15 minutes in order to prevent spam.

The contract (./my-wave-portal/contracts/WavePortal.sol) is currently deployed on the Goerli Ethereum testnet ([etherscan page](https://goerli.etherscan.io/address/0x41dA1046FDb1DfC695D7f5E63726F0751eE7d956)).

The frontend (./my-wave-portal/frontend) is a React web app depolyed on Vercel [here](https://buildspace-web3-wave-portal.vercel.app/).

![deployed webpage](screenshot.png?raw=true "deployed webpage")