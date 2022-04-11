import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import LogBackend from '../../JS/backendLog'
import {IsCollectionRevealed, DoesCollectionExist, GetCollectionSize, GetCollectionLength, ConstructMetadataLegit, ConstructMetadataPreReveal, GetCollectionDescription, GetImageURL, GetPrerevealImageURL} from '../../JS/DB-cloudFunctions'

var Moralis = require("moralis/node");
var fs = require("fs");
var fse = require('fs-extra')
var path = require("path");
var url = require('url');

const serverUrl = "https://p2r5bzcvt2aq.usemoralis.com:2053/server";
const appId = "mCUbGlwPmuitdPxm5K3mtjhoGL1ENmyMIgffO5U7";
Moralis.start({ serverUrl, appId });

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.use('api/', async (req, res) => {
  fs  // dont touch this -- nextjs complains on compiling, if fs is not used ... don't ask, don't touch

  const parsedURL = req.query['collection'];
  const collectionName = parsedURL[0];
  const id = parsedURL[1];
  // var returnString = ""; - old
  var returnString = new Object();


  // --------------------------------------------------------------
  // old approach - cloud functions prepare the metadata string
  /**  
  if(await DoesCollectionExist(collectionName)){

    var collectionSize = await GetCollectionLength(collectionName);
    if ((0 < collectionSize && 0 <= id && id < collectionSize) || id == "prereveal") {

      // check if collection is revealed 
      if (await IsCollectionRevealed(collectionName)) {   // yes revealed -> give 'id' specific reply
        returnString = await ConstructMetadataLegit(collectionName, id);   
      } else{   // not revealed -> give the default prereveal reply
        returnString = await ConstructMetadataPreReveal(collectionName, id);
      }
    }
  }
  */


  // --------------------------------------------------------------
  // new approach - we read the metadata file and construct the string from there 

  if(await DoesCollectionExist(collectionName)){

    var collectionSize = await GetCollectionSize(collectionName);
    if ((0 < collectionSize && 0 <= id && id < collectionSize) || id == "prereveal") {    // assume starting from 1

      // name
      returnString.name = collectionName + " #" + id;

      // description
      returnString.description = await GetCollectionDescription(collectionName)

      // external url
      returnString.external_url = "https://easylaunchnft.com/"

      if ((await IsCollectionRevealed(collectionName)) && id != "prereveal") {   // yes revealed -> give 'id' specific reply

        // image
        returnString.image = await GetImageURL(collectionName, id)

        // attributes
        const metadataFilePath = "/var/www/app_nextjs/Metadata/" + collectionName + "/" + "metadata.json";
        let rawdata = fs.readFileSync(metadataFilePath);
        let jsonObj = JSON.parse(rawdata);
        returnString.attributes = jsonObj[id]["attributes"];

        // if there are some additional properties in the metadata ----> add them here 

      } else{   // not revealed -> give the default prereveal reply

        // image
        returnString.image = await GetPrerevealImageURL(collectionName);
      }
    }

  }


  res.send(returnString);
})

export const config = {
  api: {
    bodyParser: false
  }
}
  
export default apiRoute

