import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import LogBackend from '../../JS/backendLog'
import Image from 'next/image'

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



apiRoute.use('api/image/', async (req, res) => {
    fs  // dont touch this -- nextjs complains on compiling, if fs is not used ... don't ask, don't touch

    const parsedURL = req.query['image'];
    const collectionName = parsedURL[0];
    const id = parsedURL[1];




    var regex = "^_\.".replace("_", id)

    // file name
    const fileName = (fs.readdirSync('/var/www/app_nextjs/PICTURES/' + collectionName).filter((allFilesPaths) => allFilesPaths.match(regex) !== null))[0]

    //res.send(fileName)

    const filePath = "/var/www/app_nextjs/PICTURES/" + collectionName + "/" + fileName;

    // <Image src={filePath} height={400} width={400} alt="" />



    res.send(<Image src={filePath} height={400} width={400} alt="" />);

    res.send(fs.readFileSync(filePath));



    var returnString = "";



    res.send(returnString);
})

export const config = {
    api: {
      bodyParser: false
    }
}
  
export default apiRoute

