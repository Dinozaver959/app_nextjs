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
  
    const collectionName = req.body.CollectionName[0];
    const userAccount = req.body.UserAccount[0].toString();
    const fileExtension = req.files['METADATA_FILE'][0].originalFilename.split('.')[1];
    const path = req.files['METADATA_FILE'][0].path;


    // if user does not owns the collection - redirect to home page
    if(! await CheckIfUserOwnsCollection(collectionName, userAccount)){
        console.log("USER DOES NOT OWN THE COLLECTION!")
        LogBackend("USER DOES NOT OWN THE COLLECTION!")
        exit;
    }


    let rawdata = fs.readFileSync(path);
    let jsonObj = JSON.parse(rawdata);


    // -------------------------------    
    // update Collections table with this set's schema
    // Get the NFT attribute names into the Collections Table, so we can later pick this up (it is per collection, which we need to know for querying for these attributes per collection)
    var collectionSchema = []
    const attributes_ = jsonObj[0]["attributes"]
    for(let k = 0; k < attributes_.length; k++)
    {
        const traitType_ = (attributes_[k]["trait_type"]).replace(/\s+/g, '');
        collectionSchema.push(traitType_);

    }

    const Collections = Moralis.Object.extend("Collections");
    const query_ = new Moralis.Query(Collections);
    query_.equalTo("collectionName", collectionName);
    const results_ = await query_.find();

    if (results_.length > 0) {
        const object = results_[0];
        object.set("Attributes", collectionSchema);

        await object.save()
        .then((object) => {
            // Execute any logic that should take place after the object is saved.
            console.log('New object created with objectId: ' + object.id);
            console.log('collectionName: ' + collectionName);

        }, (error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            console.log('Failed to create new object, with error code: ' + error.message);
        });
    }
    else 
    {
        // this collectionName does not exists yet -> terminate
        res.redirect("/");
        exit;
    }

    // --------------------------

    for (let i = 0; i < jsonObj.length; i++) {

        const Collection = Moralis.Object.extend(collectionName);
        const query = new Moralis.Query(Collection);
        query.equalTo("id_", i);
        const results = await query.find();

        if (results.length > 0) {
            const object = results[0];

            // for every attribute per nft
            const attributes = jsonObj[i]["attributes"];
            for(let j = 0; j < attributes.length; j++)
            {
                const traitType = (attributes[j]["trait_type"]).replace(/\s+/g, '');
                const value = attributes[j]["value"];
                //aData.push({update: {traitType : value}});
                // "color" : "yellow"

                object.set(traitType, value);

                LogBackend("traitType: " + traitType);
                LogBackend("value: " + value);
                LogBackend("-------");
            }

            await object.save()
            .then((object) => {
                // Execute any logic that should take place after the object is saved.
                console.log('New object created with objectId: ' + object.id);
                console.log('collectionName: ' + collectionName);

            }, (error) => {
                // Execute any logic that should take place if the save fails.
                // error is a Moralis.Error with an error code and message.
                console.log('Failed to create new object, with error code: ' + error.message);
            });
        } else {
            console.log("not a single collection exist with this name: " + collectionName);
        }
    }

    // -------------------------------


    //redirect to the next stage
    res.redirect("/create/configureSmartContract"); 

    
    //res.redirect("/create/uploadmetadata");   
    // figure out how to send data back to the front end and show a pop up, 
    // or even better, not change the screen while sending instructions to the backend

})

export const config = {
    api: {
      bodyParser: false
    }
}
  
export default apiRoute

