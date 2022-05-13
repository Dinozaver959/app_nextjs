import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import {LogBackend} from '../../JS/backendLog'
import {CheckIfUserOwnsCollection} from '../../JS/DB-cloudFunctions'

var Moralis = require("moralis/node");
var fs = require("fs");
var fse = require('fs-extra')
var path = require("path");
const DOMPurify = require('isomorphic-dompurify');
const { spawn } = require('child_process');

const serverUrl = "https://p2r5bzcvt2aq.usemoralis.com:2053/server";
const appId = "mCUbGlwPmuitdPxm5K3mtjhoGL1ENmyMIgffO5U7";
Moralis.start({ serverUrl, appId });

const apiRoute = nextConnect()
apiRoute.use(middleware)


async function UpdateCollectionInMoralisDB (collectionName, tokenName, tokenSymbol, maxSupply, maxToMint, mintPrice, devAllocation, _ALLOWLIST_, maxSupplyAllowList, maxToMintAllowList, mintPriceAllowList, 
    _DUTCHAUCTION_, maxSupplyDutchAuction, maxToMintDutchAuction, mintPriceStartDutchAuction, mintPriceEndDutchAuction, durationDutchAuction, priceIntervalDutchAuction, paymentOption) {

    const Collections = Moralis.Object.extend("Collections");
    const query = new Moralis.Query(Collections);
    query.equalTo("collectionName", collectionName);
    const results = await query.find();

    LogBackend("results.length: " + results.length);
  
    if (results.length > 0) {
        const object = results[0];

        object.set("collectionName", collectionName);
        object.set("tokenName", tokenName);
        object.set("tokenSymbol", tokenSymbol);
        object.set("maxSupply", maxSupply);
        object.set("maxToMint", maxToMint);
        object.set("mintPrice", mintPrice);
        object.set("devAllocation", devAllocation);

        object.set("ALLOWLIST", _ALLOWLIST_);
        object.set("maxSupplyAllowList", maxSupplyAllowList);
        object.set("maxToMintAllowList", maxToMintAllowList);
        object.set("mintPriceAllowList", mintPriceAllowList);

        object.set("DUTCHAUCTION", _DUTCHAUCTION_);
        object.set("maxSupplyDutchAuction", maxSupplyDutchAuction);
        object.set("maxToMintDutchAuction", maxToMintDutchAuction);
        object.set("mintPriceStartDutchAuction", mintPriceStartDutchAuction);
        object.set("mintPriceEndDutchAuction", mintPriceEndDutchAuction);
        object.set("durationDutchAuction", durationDutchAuction);
        object.set("priceIntervalDutchAuction", priceIntervalDutchAuction);
        object.set("paymentOption", paymentOption);

        await object.save()
        .then((object) => {
            // Execute any logic that should take place after the object is saved.
            console.log('New object created with objectId: ' + object.id);
            console.log('collectionName: ' + collectionName);

        }, (error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
    else
    {
        console.log("not a single collection exist with this name: " + collectionName);
    }
}

async function UpdateSettingsFile(collectionName, tokenName, tokenSymbol, maxSupply, maxToMint, mintPrice, devAllocation, maxSupplyAllowList, maxToMintAllowList, mintPriceAllowList, 
    maxSupplyDutchAuction, maxToMintDutchAuction, mintPriceStartDutchAuction, mintPriceEndDutchAuction, durationDutchAuction, priceIntervalDutchAuction, paymentOption) {

    var insertCollectionName = "CONTRACT_NAME " + collectionName;  // keep it like this for now
    var insertTokenName = "_NAME_ " + tokenName;
    var insertTokenSymbol = "_SYMBOL_ " + tokenSymbol;
    var insertMaxSupply = "MAX_SUPPLY=10000 MAX_SUPPLY=" + maxSupply;
    var insertmaxToMint = "MAX_PER_ADDRESS_DURING_MINT_PUBLIC=20 MAX_PER_ADDRESS_DURING_MINT_PUBLIC=" + maxToMint;
    var insertMintPrice = "MINT_PRICE_PUBLIC=0.06 MINT_PRICE_PUBLIC=" + mintPrice;
    var insertDevAllocation = "AMOUNT_FOR_DEVS=100 AMOUNT_FOR_DEVS=" + devAllocation;

    var insertMaxSupplyAllowList = "AMOUNT_FOR_ALLOWLIST=1000 AMOUNT_FOR_ALLOWLIST=" + maxSupplyAllowList;
    var insertMaxToMintAllowList = "MAX_PER_ADDRESS_DURING_MINT_ALLOWLIST=3 MAX_PER_ADDRESS_DURING_MINT_ALLOWLIST=" + maxToMintAllowList;
    var insertMintPriceAllowList = "MINT_PRICE_ALLOWLIST=0.05 MINT_PRICE_ALLOWLIST=" + mintPriceAllowList;

    var insertMaxSupplyDutchAuction = "AMOUNT_FOR_AUCTION=500 AMOUNT_FOR_AUCTION=" + maxSupplyDutchAuction;
    var insertMaxToMintDutchAuction = "MAX_PER_ADDRESS_DURING_MINT_AUCTION=1 MAX_PER_ADDRESS_DURING_MINT_AUCTION=" + maxToMintDutchAuction;
    var insertMintPriceStartDutchAuction = "AUCTION_START_PRICE=1 AUCTION_START_PRICE=" + mintPriceStartDutchAuction;
    var insertMintPriceEndDutchAuction = "AUCTION_END_PRICE=0.15 AUCTION_END_PRICE=" + mintPriceEndDutchAuction;
    var insertDurationDutchAuction = "AUCTION_PRICE_CURVE_LENGTH=340 AUCTION_PRICE_CURVE_LENGTH=" + durationDutchAuction;
    var insertPriceIntervalDutchAuction = "AUCTION_DROP_INTERVAL=20 AUCTION_DROP_INTERVAL=" + priceIntervalDutchAuction;

    
    var insertPlatformRoyalty;
    if(paymentOption == 'royalty' || paymentOption == 'Royalty'){
        insertPlatformRoyalty = "PLATFORM_ROYALTY=200 PLATFORM_ROYALTY=50"; // 5%
    } else {
        insertPlatformRoyalty = "PLATFORM_ROYALTY=200 PLATFORM_ROYALTY=0";  // 0%
    }

    var stringToWrite = 
        insertCollectionName + "\n" +        
        insertTokenName + "\n" +
        insertTokenSymbol + "\n" +
        insertMaxSupply + "\n" +
        insertmaxToMint + "\n" +
        insertMintPrice + "\n" +
        insertDevAllocation + "\n" +
        insertMaxSupplyAllowList + "\n" +
        insertMaxToMintAllowList + "\n" +
        insertMintPriceAllowList + "\n" +
        insertMaxSupplyDutchAuction + "\n" +
        insertMaxToMintDutchAuction + "\n" +
        insertMintPriceStartDutchAuction + "\n" +
        insertMintPriceEndDutchAuction + "\n" +
        insertDurationDutchAuction + "\n" +
        insertPriceIntervalDutchAuction + "\n" +
        insertPlatformRoyalty;

    fs.writeFileSync(path.join(__dirname, "..", "..", "..", "..", "PowerShell", "TEMPLATE_AZUKI", "Settings.txt"), stringToWrite, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The Settings.txt file was saved!");
        LogBackend("The Settings.txt file was saved!");
    })

    
    // now copy the dir "PowerShell/TEMPLATE_AZUKI"   to "PowerShell/CollectionName"
    const srcDir = path.join(__dirname, "..", "..", "..", "..", "PowerShell", "TEMPLATE_AZUKI");
    const destDir = path.join(__dirname, "..", "..", "..", "..", "PowerShell", collectionName);

    fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
        if (err) {                 
            console.error(err); 
        } else {
            console.log("success!");
        }
    });

}

