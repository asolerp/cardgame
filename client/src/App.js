import React, { useState, useEffect, useCallback } from "react";
import CardContract from "./contracts/Card.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const App = () => {

  const [web, setWeb] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract ] = useState(null);
  const [balance, setBalance] = useState(0)
  const [userCards, setUserCards] = useState([])

  const getBalanceOfAccount = useCallback(async () => {
    const result = await contract.methods.balanceOf(accounts[0]).call()
    setBalance(result)
  },[accounts, contract])

  const getUserNFTs = useCallback(async () => {
    try {
      const list = await contract.methods.tokensOfOwner(accounts[0]).call()
      const tokenURIs = await Promise.all(list.map(async (tokenID) => await contract.methods.tokenURI(tokenID).call()))
      const cards = await Promise.all(tokenURIs.map(async (cardURI) => await fetch(cardURI).then(response => response.json())))
      setUserCards(cards)
    } catch (err) {
      console.log(err)
    }
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
      getUserNFTs()
    }
  },[contract, accounts, getBalanceOfAccount])

  useEffect(() => {})


  const handleCreateToken = async (option) => {
    try {
      await contract.methods.mint(option, accounts[0]).send({from: accounts[0]})
      getBalanceOfAccount()
      getUserNFTs()
    } catch (err) {
      console.log(err)
    }
  }

  const handleListToken = async () => {
    try {
      getUserNFTs()
    } catch (err) {
      console.log(err)
    }
  }


  if (!web) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <h1>Juego de Cartas!</h1>
      <p>
        Tienes <strong>{balance}</strong> NFTs.
      </p>
      <div className="cards-wrapper">
        {
          userCards.length > 0 ? userCards.map((card, i) => 
          <div  key={i} style={{marginRight: 10, marginLeft: 10}}>
            <h2>{card.name}</h2>
            <img className="card" src={card.image} alt={card.name} />
          </div>
          ) : <h1>No tienes ninguna carta...</h1>
        }
      </div>
      <button onClick={() => handleCreateToken(1)}>Comprar Opcion 1</button>
      <button onClick={() => handleCreateToken(2)}>Comprar Opcion 2</button>
      {/* <button onClick={() => handleListToken()}>List all tokens</button> */}
    </div>
  );
  }

export default App;
