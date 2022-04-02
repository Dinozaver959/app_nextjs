var web3;
window.connectedAddress; // making it global to be accessible in the deployContract.js


// local functions
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

async function UpdateConnectedAddrress() {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      connectedAddress = await window.ethereum.request({ method: 'eth_requestAccounts' });1
      console.log('action performed by account: ' + connectedAddress);
    } catch (error) {
      if (error.code === 4001) {
        // User rejected request
        console.log('user denied request');
      }
      console.log('error: ' + error);
    }
  }

}

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

function getSelectedCollectionName_Interation(){

    // for time being while we have the text field
    return document.getElementById('collectionNames_Interaction').innerText;

  var el = document.getElementById('collectionNames_Interaction');
  return el.options[el.selectedIndex].value;
}

async function InitializeSmartContract() {
  // need to read this from the IDelement on the index.ejs page
  var collectionName = getSelectedCollectionName_Interation();
  console.log("collectionName: " + collectionName);

  // now get the address of this contract
  const Collections = Moralis.Object.extend("Collections");
  const query = new Moralis.Query(Collections);
  query.equalTo("collectionName", collectionName);
  query.exists("contractAddress");
  const results = await query.find();
  
  if(results.length > 0){
    var testMumbai_address = results[0].get("contractAddress");
    //var testMumbai_address = "0x71C0D7F8312d4A73d105c7567938aa58a84A9350";
    console.log("contract address: " + testMumbai_address);

    let TEST_MumbaiABI_c = getFileContent("..\\COMPILED\\abi.txt", false);
    const TEST_MumbaiABI_compiled = JSON.parse(JSON.parse(JSON.stringify(TEST_MumbaiABI_c)));
    return (new web3.eth.Contract(TEST_MumbaiABI_compiled, testMumbai_address));
  }
  else
  {
    console.log("this cotnract hasn't been deployed yet! - no contract address in DB");
    return;
  }
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



// external functions
async function Connect() {
  UpdateConnectedAddrress();
  // after connecting you can display buttons
  document.getElementById('ConnectPART').style.display = 'inline';
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

async function CheckTotalSupply() {
  UpdateConnectedAddrress();
  const smartContract = await InitializeSmartContract();

  if(smartContract){
    smartContract.methods.totalSupply().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("Total supply: ", res)
    });
  }
}


async function Mint() {
  UpdateConnectedAddrress();
  const smartContract = await InitializeSmartContract();

  if(smartContract){

    // get the mint price directly from the contract
    smartContract.methods.MINT_PRICE().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("mint price: ", res);    

      // do the actual mint
      let parameters = {
        from: connectedAddress.toString(),
        value: res       // value: web3.utils.toWei(0.1, 'ether'),     // needs to be specified -> we can send a read Tx to the blockchain
      }

      smartContract.methods.mint(1)
        .send(parameters, function (err, res) {
          if (err) {
            console.log("An error occured", err)
            return
          }
          console.log("mint Tx sent. Tx hash: ", res)
        })
        .on('receipt', function (receipt) {
          console.log("Transacation has been included on the blockchain");
        })
        .on('error', function (error, receipt) {
          console.log("error: " + error);
        });
    });
  }
}

async function CheckContractName() {
  UpdateConnectedAddrress();
  const smartContract = await InitializeSmartContract();

  if(smartContract){
    smartContract.methods.name().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("contract name: ", res)
    });
  }
}

async function CheckContractSymbol() {
  UpdateConnectedAddrress();
  const smartContract = await InitializeSmartContract();

  if(smartContract){
    smartContract.methods.symbol().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("contract symbol: ", res)
    });
  }
}

async function CheckSaleActive() {
  UpdateConnectedAddrress();
  const smartContract = await InitializeSmartContract();

  if(smartContract){
    smartContract.methods.saleActive().call(function (err, res) {
      if (err) {
        console.log("An error occured: ", err)
        return
      }
      console.log("Sale active: " + res)
    });
  }
}

async function SetSaleActive() {
  UpdateConnectedAddrress();
  const smartContract = await InitializeSmartContract();

  if(smartContract){
    smartContract.methods.setSaleActive("true")
      .send({ from: connectedAddress.toString() }, function (err, res) {
        if (err) {
          console.log("An error occured", err)
          return
        }
        console.log("sale activation Tx sent. Tx hash: ", res)
      })
      .on('receipt', function (receipt) {
        console.log("Transacation has been included on the blockchain");
      })
      .on('error', function (error, receipt) {
        console.log("error: " + error);
      });
  }
}

async function CheckTokenURI() {
  UpdateConnectedAddrress();
  const smartContract = await InitializeSmartContract();

  if(smartContract){
    smartContract.methods.tokenURI(0).call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("Current token-0 URI: ", res)
    });
  }
}

async function UpdateBaseURI() {
  UpdateConnectedAddrress();
  const smartContract = await InitializeSmartContract();

  const baseURI = document.getElementById('UpdateBaseURI_text').value;

  if(smartContract){
    smartContract.methods.setBaseURI(baseURI)
      .send({ from: connectedAddress.toString() }, function (err, res) {
        if (err) {
          console.log("An error occured", err)
          return
        }
        console.log("UpdateBaseURI Tx sent. Tx hash: ", res)
      })
      .on('receipt', function (receipt) {
        console.log("Transacation has been included on the blockchain");
      })
      .on('error', function (error, receipt) {
        console.log("error: " + error);
      });
  }
}

async function CheckIfRevealed() {
  UpdateConnectedAddrress();
  const smartContract = await InitializeSmartContract();

  if(smartContract){
    smartContract.methods.revealed().call(function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("Revealed: "  + res)
    });
  }
}

async function Reveal(){
  UpdateConnectedAddrress();
  const smartContract = await InitializeSmartContract();

  if(smartContract){
    smartContract.methods.reveal()
      .send({ from: connectedAddress.toString() }, function (err, res) {
        if (err) {
          console.log("An error occured", err)
          return
        }
        console.log("UpdateBaseURI Tx sent. Tx hash: ", res)
      })
      .on('receipt', function (receipt) {
        console.log("Transacation has been included on the blockchain");

        // on confirmation -> update DB that the collection has been revealed
        var collectionName = getSelectedCollectionName_Interation();
        SetCollectionAsRevealed(collectionName); // in moralis.js
      })
      .on('error', function (error, receipt) {
        console.log("error: " + error);
      });
  }
}

async function DeployContract() {
  // defined at the TOP
  let TEST_MumbaiABI_c = getFileContent('..\\COMPILED\\abi.txt', false);
  const TEST_MumbaiABI_compiled = JSON.parse(JSON.parse(JSON.stringify(TEST_MumbaiABI_c)));
  let bytecode_compiled = getFileContent('..\\COMPILED\\bytecode.txt', true);
  let deploy_contract = new web3.eth.Contract(TEST_MumbaiABI_compiled)

  // assuming that a connection was made - good enought for now - quick development
  let senderAddress = connectedAddress;

  let payload = {
    data: bytecode_compiled
  }

  let parameter = {
    from: senderAddress.toString(),
    // gas: web3.utils.toHex(20000000),
    // gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei'))
  }

  deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
    console.log('Transaction Hash :', transactionHash);
  })
    .on('confirmation', () => { }).then((newContractInstance) => {
      console.log('Deployed Contract Address : ', newContractInstance.options.address);

      // update Moralis DB with collection name-contract address
      const collectionName = document.getElementById("collectionNames_DeployContract").value;
      AddCollectionAddressToMoralisDB(collectionName, newContractInstance.options.address);
    })
}

