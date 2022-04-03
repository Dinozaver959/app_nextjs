import Moralis from "moralis"

const ethers = Moralis.web3Library;

// READ Functions 

export async function CheckTotalSupply_Moralis(collectionName) {
  // add a check for correct network
  const supply_hex = await MoralisRead(collectionName, "totalSupply"); // will give an array with a hex value
  const supply = parseInt(supply_hex['_hex'], 16);
  console.log("supply: " + supply);

  document.getElementById('Interact_TotalSupplyDisplay').innerText = supply;
  document.getElementById('Interact_TotalSupplyDisplay').style.visibility = "visible";
}

export async function CheckOwner_Moralis(collectionName) {
  // add a check for correct network
  const owner = await MoralisRead(collectionName, "owner");
  console.log("owner: " + owner);

  document.getElementById('Interact_CheckOwnerDisplay').innerText = owner;
  document.getElementById('Interact_CheckOwnerDisplay').style.visibility = "visible";
}

export async function CheckContractName_Moralis(collectionName) {
  // add a check for correct network
  const name = await MoralisRead(collectionName, "name");
  console.log("name: " + name);

  document.getElementById('Interact_CheckContractNameDisplay').innerText = name;
  document.getElementById('Interact_CheckContractNameDisplay').style.visibility = "visible";
}

export async function CheckContractSymbol_Moralis(collectionName) {
  // add a check for correct network
  const symbol = await MoralisRead(collectionName, "symbol");
  console.log("symbol: " + symbol);

  document.getElementById('Interact_CheckContractSymbolDisplay').innerText = symbol;
  document.getElementById('Interact_CheckContractSymbolDisplay').style.visibility = "visible";
}

export async function CheckSaleActive_Moralis(collectionName) {
  // add a check for correct network
  const saleActive = await MoralisRead(collectionName, "saleActive");
  console.log("saleActive: " + saleActive);

  document.getElementById('Interact_CheckSaleActiveDisplay').innerText = saleActive;
  document.getElementById('Interact_CheckSaleActiveDisplay').style.visibility = "visible";
}

export async function CheckTokenURI_Moralis(collectionName) {
  // add a check for correct network

  const params = {
    tokenId: 0,
  }

  const tokenURI = await MoralisRead_(collectionName, "tokenURI", params);
  console.log("tokenURI: " + tokenURI);

  document.getElementById('Interact_CheckToken_0URIDisplay').innerText = tokenURI;
  document.getElementById('Interact_CheckToken_0URIDisplay').style.visibility = "visible";
}

export async function CheckIfRevealed_Moralis(collectionName) {
  // add a check for correct network
  const revealed = await MoralisRead(collectionName, "revealed");
  console.log("revealed: " + revealed);

  document.getElementById('Interact_CheckIfRevealedDisplay').innerText = revealed;
  document.getElementById('Interact_CheckIfRevealedDisplay').style.visibility = "visible";
}

async function MoralisRead(collectionName, method) {
  return MoralisRead_(collectionName, method, {})
}

async function MoralisRead_(collectionName, method, params) {

  // <-- this is needed if there was no authentication - good for read only
  const web3Provider = await Moralis.enableWeb3();

  console.log("method: " + method);

  const contractAddress = GetContractAddress(collectionName);
  const ABI = GetABI(collectionName);

  const readOptions = {
    contractAddress: contractAddress,
    functionName: method,
    abi: ABI,
    params: params
  };

  const message = await Moralis.executeFunction(readOptions);
  return message;
}

// WRITE functions

export async function Mint_Moralis(collectionName) {

  // get the mint price
  const mintPrice_hex = await MoralisRead(collectionName, "MINT_PRICE"); // will give an array with a hex value
  const mintPrice = parseInt(mintPrice_hex['_hex'], 16);
  console.log("mintPrice: " + mintPrice);

  // do the mint
  const params = {
    numTokens: 1,
  }
  await MoralisWrite__(collectionName, "mint", params, mintPrice);
}

export async function SetSaleActive_Moralis(collectionName) {

  const params = {
    _saleActive: true,
  }

  await MoralisWrite_(collectionName, "setSaleActive", params);

  // update DB
}

export async function UpdateBaseURI_Moralis(collectionName) {

  const baseURI = document.getElementById('UpdateBaseURI_text').value;

  const params = {
    baseURI_: baseURI,
  }

  await MoralisWrite_(collectionName, "setBaseURI", params);

  // update DB
}

export async function Reveal_Moralis(collectionName) {
  await MoralisWrite(collectionName, "reveal");

  // on confirmation -> update DB that the collection has been revealed
  SetCollectionAsRevealed(collectionName); // in moralis.js
}

