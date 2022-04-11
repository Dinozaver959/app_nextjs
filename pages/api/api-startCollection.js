import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import {LogBackend} from '../../JS/backendLog'
import {DoesCollectionExist} from '../../JS/DB-cloudFunctions'

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

  const collectionName = req.body.CollectionName[0].toString();
  console.log("collection name: " + collectionName);
  const userAccount = req.body.UserAccount[0].toString();

  // check if collection already exists -> drop the request
  if(await DoesCollectionExist(collectionName)){
    console.log("Collection already exists!")
    LogBackend("Collection already exists!");
    res.status(501).end("Collection with this name already exists");
  }

  // adds a Collection to the set of collections
  await AddCollectionToMoralisDB(collectionName, userAccount); 

  res.status(201).end("Collection created");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute


async function AddCollectionToMoralisDB(collectionName, userAccount) {
  
  const Collections = Moralis.Object.extend("Collections");
  const collection = new Collections();
  collection.set("collectionName", collectionName);
  collection.set("Revealed", false);
  collection.set("owner", userAccount);

  await collection.save()
      .then((collection) => {
          // Execute any logic that should take place after the object is saved.
          console.log('New object created with objectId: ' + collection.id);
          console.log('collectionName: ' + collectionName);
          LogBackend('New object created with objectId: ' + collection.id);

      }, (error) => {
          // Execute any logic that should take place if the save fails.
          // error is a Moralis.Error with an error code and message.
          console.log('Failed to create new object, with error code: ' + error.message);
          LogBackend('Failed to create new object, with error code: ' + error.message);
      });
}

