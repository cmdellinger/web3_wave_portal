const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
      value: hre.ethers.utils.parseEther("0.1"),
    });
    await waveContract.deployed();
  
    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);
  
    // get total waves
    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log("Total waves:", waveCount);

    // get current contract balance
    console.log("Contract balance:", await hre.ethers.provider.getBalance(waveContract.address));
    
    // wave with a message
    let waveTxn = await waveContract.wave("A message!");
    await waveTxn.wait();

    // get total waves
    waveCount = await waveContract.getTotalWaves();
    console.log("Total waves:", waveCount);

    // get current contract balance
    console.log("Contract balance:", await hre.ethers.provider.getBalance(waveContract.address));

    // wave from a random person without a message
    waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
    await waveTxn.wait();
    
    // wave from a random person without a message
    waveTxn = await waveContract.connect(randomPerson).wave("");
    await waveTxn.wait();

    // get current contract balance
    console.log("Contract balance:", await hre.ethers.provider.getBalance(waveContract.address));
  
    // get total waves
    waveCount = await waveContract.getTotalWaves();
    console.log("Total waves:", waveCount);

    // get waver addresses
    let waverAddresses = await waveContract.getWaverAddresses();
    console.log(waverAddresses.toString())
    
    // get wave counts from different addresses
    let waverCount = await waveContract.getWaverCount(owner.address);
    console.log("waver count:", waverCount.toNumber() );
    let waverCountOther = await waveContract.getWaverCount(randomPerson.address);
    console.log("other waver count:", waverCountOther.toNumber() );

    // get all wave messages
    let allWaves = await waveContract.getAllWaves();
    console.log("all waves:", allWaves);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0); // exit Node process without error
    } catch (error) {
      console.log(error);
      process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
  };
  
  runMain();