export async function Withdraw_Moralis(collectionName) {
  await MoralisWrite(collectionName, "withdraw");
}

export async function SetPlatformRoyalty_Moralis(collectionName) {

  const royalty = parseInt(document.getElementById('PlatformRoyalty_value').value);
  console.log("royalty: " + royalty)

  const params = {
    royalty: 1,
    newRoyaltyNumber: 10,
  }
  
  await MoralisWrite(collectionName, "setPlatformRoyalties", params);
}


async function MoralisWrite(collectionName, method) {
  await MoralisWrite_(collectionName, method, {});
}

async function MoralisWrite_(collectionName, method, params) {
  await MoralisWrite__(collectionName, method, params, 0);
}

async function MoralisWrite__(collectionName, method, params, value) {

  // <-- this is needed if there was no authentication - good for read only
  const web3Provider = await Moralis.enableWeb3();

  console.log("method: " + method);

  const contractAddress = GetContractAddress(collectionName);
  const ABI = GetABI(collectionName);

  const writeOptions = {
    contractAddress: contractAddress,
    functionName: method,
    abi: ABI,
    params: params,
    msgValue: value
  };

  const transaction = await Moralis.executeFunction(writeOptions);

  // need to check if Tx was rejected or if something else went wrong (on success we can return the Tx hash -> which we could store in DB)


  console.log("transaction hash: " + transaction.hash);

  await transaction.wait();
  console.log("transaction is confirmed");
}

export async function DeployContract_Moralis(collectionName, userAccount, chainId) {

  // optional - not sure if needed
  // if user does not owns the collection - redirect to home page
  const params =  { collectionName: collectionName, userAccount : userAccount };
  const correctOwner = await Moralis.Cloud.run("CheckIfUserOwnsCollection", params);
  if(!correctOwner){
    console.log("USER DOES NOT OWN THE COLLECTION!")
    return false;
  }


  const web3Provider = await Moralis.enableWeb3();
  await web3Provider.send("eth_requestAccounts", []).catch((error)=>{

    console.log("deploy error code: " + error.code);
    console.log("deploy error message: " + error.message);
    
    //action to perform when user clicks "reject"
    console.log('error occured - user denied Tx')
    return false;
  });


  const signer = web3Provider.getSigner()

  
  const bytecode_compiled = GetBytecode(collectionName);
  const ABI = GetABI(collectionName);

  let factory = new ethers.ContractFactory(ABI, bytecode_compiled, signer);
  let contract = await factory.deploy();

  console.log(contract.address);
  console.log(contract.deployTransaction.hash);

  await contract.deployed();


  /*
 contract.deployed().catch(()=>{
  //action to perform when user clicks "reject"
    console.log('error occured - inside contract.deploy')
  });
  */

  /* 
    .then((tx)=>{
    //action prior to transaction being mined
    provider.waitForTransaction(tx.hash)
    .then(()=>{
       //action after transaction is mined
       console.log("Tx OK, hash: " + tx.hash)

    })
  })
  */


  console.log("contract has been deployed....!");

  // update Moralis DB with collection name-contract address
  //const collectionName = getSelectedCollectionName_Interation();

  // const collectionName = document.getElementById("CollectionName").value;
  AddCollectionAddressToMoralisDB(collectionName, contract.address, chainId);

  return true;
}




// AUXILIARY functions 
async function GetContractAddress(collectionName) {

  console.log("collectionName: " + collectionName);

  const params =  { collectionName: collectionName};
  var address = await Moralis.Cloud.run("GetContractAddress", params);

  console.log("contract address: " + address);

  return address;
}

function GetABI(collectionName) {
  let ABI_compiled = getFileContent('..\\api\\api-ABI\\' + collectionName, true);
  return JSON.parse(JSON.parse(JSON.stringify(ABI_compiled)));
}

function GetBytecode(collectionName) {
  return getFileContent('..\\api\\api-bytecode\\' + collectionName, true);
}

const networks = {

  ethereum: {
    chainId: `0x${Number(1).toString(16)}`,
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpcUrls: ["https://api.mycryptoapi.com/eth/"],
    blockExplorerUrls: ["https://etherscan.io/"]
  },
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"]
  },
  polygon_Mumbai: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: ["https://matic-mumbai.chainstacklabs.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18
    },
    rpcUrls: [
      "https://bsc-dataseed1.binance.org",
      "https://bsc-dataseed2.binance.org",
      "https://bsc-dataseed3.binance.org",
      "https://bsc-dataseed4.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed3.defibit.io",
      "https://bsc-dataseed4.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed2.ninicoin.io",
      "https://bsc-dataseed3.ninicoin.io",
      "https://bsc-dataseed4.ninicoin.io",
      "wss://bsc-ws-node.nariox.org"
    ],
    blockExplorerUrls: ["https://bscscan.com"]
  }
};

