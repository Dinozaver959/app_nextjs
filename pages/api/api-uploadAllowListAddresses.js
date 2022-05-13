import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import {LogBackend, CheckUploadedFileExtension} from '../../JS/backendLog'
import {CheckIfUserOwnsCollection} from '../../JS/DB-cloudFunctions'

var Moralis = require("moralis/node");
var fs = require("fs");
var fse = require('fs-extra')
var path = require("path");
const {MerkleTree} = require('merkletreejs');
const keccak256 = require("keccak256");

const serverUrl = "https://p2r5bzcvt2aq.usemoralis.com:2053/server";
const appId = "mCUbGlwPmuitdPxm5K3mtjhoGL1ENmyMIgffO5U7";
Moralis.start({ serverUrl, appId });

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
    console.log(req.body)
    console.log(req.files)
  
    const collectionName = req.body.CollectionName[0];
    const userAccount = req.body.UserAccount[0].toString();
    //const fileExtension = req.files['ALLOWLISTADDRESSES_FILE'][0].originalFilename.split('.')[1];
    const path = req.files['ALLOWLISTADDRESSES_FILE'][0].path;

    // if user does not owns the collection - redirect to home page
    if(! await CheckIfUserOwnsCollection(collectionName, userAccount)){
        console.log("USER DOES NOT OWN THE COLLECTION!")
        LogBackend("USER DOES NOT OWN THE COLLECTION!")
        res.status(501).end("nope...not gonna work");
        return;
    }

    // check if the file has correct extension
    if(!CheckUploadedFileExtension(path, "txt")){
        console.log("Invalid file extension!")
        LogBackend("Invalid file extension!")
        res.status(502).end("nope...not gonna work");
        return;
    }


    // -------------------------------------
    // 1. store file locally
    const newPathLocal = "/var/www/app_nextjs/AllowList/" + collectionName + "/" + "allowList.txt";


    // TODO: check if a file already exists... then rename the old one with a date/epoch as part of the file name


    /*
    await fse.move(path, newPathLocal, { overwrite: true }, function (err) {
        if (err) return console.error(err)
        console.log("success! AllowList file saved")
    });
    */

    await fse.move(path, newPathLocal, { overwrite: true })
        .then(() => {
            console.log("success! AllowList file saved");
        })
        .catch((error) => {
            console.error(error);

            res.status(501).end("there was an error");
        });


    // 2. load file into variable
    var allowListAddresses = fs.readFileSync(newPathLocal).toString().split("\n");

    if(allowListAddresses[1] && allowListAddresses[1].includes('\r')){
        console.log(allowListAddresses);
        allowListAddresses = fs.readFileSync(newPathLocal).toString().split("\r\n"); // need to consider also \r\n ??
    }
    console.log(allowListAddresses);

    // 3. create merkle tree + root hash
    const leafNodes = allowListAddresses.filter(function(addr) {
        if(addr != "") return addr;
    }).map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
    const rootHash = (merkleTree.getRoot()).toString('hex');


    console.log("rootHash: " + rootHash);

    // save rootHash to DB
    await SaveRootHashToDB(collectionName, rootHash);
    res.status(201).end("allow list file has been saved");

})

export const config = {
    api: {
      bodyParser: false
    }
}

export default apiRoute


async function SaveRootHashToDB(collectionName, rootHash){
    const Collections = Moralis.Object.extend("Collections");
    const query = new Moralis.Query(Collections);
    query.equalTo("collectionName", collectionName);
    const results = await query.find();

    LogBackend("results.length: " + results.length);
  
    if (results.length > 0) {
        const object = results[0];

        object.set("rootHash", rootHash);

        await object.save()
        .then((object) => {
            // Execute any logic that should take place after the object is saved.
            console.log('rootHash added');
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

