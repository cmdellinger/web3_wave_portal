

// create wallet object
try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      let count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());

      /*
      * Execute the actual wave from your smart contract
      */
     /*
      const waveTxn = await wavePortalContract.wave();
      console.log("Mining...", waveTxn.hash);

      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);

      count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());

      updateWaveCount();
      document.getElementById("wavecount").innerHTML = count;
    */
    } else {
      console.log("Ethereum object doesn't exist!");
    }
} catch (error) {
    console.log(error);
}

const WaveCount = () => {

    const renderLeaderboard = () => {
      
      return menu_options.map((mb, index) => {
  
        const { addr, link } = mb;
        
        return (
          <Link to={link} key={index} className="wave-item">
            <span className="wave-text">{addr}</span>
          </Link>
        );
      });
    };
  
    return <div className="wave-wavecount">{renderWaveCount()}</div>;
};

const Leaderboard = () => {

  const renderLeaderboard = () => {
    
    return menu_options.map((mb, index) => {

      const { addr, link } = mb;
      
      return (
        <Link to={link} key={index} className="wave-item">
          <span className="wave-text">{addr}</span>
        </Link>
      );
    });
  };

  return <div className="wave-leaderboard">{renderLeaderboard()}</div>;
};

export {WaveCount, Leaderboard};