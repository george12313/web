import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import {config} from "../config";
import {logDOM} from "@testing-library/react";

const Web3Integration = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [localValue, setLocalValue] = useState('');
    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                try {
                    await window.ethereum.enable();
                    const web3Instance = new Web3(window.ethereum);
                    setWeb3(web3Instance);

                    const accounts = await web3Instance.eth.getAccounts();
                    console.log("accounts", accounts)
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
            const depositData =  contract.methods.deposit(
                web3.utils.toHex( web3.utils.toWei(localValue, 'ether'))
            ).encodeABI();

            const balance = await web3.eth.getBalance(accounts[0]);
            if (balance < localValue) {
                console.error('Недостаточно средств на аккаунте для депозита');
                return;
            }

            const gasPrice = await web3.eth.getGasPrice()
            const transaction = {
                from: accounts[0],
                to: contract.options.address,
                data: depositData,
                value: '0x0',
                gasPrice: web3.utils.toHex(gasPrice),
                gasLimit: web3.utils.toHex(50000)
            };

           await web3.eth.sendTransaction(transaction)
        } catch (error) {
            console.error('Error:', error.message);
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
