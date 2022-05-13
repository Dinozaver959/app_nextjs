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
  console.log(req.files)

  const collectionName = req.body.CollectionName[0].toString();
  console.log("collection name: " + collectionName);
  const collectionDescription = req.body.CollectionDescription[0].toString();
  const userAccount = req.body.UserAccount[0].toString();

  // check if collection already exists -> drop the request
  if(await DoesCollectionExist(collectionName)){
    console.log("Collection already exists!")
    LogBackend("Collection already exists!");
    res.status(501).end("nope...not gonna work");
    return;
  }

  // adds a Collection to the set of collections
  await AddCollectionToMoralisDB(collectionName, collectionDescription, userAccount, req.files['uploadPreRevealImage'][0].path, req.files['uploadPreRevealImage'][0].originalFilename.split('.')[1]);  // req.files['uploadPreRevealImage'][0]); //, res.headers['content-type']);


  // works for now -> (space def breaks the code) - > check done above, but can we make it work anyway?
  const NFTCollection = Moralis.Object.extend(collectionName);
  const fileUploadControl = req.files['uploadMultipleImages'];
  
  if (fileUploadControl.length > 0) {
      for (let i = 0; i < fileUploadControl.length; i++)
      {         
          const fileExtension = req.files['uploadMultipleImages'][i].originalFilename.split('.')[1];

          const newPath =  collectionName + "/" + i + "." + fileExtension;
          const newPathLocal = "/var/www/app_nextjs/public/images/" + newPath;
          const newPathPublic = "https://easylaunchnft.com/images/" + newPath;


          console.log("local path for nft: " + newPathLocal);

          fse.move(req.files['uploadMultipleImages'][i].path, newPathLocal, function (err) {
            if (err) return console.error(err)
            console.log("success!")
          })

          /*
          image = fileUploadControl[i];
          const ipfsFile = new Moralis.File(image.name, image);
      
          await ipfsFile.saveIPFS();
          console.log("image ipfs: " + ipfsFile.ipfs())
          */
   
          const NFT = new NFTCollection();
          NFT.set("id_", i);                  // there seems to be a problem with 'id' as the column name
          //NFT.set("url", ipfsFile.ipfs());
          NFT.set("url", newPathPublic)

          await NFT.save()
          .then((NFTFile) => {
              // Execute any logic that should take place after the object is saved.
              console.log('NFTFile created with Id: ' + i);
          }, (error) => {
              // Execute any logic that should take place if the save fails.
              // error is a Moralis.Error with an error code and message.
              console.log('Failed to create new object, with error code: ' + error.message);
          });
      }
  }

  res.status(201).end("images have been uploaded successfully");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute




// --------------------------------------------

/*
async function UploadImages(chosenCollectionName){

  // adds a Collection to the set of collections
  AddCollectionToMoralisDB(chosenCollectionName);

  // works for now -> (space def breaks the code) - > check done above, but can we make it work anyway?
  const NFTCollection = Moralis.Object.extend(chosenCollectionName);
  const fileUploadControl = document.getElementById("uploadMultipleImages");
  
  if (fileUploadControl.files.length > 0) {
      for (let i = 0; i < fileUploadControl.files.length; i++)
      {
          console.log("--------------------------");
          image = fileUploadControl.files[i];

          const ipfsFile = new Moralis.File(image.name, image);
      
          await ipfsFile.saveIPFS();
          console.log("image ipfs: " + ipfsFile.ipfs())
      
          const NFT = new NFTCollection();
          NFT.set("id_", i);                  // there seems to be a problem with 'id' as the column name
          NFT.set("url", ipfsFile.ipfs());

          await NFT.save()
          .then((NFTFile) => {
              // Execute any logic that should take place after the object is saved.
              console.log('NFTFile created with Id: ' + i);
          }, (error) => {
              // Execute any logic that should take place if the save fails.
              // error is a Moralis.Error with an error code and message.
              console.log('Failed to create new object, with error code: ' + error.message);
          });
      }
  }
}
*/


/*
async function UploadImageToIPFSReturnsURL(imagePath){

  fs.readFileSync(imagePath, async function(err, data) {
    if (err) throw err // Fail if the file can't be read.

    console.log("inside the readFileSync");
    LogBackend("inside the readFileSync");

    const ipfsFile = new Moralis.File('imageName', data);

    console.log("before ipfsSave");
    LogBackend("before ipfsSave");

    await ipfsFile.saveIPFS();

    console.log(ipfsFile.ipfs());
    LogBackend(ipfsFile.ipfs());


    return ipfsFile.ipfs();
  })
}
*/


async function AddCollectionToMoralisDB(collectionName, collectionDescription, userAccount, imagePath, fileExtension) {
  
  const Collections = Moralis.Object.extend("Collections");
  const collection = new Collections();
  collection.set("collectionName", collectionName);
  collection.set("Revealed", false);
  collection.set("Description", collectionDescription);
  collection.set("owner", userAccount);

  const newPath =  collectionName + "/prereveal." + fileExtension;
  const newPathLocal = "/var/www/app_nextjs/public/images/" + newPath;
  const newPathPublic = "https://easylaunchnft.com/images/" + newPath;

  console.log("prevereal, local path: " + newPathLocal);

  fse.move(imagePath, newPathLocal, function (err) {
    if (err) return console.error(err)
    console.log("success!")
  })




  /*
  const ipfsURL = await UploadImageToIPFSReturnsURL(imagePath);
  console.log("ipfsURL: " + ipfsURL);
  LogBackend("ipfsURL: " + ipfsURL);
  collection.set("prerevealImgUrl", ipfsURL);
  */


  //const ipfsFile = new Moralis.File(image.originalFilename, image.headers);    // image.name
  // const data = Array.from(Buffer.from(image, 'binary'));

  // const contentType = response.headers['content-type'];
  //const ipfsFile = new Moralis.File('logo', data, contentType);
  // const ipfsFile = new Moralis.File('logo', data);


  //await ipfsFile.saveIPFS();
  //collection.set("prerevealImgUrl", ipfsFile.ipfs());
  collection.set("prerevealImgUrl", newPathPublic);

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