function getFileContent(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    result = xmlhttp.responseText;
  }
  return result;
}

function getSelectedCollectionName_Interation() {
  
  //return document.getElementById(CollectionName).innerText;
    
  var el = document.getElementById('CollectionName_Async');

  console.log("el.selectedIndex: " + el.selectedIndex);


  return el.options[el.selectedIndex].value;
}

async function AddCollectionAddressToMoralisDB(collectionName, contractAddress, chainId) {
  const Collections = Moralis.Object.extend("Collections");
  const query = new Moralis.Query(Collections);
  query.equalTo("collectionName", collectionName);
  const results = await query.find();

  if (results.length > 0) {
    const object = results[0];
    console.log("object.id: " + object.id + ' - ' + "object.getCollectionName" + object.get(collectionName));

    object.set("contractAddress", contractAddress);
    object.set("chainId", chainId);

    await object.save()
      .then((collection) => {
        // Execute any logic that should take place after the object is saved.
        console.log('New object saved with objectId: ' + collection.id);
        console.log('collectionName: ' + collectionName);
        console.log('contractAddress: ' + contractAddress);
      }, (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.
        console.log('Failed to create new object, with error code: ' + error.message);
      });
  }
  else  // should not be run - but just in case the collectionName and contractAddress connection is still saved
  {
    const collection = new Collections();
    collection.set("collectionName", collectionName);
    collection.set("contractAddress", contractAddress);

    await collection.save()
      .then((collection) => {
        // Execute any logic that should take place after the object is saved.
        console.log('New object created with objectId: ' + collection.id);
        console.log('collectionName: ' + collectionName);
        console.log('contractAddress: ' + contractAddress);
      }, (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.
        console.log('Failed to create new object, with error code: ' + error.message);
      });
  }
}

async function HandleNetworkSwitch(networkName) {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...networks[networkName]
        }]
    });
  } catch (err) {
    console.log(err.message);
  }
}

async function SetCollectionAsRevealed(collectionName) {

  const Collections = Moralis.Object.extend("Collections");
  const query = new Moralis.Query(Collections);
  query.equalTo("collectionName", collectionName);
  const results = await query.find();

  if (results.length > 0) {
    const object = results[0];

    object.set("Revealed", true);
    await object.save()
        .then((object) => {
            // Execute any logic that should take place after the object is saved.
            console.log('Collection successfully set as revealed.');
        }, (error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            console.log('Failed to set collection as revealed, with error code: ' + error.message);
        });
  }
}


const chains = {
  ethereum: {
    chainId: `0x${Number(1).toString(16)}`,
    chainName: "Ethereum Mainnet",
    currencyName: "Ether",
    currencySymbol: "ETH",
    rpcUrls: "https://api.mycryptoapi.com/eth/",
    blockExplorerUrls: "https://etherscan.io/"
  },
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    rpcUrls: "https://polygon-rpc.com/",
    blockExplorerUrls: "https://polygonscan.com/"
  },
  polygon_Mumbai: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Mumbai",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    rpcUrls: "https://matic-mumbai.chainstacklabs.com/",
    blockExplorerUrls: "https://mumbai.polygonscan.com/"
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    currencyName: "Binance Chain Native Token",
    currencySymbol: "BNB",
    rpcUrls: 
      "https://bsc-dataseed1.binance.org",
    blockExplorerUrls: "https://bscscan.com"
  }

  // "0x1"    - Ethereum Mainnet
  // "0x38"   - BSC
  // "0x89"   - Polygon
  // "0xA4B1" - Arbitrum
  // "0xA"    - Optimism
  // https://chainlist.org/
};

export async function SwitchNetwork(chainName){

  const web3Provider = await Moralis.enableWeb3();

  if(chainName !== "ethereum") {
    // add network, if it is not added already
    await Moralis.addNetwork(
      chains[chainName].chainId,
      chains[chainName].chainName,
      chains[chainName].currencyName,
      chains[chainName].currencySymbol,
      chains[chainName].rpcUrls,
      chains[chainName].blockExplorerUrls
    );
  }
  
  const chainIdHex = await Moralis.switchNetwork(chains[chainName].chainId);
  console.log("chainIdHex: " + chainIdHex);

  return true;
}