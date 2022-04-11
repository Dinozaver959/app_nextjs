import Moralis from "moralis"

const ethers = Moralis.web3Library;

// READ Functions 

export async function CheckTotalSupply_Moralis() {
  // add a check for correct network
  const supply_hex = await MoralisRead("totalSupply"); // will give an array with a hex value
  const supply = parseInt(supply_hex['_hex'], 16);
  console.log("supply: " + supply);
}

export async function CheckContractName_Moralis() {
  // add a check for correct network
  const name = await MoralisRead("name");
  console.log("name: " + name);
}

export async function CheckContractSymbol_Moralis() {
  // add a check for correct network
  const symbol = await MoralisRead("symbol");
  console.log("symbol: " + symbol);
}

export async function CheckSaleActive_Moralis() {
  // add a check for correct network
  const saleActive = await MoralisRead("saleActive");
  console.log("saleActive: " + saleActive);
}

export async function CheckTokenURI_Moralis() {
  // add a check for correct network

  const params = {
    tokenId: 0,
  }

  const tokenURI = await MoralisRead_("tokenURI", params);
  console.log("tokenURI: " + tokenURI);
}

export async function CheckIfRevealed_Moralis() {
  // add a check for correct network
  const revealed = await MoralisRead("revealed");
  console.log("revealed: " + revealed);
}

async function MoralisRead(method) {
  MoralisRead_(method, {})
}

async function MoralisRead_(method, params) {

  // <-- this is needed if there was no authentication - good for read only
  const web3Provider = await Moralis.enableWeb3();

  console.log("method: " + method);

  const contractAddress = GetContractAddress();
  const ABI = GetABI();

  const readOptions = {
    contractAddress: contractAddress,
    functionName: method,
    abi: ABI,
    params: params
  };

  const message = await Moralis.executeFunction(readOptions);
  console.log(message);

  return message;
}

// WRITE functions

export async function Mint_Moralis() {

  // get the mint price
  const mintPrice_hex = await MoralisRead("MINT_PRICE"); // will give an array with a hex value
  const mintPrice = parseInt(mintPrice_hex['_hex'], 16);
  console.log("mintPrice: " + mintPrice);

  // do the mint
  const params = {
    numTokens: 1,
  }
  await MoralisWrite_("mint", params, mintPrice);
}

export async function SetSaleActive_Moralis() {

  const params = {
    _saleActive: true,
  }

  await MoralisWrite("setSaleActive", params);
}

export async function UpdateBaseURI_Moralis() {

  const baseURI = document.getElementById('UpdateBaseURI_text').value;

  const params = {
    baseURI_: baseURI,
  }

  await MoralisWrite("setBaseURI", params);
}

async function MoralisWrite(method, params) {
  MoralisWrite_(method, params, 0);
}

async function MoralisWrite_(method, params, value) {

  // <-- this is needed if there was no authentication - good for read only
  const web3Provider = await Moralis.enableWeb3();

  console.log("method: " + method);

  const contractAddress = GetContractAddress();
  const ABI = GetABI();

  const writeOptions = {
    contractAddress: contractAddress,
    functionName: method,
    abi: ABI,
    params: params,
    msgValue: value
  };

  const transaction = await Moralis.executeFunction(writeOptions);
  console.log("transaction hash: " + transaction.hash);

  await transaction.wait();
  console.log("transaction is confirmed");
}

export async function DeployContract_Moralis(collectionName) {



  const web3Provider = await Moralis.enableWeb3();
  await web3Provider.send("eth_requestAccounts", []);
  const signer = web3Provider.getSigner()

  
  let bytecode_compiled = GetBytecode();
    const ABI = GetABI();

  let factory = new ethers.ContractFactory(ABI, bytecode_compiled, signer);
  let contract = await factory.deploy();

  console.log(contract.address);
  console.log(contract.deployTransaction.hash);

  await contract.deployed();
  console.log("contract has been deployed....!");

  // update Moralis DB with collection name-contract address
 //const collectionName = getSelectedCollectionName_Interation();

  // const collectionName = document.getElementById("CollectionName").value;
  AddCollectionAddressToMoralisDB(collectionName, contract.address);
}


// Auxiliary functions 

async function GetContractAddress() {
  var collectionName = getSelectedCollectionName_Interation();
  console.log("collectionName: " + collectionName);

  // now get the address of this contract
  const Collections = Moralis.Object.extend("Collections");
  const query = new Moralis.Query(Collections);
  query.equalTo("collectionName", collectionName);
  query.exists("contractAddress");
  const results = await query.find();

  var address = results[0].get("contractAddress");
  console.log("contract address: " + address);
  //var testMumbai_address = "0x71C0D7F8312d4A73d105c7567938aa58a84A9350";

  return address;
}

function GetABI() {
  let ABI_compiled = getFileContent('..\\api\\api-ABI', true);
  return JSON.parse(JSON.parse(JSON.stringify(ABI_compiled)));
}

function GetBytecode() {
  return getFileContent('..\\api\\api-bytecode', true);
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

async function AddCollectionAddressToMoralisDB(collectionName, contractAddress) {
  const Collections = Moralis.Object.extend("Collections");
  const query = new Moralis.Query(Collections);
  query.equalTo("collectionName", collectionName);
  const results = await query.find();

  if (results.length > 0) {
    const object = results[0];
    console.log("object.id: " + object.id + ' - ' + "object.getCollectionName" + object.get(collectionName));

    object.set("contractAddress", contractAddress);

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
