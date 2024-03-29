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
  const collectionDescription = req.body.CollectionDescription[0].toString();
  const userAccount = req.body.UserAccount[0].toString();


  // if user does not owns the collection - redirect to home page
  if(! await CheckIfUserOwnsCollection(collectionName, userAccount)){
    console.log("USER DOES NOT OWN THE COLLECTION!")
    LogBackend("USER DOES NOT OWN THE COLLECTION!")
    res.status(501).end("nope...not gonna work");
  }


  await AddDescriptionToCollectionMoralisDB(collectionName, collectionDescription)

  res.status(201).end("Description added");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute



async function AddDescriptionToCollectionMoralisDB(collectionName, collectionDescription) {

  const Collections = Moralis.Object.extend("Collections");
  const query_ = new Moralis.Query(Collections);
  query_.equalTo("collectionName", collectionName);
  const results_ = await query_.find();

  if (results_.length > 0) {
    const collection = results_[0];
    collection.set("Description", collectionDescription);

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
}

