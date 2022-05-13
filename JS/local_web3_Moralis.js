import Moralis from "moralis"

const ethers = Moralis.web3Library;
export const BYTES_contract = "0x7d647b1A0dcD5525e9C6B3D14BE58f27674f8c95";

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

export async function CheckPreSaleActive_Moralis(collectionName) {
  // add a check for correct network
  const saleActive = await MoralisRead(collectionName, "allowListSaleActive");
  console.log("presaleActive: " + saleActive);

  document.getElementById('Interact_CheckPreSaleActiveDisplay').innerText = saleActive;
  document.getElementById('Interact_CheckPreSaleActiveDisplay').style.visibility = "visible";
}

export async function CheckAuctionActive_Moralis(collectionName) {
  // add a check for correct network
  const auctionActive = await MoralisRead(collectionName, "auctionActive");
  console.log("auctionActive: " + auctionActive);

  document.getElementById('Interact_CheckAuctionActiveDisplay').innerText = auctionActive;
  document.getElementById('Interact_CheckAuctionActiveDisplay').style.visibility = "visible";
}

export async function CheckPublicSaleActive_Moralis(collectionName) {
  // add a check for correct network
  const saleActive = await MoralisRead(collectionName, "publicSaleActive");
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
  await Moralis.enableWeb3();

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

export async function PublicMint_Moralis(collectionName) {

  // get the mint price
  const mintPrice_hex = await MoralisRead(collectionName, "MINT_PRICE_PUBLIC"); // will give an array with a hex value
  const mintPrice = parseInt(mintPrice_hex['_hex'], 16);
  console.log("mintPrice: " + mintPrice);

  //const numTokens = parseInt(document.getElementById('Interact_MintInput').value);
  var numTokens = parseInt(document.getElementById('Interact_MintInput').value);
  if(!numTokens){numTokens = 1;}


  // do the mint
  const params = {
    numTokens: numTokens,
  }
  await MoralisWrite__(collectionName, "publicSaleMint", params, numTokens * mintPrice);
}

export async function AuctionMint_Moralis(collectionName) {

  // get the mint price
  const mintPrice_hex = await MoralisRead(collectionName, "getAuctionPrice"); // will give an array with a hex value
  console.log("mintPrice_hex: " + mintPrice_hex);

  const mintPrice = parseInt(mintPrice_hex['_hex'], 16);
  console.log("mintPrice: " + mintPrice);

  //const numTokens = parseInt(document.getElementById('Interact_AuctionInput').value);
  var numTokens = parseInt(document.getElementById('Interact_AuctionInput').value);
  if(!numTokens){numTokens = 1;}

  // do the mint
  const params = {
    numTokens: numTokens,
  }
  await MoralisWrite__(collectionName, "auctionMint", params, numTokens * mintPrice);
}

export async function AllowListMint_Moralis(collectionName) {

  const web3Provider = await Moralis.enableWeb3();
  const account = await web3Provider.getSigner().getAddress();
  console.log("account: " + account);

  // need to await the return from fetch... the proof
  const proof = await fetch(`https://easylaunchnft.com/api/api-getMerkleProof` + '?id=' + account + '&collectionName=' + collectionName).then(res => res.json());
  console.log("proof: " + proof);
  if(proof == "" || proof == " "){
    throw ({"message" : "Address is not listed for presale"});
  }

  // get the mint price
  const mintPrice_hex = await MoralisRead(collectionName, "MINT_PRICE_ALLOWLIST"); // will give an array with a hex value
  const mintPrice = parseInt(mintPrice_hex['_hex'], 16);
  console.log("mintPrice: " + mintPrice);

  //const numTokens = parseInt(document.getElementById('Interact_AllowListMintInput').value);
  var numTokens = parseInt(document.getElementById('Interact_AllowListMintInput').value);
  if(!numTokens){numTokens = 1;}

  // do the mint
  const params = {
    numTokens: numTokens,
    //proof: ethers.utils.formatBytes32String(proof),  // for a single
    //proof: proof.map(pr => ethers.utils.formatBytes32String(pr)),
    proof: proof,
  }
  await MoralisWrite__(collectionName, "mintAllowList", params, numTokens * mintPrice);
}

export async function DevMint_Moralis(collectionName) {

  //const numTokens = document.getElementById('Interact_DevMintInput').value;
  var numTokens = parseInt(document.getElementById('Interact_DevMintInput').value);
  if(!numTokens){numTokens = 1;}

  const params = {
    numTokens: numTokens,
  }
  await MoralisWrite_(collectionName, "devMint", params);
}

export async function SetPublicSaleActive_Moralis(collectionName) {

  const params = {
    _publicSaleActive: true,
  }

  await MoralisWrite_(collectionName, "setPublicSaleActive", params);
}

export async function SetPreSaleActive_Moralis(collectionName) {

  const params = {
    _allowListSaleActive: true,
  }

  await MoralisWrite_(collectionName, "setAllowListSaleActive", params);
}

export async function SetAuctionActive_Moralis(collectionName) {

  const params = {
    _auctionActive: true,
  }

  await MoralisWrite_(collectionName, "setAuctionActive", params);
}

export async function PausePublicSale_Moralis(collectionName) {

  const params = {
    _publicSaleActive: false,
  }

  await MoralisWrite_(collectionName, "setPublicSaleActive", params);
}

export async function PausePreSale_Moralis(collectionName) {

  const params = {
    _allowListSaleActive: false,
  }

  await MoralisWrite_(collectionName, "setAllowListSaleActive", params);
}

export async function PauseAuction_Moralis(collectionName) {

  const params = {
    _auctionActive: false,
  }

  await MoralisWrite_(collectionName, "setAuctionActive", params);
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
  // we have removed this from the contract
  // await MoralisWrite(collectionName, "reveal");

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

export async function setAllowListRoot_Moralis(collectionName) {

  // get the root hash
  const Collections = Moralis.Object.extend("Collections");
  const query = new Moralis.Query(Collections);
  query.equalTo("collectionName", collectionName);
  const results = await query.find();

  if (results.length > 0) {
    const object = results[0];
    const rootHash = '0x' + object.get("rootHash");

    console.log(ethers.utils.hexlify(rootHash));

    const params = {
      _root: ethers.utils.hexlify(rootHash)
    }
    await MoralisWrite_(collectionName, "setAllowListRoot", params);
  }
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

let minABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];

// check if address has enough custom tokens - 1000 BYTES
async function CheckIfAddressHasEnoughBytes(walletAddress){

  const web3Provider = await Moralis.enableWeb3();
  const signer = web3Provider.getSigner()

  console.log( signer);
  console.log("walletAddress: " + walletAddress);

  
  const newContract = new ethers.Contract(BYTES_contract, minABI, web3Provider);
  const balance = await newContract.balanceOf(walletAddress.toString());
  const amountOfBytes = ethers.utils.formatUnits(balance, 18);
  console.log(amountOfBytes)

  if(amountOfBytes >= 1000){
    return true;
  }
  else {
    return false;
  }
}

async function PreDeployment_Moralis(collectionName){

  // get the paymentOption
  const params_ =  { collectionName: collectionName};
  const paymentOption = await Moralis.Cloud.run("GetCollectionPaymentOption", params_);

  if(paymentOption.toLowerCase() == "royalty"){
    return true; // 0 upfront consts anyway
  }else if (paymentOption.toLowerCase() == "paid") {
    return true; // already paid
  } else {

    // check that we are on ETH - otherwise return false
    const web3Provider = await Moralis.enableWeb3();
    const network = await web3Provider.getNetwork();
    //if(network.chainId != 1){
      // messages on this level don't work, bc they are overwritten
      //document.getElementById('submitFeedback').style.display = 'inline';
      //document.getElementById('submitFeedback').innerText = 'Deployment with $BYTES only possible on ETH mainnet. Reconfigure the contract if you want to deploy on this chain.';
    //  return false;
    //}

    // BASIC ETH transfer
    await Moralis.enableWeb3();
    const options_ETH = {
      type: "native",
      amount: Moralis.Units.ETH("0.2"),
      receiver: "0x1591C783EfB2Bf91b348B6b31F2B04De1442836c", // platform wallet
    };
    // ERC20 token transfer
    const options = {
      type: "erc20",
      amount: Moralis.Units.Token("1000", "18"),
      receiver: "0x1591C783EfB2Bf91b348B6b31F2B04De1442836c", // platform wallet
      contractAddress: BYTES_contract,
      
      // "0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",  // fake PBR - test
      // "0x7d647b1A0dcD5525e9C6B3D14BE58f27674f8c95",  // BYTES contract
    };

    let result = await Moralis.transfer(options).
    catch((error) => {
      // messages on this level don't work, bc they are overwritten
      //document.getElementById('submitFeedback').style.display = 'inline';
      //document.getElementById('submitFeedback').innerText = 'NOT ENOUGH $BYTES on ETH mainnet';
      return false;
    });

    if (result){
      // TODO:
      // update DB that the 1st Tx was paid - this way if they cancel they 2nd Tx, next time if won't be neccessary to pay the 1st Tx again
      return true;
    }

    return false;
  }
}

export async function DeployContract_Moralis(collectionName, userAccount) {

  // figure out if the user has to pay in bytes before deployment - in which case it would be 2 Txs
  const preDeploymentSuccess = await PreDeployment_Moralis(collectionName);
  if(!preDeploymentSuccess){
    console.log("predeployment failed");
    document.getElementById('submitFeedback').style.display = 'inline';
    document.getElementById('submitFeedback').innerText = 'not enough $BYTES on ETH mainnet';
    return false;
  }


  // ----------------------------------------------------------

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
    document.getElementById('submitFeedback').style.display = 'inline';
    document.getElementById('submitFeedback').innerText = 'User denied transaction';
    return false;
  });


  const signer = web3Provider.getSigner()
  console.log("collectionName: " + collectionName)
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


  const chainId  = (await web3Provider.getNetwork()).chainId;
  AddCollectionAddressToMoralisDB(collectionName, contract.address, chainId);

  return true;
}




// AUXILIARY functions 
export async function GetWallet_NonMoralis(){
  if (window.ethereum) {
    try {
      const connectedAddress = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("connectedAddress: " + connectedAddress)
      return connectedAddress
    } catch (error) {
      if (error.code === 4001) {
        // User rejected request
        console.log('user denied request');
      }
      console.log('error: ' + error);
    }
  }
}

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

  // "0x1"      - Ethereum Mainnet
  // "0x3"      - ropsten (ETH testnet)
  // "0x4"      - rinkeby (ETH testnet)    
  // "0x38"     - BSC
  // "0x61"     - BSC Tesnet
  // "0x89"     - Polygon
  // "0x13881"  - Mumbai
  // "0xA4B1"   - Arbitrum
  // "0xA"      - Optimism
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