async function RunCompileSmartContractScript(collectionName) {

    const ls = spawn('/usr/bin/pwsh', [path.join(__dirname, "..", "..", "..", "..", "PowerShell", "Script.ps1"), collectionName]);

    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        LogBackend(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        LogBackend(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        LogBackend(`child process exited with code ${code}`);
    });
}


apiRoute.post(async (req, res) => {

    var collectionName, userAccount, tokenName, tokenSymbol, maxSupply, maxToMint, mintPrice, 
    devAllocation, _ALLOWLIST_, _DUTCHAUCTION_, paymentOption;

    var maxSupplyAllowList, maxToMintAllowList, mintPriceAllowList;
    maxSupplyAllowList = maxToMintAllowList = mintPriceAllowList = 0;
    var maxSupplyDutchAuction, maxToMintDutchAuction, mintPriceStartDutchAuction, 
    mintPriceEndDutchAuction, durationDutchAuction, priceIntervalDutchAuction;
    maxSupplyDutchAuction = maxToMintDutchAuction = mintPriceStartDutchAuction = mintPriceEndDutchAuction = 0;
    durationDutchAuction = priceIntervalDutchAuction = 1; // avoid division by 0

    if (DOMPurify.isSupported) {
        collectionName = DOMPurify.sanitize(req.body.CollectionName[0]);
        userAccount = DOMPurify.sanitize(req.body.UserAccount[0]);
        tokenName = DOMPurify.sanitize(req.body._NAME_[0]);
        tokenSymbol = DOMPurify.sanitize(req.body._SYMBOL_[0]);

        maxSupply = parseInt(DOMPurify.sanitize(req.body.MAX_SUPPLY[0]));
        maxToMint = parseInt(DOMPurify.sanitize(req.body.MAX_TO_MINT[0]));
        mintPrice = parseFloat(DOMPurify.sanitize(req.body.MINT_PRICE[0]));
        devAllocation = parseInt(DOMPurify.sanitize(req.body.DEV_ALLOCATION[0]));
        
        _ALLOWLIST_ = DOMPurify.sanitize(req.body._ALLOWLIST_[0]);
        if(_ALLOWLIST_ == "Yes" || _ALLOWLIST_ == 'YES' || _ALLOWLIST_ == 'yes'){
            maxSupplyAllowList = parseInt(DOMPurify.sanitize(req.body.MAX_SUPPLY_ALLOWLIST[0]));
            maxToMintAllowList = parseInt(DOMPurify.sanitize(req.body.MAX_TO_MINT_ALLOWLIST[0]));
            mintPriceAllowList = parseFloat(DOMPurify.sanitize(req.body.MINT_PRICE_ALLOWLIST[0]));            
        }

        _DUTCHAUCTION_ = DOMPurify.sanitize(req.body._DUTCHAUCTION_[0]);
        if(_DUTCHAUCTION_ == "Yes" || _DUTCHAUCTION_ == 'YES' || _DUTCHAUCTION_ == 'yes'){
            maxSupplyDutchAuction = parseInt(DOMPurify.sanitize(req.body.MAX_SUPPLY_DUTCHAUCTION[0]));
            maxToMintDutchAuction = parseInt(DOMPurify.sanitize(req.body.MAX_TO_MINT_DUTCHAUCTION[0]));
            mintPriceStartDutchAuction = parseFloat(DOMPurify.sanitize(req.body.MINT_PRICE_DUTCHAUCTION_START[0]));
            mintPriceEndDutchAuction = parseFloat(DOMPurify.sanitize(req.body.MINT_PRICE_DUTCHAUCTION_END[0]));
            durationDutchAuction = parseInt(DOMPurify.sanitize(req.body.DURATION_DUTCHAUCTION[0]));
            priceIntervalDutchAuction = parseInt(DOMPurify.sanitize(req.body.PRICE_INTERVAL_DUTCHAUCTION[0]));
        }

        paymentOption = DOMPurify.sanitize(req.body._OPTION_[0]);
    }

    // if user does not owns the collection - redirect to home page
    if(! await CheckIfUserOwnsCollection(collectionName, userAccount)){
        console.log("USER DOES NOT OWN THE COLLECTION!")
        LogBackend("USER DOES NOT OWN THE COLLECTION!")
        res.status(501).end("nope...not gonna work");
    }
    



    console.log("collectionName: " + collectionName)
    console.log("tokenName: " + tokenName)
    console.log("tokenSymbol: " + tokenSymbol)
    console.log("maxSupply: " + maxSupply)
    console.log("maxToMint: " + maxToMint)
    console.log("mintPrice: " + mintPrice)
    console.log("devAllocation: " + devAllocation)
    console.log("_ALLOWLIST_: " + _ALLOWLIST_)
    console.log("maxSupplyAllowList: " + maxSupplyAllowList)
    console.log("maxToMintAllowList: " + maxToMintAllowList)
    console.log("mintPriceAllowList: " + mintPriceAllowList)

    console.log("_DUTCHAUCTION_: " + _DUTCHAUCTION_)
    console.log("maxSupplyDutchAuction: " + maxSupplyDutchAuction)
    console.log("maxToMintDutchAuction: " + maxToMintDutchAuction)
    console.log("mintPriceStartDutchAuction: " + mintPriceStartDutchAuction)
    console.log("mintPriceEndDutchAuction: " + mintPriceEndDutchAuction)
    console.log("durationDutchAuction: " + durationDutchAuction)
    console.log("priceIntervalDutchAuction: " + priceIntervalDutchAuction)

    console.log("paymentOption: " + paymentOption)




    UpdateCollectionInMoralisDB(collectionName, tokenName, tokenSymbol, maxSupply, maxToMint, mintPrice, devAllocation, _ALLOWLIST_, maxSupplyAllowList, maxToMintAllowList, mintPriceAllowList, 
        _DUTCHAUCTION_, maxSupplyDutchAuction, maxToMintDutchAuction, mintPriceStartDutchAuction, mintPriceEndDutchAuction, durationDutchAuction, priceIntervalDutchAuction, paymentOption);

    UpdateSettingsFile(collectionName, tokenName, tokenSymbol, maxSupply, maxToMint, mintPrice, devAllocation, maxSupplyAllowList, maxToMintAllowList, mintPriceAllowList, 
        maxSupplyDutchAuction, maxToMintDutchAuction, mintPriceStartDutchAuction, mintPriceEndDutchAuction, durationDutchAuction, priceIntervalDutchAuction, paymentOption);

    RunCompileSmartContractScript(collectionName);

    res.status(201).end("configuration added and smart contract created");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute