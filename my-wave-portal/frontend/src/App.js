import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

// add by line
import twitterLogo from './assets/twitter-logo.svg';
const TWITTER_HANDLE = 'gte539z';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState();
  const [waveCountsByAddress, setWaveCountsByAddress] = useState([]);
  const [allWaves, setAllWaves] = useState([]);
  /**
  * Create a variable here that holds the contract address after you deploy!
  */
  const contractAddress = "0x5BF4058DdefFE87163B4b9895B73acaf70c7FCE5";
  /**
  * Create a variable here that references the abi content!
  */
  const contractABI = abi.abi;

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
  const updateWaveData = async () => {
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  
          let count = await wavePortalContract.getTotalWaves();
          console.log("Retrieved total wave count...", count.toNumber());
          
          // create if to only get other data from contract if wave qty changed
          if ( totalWaves !== count.toNumber() ) {
            // save total wave count (in if to prevent inf loop of continual updating)
            setTotalWaves(count.toNumber());

            // get wave messages
            const waves = await wavePortalContract.getAllWaves();
            // reformat wave messages
            let wavesCleaned = [];
            waves.forEach(wave => {
              wavesCleaned.push({
                address: wave.waver,
                timestamp: new Date(wave.timestamp * 1000),
                message: wave.message
              });
            });
            // save reformatted wave messages
            setAllWaves(wavesCleaned);

            // get wave counts by address
            let waverAddresses = await wavePortalContract.getWaverAddresses();
            console.log("Retrieved wave addresses...\n", waverAddresses);
            // reformat wave messages
            let waverCountsCleaned = [];
            await Promise.all( waverAddresses.map(async (waverAddress) => {
              let waverCount = await wavePortalContract.getWaverCount(waverAddress);
              waverCountsCleaned.push({
                address: waverAddress,
                count: waverCount.toNumber()
              });
            }));
            console.log("Retrieved wave counts by address:");
            console.log(waverCountsCleaned);
            // save reformatted wave counts
            setWaveCountsByAddress(waverCountsCleaned);
          }

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
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        // get wave count before waving
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        
        // Execute the actual wave from your smart contract
        const waveTxn = await wavePortalContract.wave("this is a test!");
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        // get wave count after waving
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
    if(currentAccount) {
      updateWaveData();
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
        <br />
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

        <br />

        { totalWaves && (
          <div>
            Total Waves: {totalWaves}
          </div>
        ) }

        <br />

        { waveCountsByAddress && (
          <table>
            <caption>Wave Counts by Address</caption>
            <tr>
              <th scope="col">Address</th>
              <th scope="col">Waves</th>
            </tr>
            { waveCountsByAddress.map((wave) =>{
              return (
                <tr>
                  <td>{wave.address}</td>
                  <td>{wave.count}</td>
                </tr>
              )
            })}
          </table>
        ) }

        <br/>

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>

      </div>
    </div>
    
  );
}

export default App