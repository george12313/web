import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import {config} from "../config";

const Web3Integration = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [localValue, setLocalValue] = useState('');
    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const web3Instance = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
                    // const web3Instance = new Web3(new Web3.providers.WebsocketProvider(
                    //         'wss://eth-mainnet.g.alchemy.com/v2/ScK1WWZHRPgt8xtmGzmaPlCGLjX7VQPp',
                    //     )
                    // );
                    setWeb3(web3Instance);

                    const accounts = await web3Instance.eth.getAccounts();
                    setAccounts(accounts);

                    const contractAddress = config.contractAddress;
                    const contractABI = config.contractABI;
                    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
                    setContract(contractInstance);
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.error('MetaMask not detected');
            }
        };

        initWeb3();
    }, []);


    const handleDeposit = async () => {
        try {
            const deposit= contract.methods.deposit();
            const balance = await web3.eth.getBalance(accounts[0]);
            const depositAmount = Web3.utils.toHex( web3.utils.toWei(localValue, 'ether'));

            if (balance < depositAmount) {
                console.error('Недостаточно средств на аккаунте для отправки депозита');
                return;
            }

            // const transaction = {
            //     from: accounts[0],
            //     to: contract.options.address,
            //     data: deposit.encodeABI(),
            //     value: depositAmount,
            //     gasLimit: 300000
            // };

            const testTransaction = {
                from: accounts[0],
                to: accounts[1],
                value: depositAmount
            };

            web3.eth.sendTransaction(testTransaction)
        } catch (error) {
            console.error('Deposit Error:', error);
        }
    };

    const handleValueChange = (event) => {
        const newValue = event.target.value;
        setLocalValue(newValue);

        let onValueChange;
        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    return (
        <div>
            <p>Connected Account: {accounts[0]}</p>
            <input type="text" name="value" value={localValue} onChange={handleValueChange} />
            <button onClick={handleDeposit}>Make Deposit</button>
        </div>
    );
};

export default Web3Integration;
