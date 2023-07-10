import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  /**
  * Create a variable here that holds the contract address after you deploy!
  */
  const contractAddress = "0x5BF4058DdefFE87163B4b9895B73acaf70c7FCE5";
  /**
  * Create a variable here that references the abi content!
  */
  const contractABI = abi.abi;
  /**
   * Create a variable for wavetable elements
   */
  let wavesElement = document.getElementById('wavetable');

  const checkIfWalletIsConnected = async () => {
    try {
        
      /*
      * First make sure we have access to window.ethereum
      */
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  /**
  * This funciton updates the id="wavecount" element and optionally increments the wave count
  */
  const updateWaveCount = async (increment = false) => {
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  
          let count = await wavePortalContract.getTotalWaves();
          console.log("Retrieved total wave count...", count.toNumber());
          
          if (increment){
            /*
            * Execute the actual wave from your smart contract
            */
            const waveTxn = await wavePortalContract.wave();
            console.log("Mining...", waveTxn.hash);
    
            await waveTxn.wait();
            console.log("Mined -- ", waveTxn.hash);
    
            count = await wavePortalContract.getTotalWaves();
            console.log("Retrieved total wave count...", count.toNumber());
          }

          document.getElementById("wavecount").innerHTML = `Total Waves: ${count.toNumber()}`;
  
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
  }

  /*
  * This runs our smart contract's wave function
  */
  const wave = async () => {
    updateWaveCount(true);
  }

  /*
  * This fetches the addresses that have waved
  */
  const fetchScores = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let waverAddresses = await wavePortalContract.getWaverAddresses();
        console.log("Retrieved wave addresses...\n", waverAddresses);

        console.log("Generating wave table...");
        const headerElement = document.createElement('tr');
        headerElement.className = 'table-header';
        headerElement.innerHTML = `<td>Waver Address</td>
                                 <td>Waves</td>`;
        wavesElement.appendChild(headerElement);

        waverAddresses.forEach(async function (waverAddress){
          let waverCount = await wavePortalContract.getWaverCount(waverAddress);

          const waveElement = document.createElement('tr');
          waveElement.className = 'table-wave';
          waveElement.innerHTML = `<td>${waverAddress}</td>
                                   <td>${waverCount}</td>`;
          wavesElement.appendChild(waveElement);

        });

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
    if(currentAccount) {
      updateWaveCount();
      fetchScores();
    }
  } )

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
            <span role="img" aria-label="wave">👋</span> Hey there!
        </div>

        <div className="bio">
          I am Charley and I am learning solidity and React. Connect your Ethereum wallet and wave at me!

        </div>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="cta-button connect-wallet-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {/*
        * If there is a currentAccount render wave button and waves
        */}
        {currentAccount && (
          <button className="cta-button connect-wallet-button" onClick={wave}>
            Wave at Me
          </button>
        )}
        <br/>
        <div id="wavecount"></div>
        <br/>
        <table id="wavetable"></table>
      </div>
    </div>
    
  );
}

export default App