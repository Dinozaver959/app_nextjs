import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import {LogBackend} from '../../../JS/backendLog'

var Moralis = require("moralis/node");
var fs = require("fs");
var fse = require('fs-extra')
var path = require("path");

const serverUrl = "https://p2r5bzcvt2aq.usemoralis.com:2053/server";
const appId = "mCUbGlwPmuitdPxm5K3mtjhoGL1ENmyMIgffO5U7";
Moralis.start({ serverUrl, appId });

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const collectionName = req.query['api-ABI'];

    //res.send("collectionName: " + collectionName);
  
    const filePath = "/var/www/app_nextjs/COMPILED/" + collectionName + "/abi.txt";

    res.send(fs.readFileSync(filePath, {encoding: 'utf-8'}));
    
    // -------------------------------


    
    //res.redirect(""");   
    // figure out how to send data back to the front end and show a pop up, 
    // or even better, not change the screen while sending instructions to the backend

})

export const config = {
    api: {
      bodyParser: false
    }
}
  
export default apiRoute

