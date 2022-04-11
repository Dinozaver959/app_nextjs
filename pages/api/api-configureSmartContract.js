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


async function UpdateCollectionInMoralisDB(maxSupply, mintPrice, maxToMint, tokenName, tokenSymbol, collectionName) {
    
    const Collections = Moralis.Object.extend("Collections");
    const query = new Moralis.Query(Collections);
    query.equalTo("collectionName", collectionName);
    const results = await query.find();

    LogBackend("results.length: " + results.length);
  
    if (results.length > 0) {
        const object = results[0];

        object.set("maxSupply", maxSupply);
        object.set("mintPrice", mintPrice);
        object.set("maxToMint", maxToMint);
        object.set("tokenName", tokenName);
        object.set("tokenSymbol", tokenSymbol);
        object.set("collectionName", collectionName);

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

async function UpdateSettingsFile(maxSupply, mintPrice, maxToMint, tokenName, tokenSymbol, collectionName) {
    var insertMaxSupply = "MAX_SUPPLY=10000 MAX_SUPPLY=" + maxSupply;
    var insertMintPrice = "MINT_PRICE=0.095 MINT_PRICE=" + mintPrice;
    var insertMaxToMint = "MAX_TO_MINT=10 MAX_TO_MINT=" + maxToMint;
    var insertTokenName = "_NAME_ " + tokenName;
    var insertTokenSymbol = "_SYMBOL_ " + tokenSymbol;
    var insertCollectionName = "CONTRACT_NAME " + collectionName;  // keep it like this for now

    var stringToWrite = 
        insertMaxSupply + "\n" +
        insertMintPrice + "\n" +
        insertMaxToMint + "\n" +
        insertTokenName + "\n" +
        insertTokenSymbol + "\n" +
        insertCollectionName;

    fs.writeFileSync(path.join(__dirname, "..", "..", "..", "..", "PowerShell", "TEMPLATE_CM", "Settings.txt"), stringToWrite, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The Settings.txt file was saved!");
        LogBackend("The Settings.txt file was saved!");
    })


    
    // now copy the dir "PowerShell/TEMPLATE_CM"   to "PowerShell/CollectionName"
    const srcDir = path.join(__dirname, "..", "..", "..", "..", "PowerShell", "TEMPLATE_CM");
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

    var maxSupply, mintPrice, maxToMint, tokenName, tokenSymbol, collectionName, userAccount;

    if (DOMPurify.isSupported) {
        maxSupply = DOMPurify.sanitize(req.body.MAX_SUPPLY[0]);
        mintPrice = DOMPurify.sanitize(req.body.MINT_PRICE[0]);
        maxToMint = DOMPurify.sanitize(req.body.MAX_TO_MINT[0]);
        tokenName = DOMPurify.sanitize(req.body._NAME_[0]);
        tokenSymbol = DOMPurify.sanitize(req.body._SYMBOL_[0]);
        collectionName = DOMPurify.sanitize(req.body.CollectionName[0]);
        userAccount = DOMPurify.sanitize(req.body.UserAccount[0]);
    }

    // if user does not owns the collection - redirect to home page
    if(! await CheckIfUserOwnsCollection(collectionName, userAccount)){
        console.log("USER DOES NOT OWN THE COLLECTION!")
        LogBackend("USER DOES NOT OWN THE COLLECTION!")
        res.status(501).end("nope...not gonna work");
    }
    
    UpdateCollectionInMoralisDB(maxSupply, mintPrice, maxToMint, tokenName, tokenSymbol, collectionName);
    UpdateSettingsFile(maxSupply, mintPrice, maxToMint, tokenName, tokenSymbol, collectionName);
    RunCompileSmartContractScript(collectionName);

    res.status(201).end("configuration added and smart contract created");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute