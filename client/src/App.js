import React, { useState, useEffect, useCallback } from "react";
import CardContract from "./contracts/Card.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const App = () => {

  const [web, setWeb] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract ] = useState(null);
  const [balance, setBalance] = useState(0)

  const getBalanceOfAccount = useCallback(async () => {
    const result = await contract.methods.balanceOf(accounts[0]).call()
    setBalance(result)
  },[accounts, contract])

  const loadWeb3 = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts)

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CardContract.networks[networkId];
      const instance = new web3.eth.Contract(
        CardContract.abi,
        deployedNetwork && deployedNetwork.address,
        { gasLimit: "1000000" }
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setWeb(web3)
      setAccounts(accounts)
      setContract(instance)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  useEffect(() => {
    loadWeb3()
  },[])

  useEffect(() => {
    if (contract) {
      getBalanceOfAccount()
    }
  },[contract, accounts, getBalanceOfAccount])


  const handleCreateToken = async () => {
    try {
      await contract.methods.awardItem(accounts[0]).send({from: accounts[0]})
      getBalanceOfAccount()
    } catch (err) {
      console.log(err)
    }
  }




  if (!web) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <h1>Good to Go!</h1>
      <p>Your Truffle Box is installed and ready.</p>
      <h2>Smart Contract Example</h2>
      <p>
        If your contracts compiled and migrated successfully, below will show
        a stored value of 5 (by default).
      </p>
      <p>
        Your balance is <strong>{balance}</strong>.
      </p>
      <button onClick={() => handleCreateToken()}>Crear Token</button>
    </div>
  );
  }

export default App;
