async function sendEther(web3, fromAddress, toAddress, amountInEther, privateKey) {
    const tx = {
        from: fromAddress,
        to: toAddress,
        value: web3.utils.toWei(amountInEther, 'ether'),
        gas: 21000,
    };

    try {
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('Transaction successful with hash:', receipt.transactionHash);
        return receipt;
    } catch (error) {
        console.error('Failed to send Ether:', error);
        throw error;
    }
}

// Usage
const fromAddress = '0xYourFromAddress';
const toAddress = '0xRecipientAddress';
const amountInEther = '0.1';
const privateKey = 'YourPrivateKey';
sendEther(web3, fromAddress, toAddress, amountInEther, privateKey);
