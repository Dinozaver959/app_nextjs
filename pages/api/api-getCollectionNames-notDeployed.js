import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import {LogBackend, ParsePathGiveID} from '../../JS/backendLog'
import {GetNotDeployedCollectionNames} from '../../JS/DB-cloudFunctions'

const apiRoute = nextConnect()
apiRoute.use(middleware)

/*
function ParsePathGiveID(_url){

    const params = _url.split("?");
    if(params.length != 2){
        return -1;
    }

    const id = params[1].split("=");
    if(id.length != 2){
        return -1;
    }

    return id[1];
}
*/

apiRoute.get(async (req, res) => {     
    console.log(req.body)
    LogBackend(req.body);

    const id = ParsePathGiveID(req.url);
    if(id == -1){res.end()}

    // res.end("id: " + id);


    
    LogBackend("stopped at the api-getCollectionNames-notDeployed.js");
 
    const collectionNames = await GetNotDeployedCollectionNames(id);

    var packagedCollectionNames = []

    for(let i = 0; i < collectionNames.length; i++){
        packagedCollectionNames.push({id: i+1, name : collectionNames[i]})
    }

    res.end(JSON.stringify(packagedCollectionNames, null, 3));
})

export const config = {
    api: {
      bodyParser: false
    }
} 
export default apiRoute

