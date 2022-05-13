import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import {LogBackend} from '../../JS/backendLog'
import {CheckIfUserOwnsCollection, GetCollectionDetailsByCollectionName, CheckIfCollectionDeployed} from '../../JS/DB-cloudFunctions'

const apiRoute = nextConnect()
apiRoute.use(middleware)


function ParseURL(_url){

    const params = _url.split("?");
    if(params.length != 2){
        return -1;
    }

    const pars = params[1].split("&");
    var ret = [];

    for(let i = 0; i < pars.length; i++){


        //const attr = pars[i].split("=")[0];
        const value = pars[i].split("=")[1];

        ret.push(value);
    }

    return ret;
}


apiRoute.get(async (req, res) => {     

    //  LogBackend("stopped at the api-getConfigValues.js");
    //      /api/api-getConfigValues?id=nuy7wJn7sjchG4YQvUgFqycw&collectionName=Pizza
    const ret = ParseURL(req.url);
    const userAccount = ret[0];
    const collectionName = ret[1];

    //console.log("userAccount: " + userAccount)
    //LogBackend("userAccount: " + userAccount)
    //console.log("collectionName: " + collectionName)
    //LogBackend("collectionName: " + collectionName)

    // if user does not owns the collection - redirect to home page
    if(! await CheckIfUserOwnsCollection(collectionName, userAccount)){
        console.log("USER DOES NOT OWN THE COLLECTION!")
        LogBackend("USER DOES NOT OWN THE COLLECTION!")
        // exit;
        res.status(501).end("nope...not gonna work");
    }

    // check if the collection hasn't been deployed yet
    if(CheckIfCollectionDeployed(collectionName)){
        console.log("collectionName has already been deployed: " + collectionName)
        LogBackend("collectionName has already been deployed: " + collectionName)
        res.status(502).end("nope...collectionName has already been deployed");
        return;
    }

    const configValues = await GetCollectionDetailsByCollectionName(collectionName);

    console.log("configValues: ")
    console.log(configValues)

    //res.stauts(201).end(configValues)
    
    res.end(JSON.stringify(configValues, null, 3));

})

export const config = {
    api: {
      bodyParser: false
    }
} 
export default apiRoute

