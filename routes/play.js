var express = require('express');
var util = require('../config/util.js');
var router = express.Router();
const {
    initWalletAndProvider,
    initContract,
    callReadOnlyMethod,
    callStateChangingMethod
} = require('../services/ether.js');

// TODO this must be in the config file. Such approach just for simplicity & debug
// 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID';
const PROVIDER_URL  = process.env.PROVIDER_URL ||  'https://bsc-dataseed.binance.org/'
const PROVIDER_NETWORK  = process.env.PROVIDER_NETWORK ||  { name: 'binance', chainId: 56 }
const PRIVATE_KEY  = process.env.PRIVATE_KEY ||  '0x1337';
const LLG_CONTRACT_ADDRESS  = process.env.LLG_CONTRACT_ADDRESS ||  '0x4691F60c894d3f16047824004420542E4674E621';
const LLG_ABI  = require('../config/contracts/llg_abi.json');

router.get('/', function (req, res) {
    res.render('partials/play', {
        title: 'Chess Hub - Game',
        user: req.user,
        isPlayPage: true
    });
});

router.post('/', function (req, res) {
    var side = req.body.side;
    //var opponent = req.body.opponent; // playing against the machine in not implemented
    var token = util.randomString(20);
    res.redirect('/game/' + token + '/' + side);
});

router.get('/contract', async (req, res) => {
    // can be used for debug purposes
    // let randomWallet = ethers.Wallet.createRandom();

    const { provider, wallet } = initWalletAndProvider(PROVIDER_URL, PROVIDER_NETWORK, PRIVATE_KEY)
    const llgContract = initContract(LLG_CONTRACT_ADDRESS, LLG_ABI, wallet)
    // read methods
    const ts = await callReadOnlyMethod(llgContract, 'totalSupply')
    const symbol = await callReadOnlyMethod(llgContract, 'symbol')
    const walletAddress = await wallet.getAddress()

    console.log(`wallet:${walletAddress}. contract totalSupply: ${ts}, symbol: ${symbol} `)
    try {
        // write method
        const receipt = await callStateChangingMethod(llgContract, 'claimReward(address)', [walletAddress])
        console.log(`called claimReward. Receipt: ${receipt}`)
        res.send({
            response: {
                totalSupply: ts.toString(),
                symbol: symbol,
                walletAddress: walletAddress,
                receipt: receipt,
            },
        })
    } catch (err) {
        res.send({
            response: {
                totalSupply: ts.toString(),
                symbol: symbol,
                walletAddress: walletAddress,
            },
            error: err
        })
    }
});

module.exports = router;