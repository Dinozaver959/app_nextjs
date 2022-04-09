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
  const userAccount = req.body.UserAccount[0].toString();

  // if user does not owns the collection - redirect to home page
  if(! await CheckIfUserOwnsCollection(collectionName, userAccount)){
    console.log("USER DOES NOT OWN THE COLLECTION!")
    LogBackend("USER DOES NOT OWN THE COLLECTION!")
    exit;
  }

  // adds a Collection to the set of collections
  await AddPrerevealImageMoralisDB(collectionName, req.files['uploadPreRevealImage'][0].path, req.files['uploadPreRevealImage'][0].originalFilename.split('.')[1]);

  //redirect to the next stage
  res.redirect("/create/uploadmetadata");

})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute


async function AddPrerevealImageMoralisDB(collectionName, imagePath, fileExtension) {

  const Collections = Moralis.Object.extend("Collections");
  const query_ = new Moralis.Query(Collections);
  query_.equalTo("collectionName", collectionName);
  const results_ = await query_.find();

  if (results_.length > 0) {





    // this won't work bc access to /public/images is not updated in production (can't access new files)
    // need to upload to the DO space instead
    // will create a new route specifically for prereveal images:   /prereveal/[anything]
    // meaning this whole file is POINTLESS :D -------------------------------------------
    // ----------------------------------------
    const newPath =  collectionName + "/prereveal." + fileExtension;
    const newPathLocal = "/var/www/app_nextjs/public/images/" + newPath;
    const newPathPublic = "https://easylaunchnft.com/images/" + newPath;
  
    console.log("prevereal, local path: " + newPathLocal);
  
    fse.move(imagePath, newPathLocal, function (err) {
      if (err) return console.error(err)
      console.log("success!")
    })
    // -----------------------------------------




    const collection = results_[0];
    collection.set("prerevealImgUrl", newPathPublic);

    await collection
      .save()
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

