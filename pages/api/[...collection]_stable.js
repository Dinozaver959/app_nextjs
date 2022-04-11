import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import LogBackend from '../../JS/backendLog'
import {IsCollectionRevealed, DoesCollectionExist, GetCollectionLength, ConstructMetadataLegit, ConstructMetadataPreReveal} from '../../JS/DB-cloudFunctions'

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
  var returnString = "";

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

  res.send(returnString);
})

export const config = {
    api: {
      bodyParser: false
    }
}
  
export default apiRoute

