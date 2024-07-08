const { ethers, JsonRpcProvider } = require('ethers');
var uniswapV3FactoryAbi = require('./config/contracts/llg_abi.json');

(async () => {
    // Connect to the BSC mainnet
    const bscProvider = new JsonRpcProvider('https://bsc-dataseed.binance.org/', { name: 'binance', chainId: 56 })

    // Set your private key, eg. by reading it from an environment variable
    // const { PRIVATE_KEY } = process.env

    let randomWallet = ethers.Wallet.createRandom();

    // Sign the transaction with the contract owner's private key
    const wallet = new ethers.Wallet(randomWallet.privateKey, bscProvider);
    console.log(wallet.privateKey)
    const walletAddress = await wallet.getAddress()

    const uniswapV3FactoryAddress = '0x4691F60c894d3f16047824004420542E4674E621'
    const factoryContract = new ethers.Contract(uniswapV3FactoryAddress, uniswapV3FactoryAbi, wallet)
    const ts = await factoryContract.totalSupply()
    const s = await factoryContract.symbol()
    
    const tx = await factoryContract["claimReward(address)"](walletAddress)
    const receipt =   await tx.wait()
    // await ts.wait()
    console.log(walletAddress + ':',  ts,s, receipt)
})()
