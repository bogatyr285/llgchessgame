const { ethers, JsonRpcProvider } = require('ethers');

/**
 * Initialize a provider and wallet
 * @param {string} providerUrl - The Ethereum network provider URL
 * @param {string} privateKey - Private key of the wallet
 */
const initWalletAndProvider = (providerUrl, network,privateKey) => {
    const provider = new JsonRpcProvider(providerUrl,network);
    const wallet = new ethers.Wallet(privateKey, provider);
    return { provider, wallet };
};


/**
 * Initialize a contract
 * @param {string} contractAddress - Address of the deployed contract
 * @param {Array} abi - ABI of the contract
 * @param {object} wallet - Wallet initialized using ethers.js
 */
const initContract = (contractAddress, abi, wallet) => {
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    return contract;
};

/**
 * Call a read-only method on the contract
 * @param {object} contract - The initialized ethers.js contract instance
 * @param {string} methodName - The name of the method to call
 * @param {Array} params - Array of parameters to pass to the method
 */
const callReadOnlyMethod = async (contract, methodName, params = []) => {
    try {
        const response = await contract[methodName](...params);
        return response;
    } catch (error) {
        console.error('Error calling read-only method:', error);
        throw error;
    }
};

/**
 * Call a state-changing method on the contract
 * @param {object} contract - The initialized ethers.js contract instance
 * @param {string} methodName - The name of the method to call
 * @param {Array} params - Array of parameters to pass to the method
 */
const callStateChangingMethod = async (contract, methodName, params = []) => {
    try {
        const tx = await contract[methodName](...params);
        const receipt = await tx.wait();
        return receipt;
    } catch (error) {
        console.error('Error calling state-changing method:', error);
        throw error;
    }
};

module.exports = {
    initWalletAndProvider,
    initContract,
    callReadOnlyMethod,
    callStateChangingMethod
};