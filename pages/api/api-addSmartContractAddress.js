import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import {LogBackend} from '../../JS/backendLog'
import {CheckIfUserOwnsCollection} from '../../JS/DB-cloudFunctions'

var Moralis = require("moralis/node");
var fs = require("fs");
var fse = require('fs-extra')
var path = require("path");

const serverUrl = "https://p2r5bzcvt2aq.usemoralis.com:2053/server";
const appId = "mCUbGlwPmuitdPxm5K3mtjhoGL1ENmyMIgffO5U7";
Moralis.start({ serverUrl, appId });

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
  console.log(req.body)
  console.log(req.files)

  const collectionName = req.body.CollectionName[0].toString();
  console.log("collection name: " + collectionName);
  const contractAddress = req.body._ADDRESS_[0].toString();
  const userAccount = req.body.UserAccount[0].toString();

  // for now ignore:        -- needs to be added later
  const chainId = "";


  // if user does not owns the collection - redirect to home page
  if(! await CheckIfUserOwnsCollection(collectionName, userAccount)){
    console.log("USER DOES NOT OWN THE COLLECTION!")
    LogBackend("USER DOES NOT OWN THE COLLECTION!")
    res.status(501).end("nope...not gonna work");
  }

  await AddCollectionAddressToMoralisDB(collectionName, contractAddress, chainId);

  res.status(201).end("Description added");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute


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