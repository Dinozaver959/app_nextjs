import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import {LogBackend, ParsePathGiveID} from '../../JS/backendLog'
import {GetCollectionsDetailsByOwner} from '../../JS/DB-cloudFunctions'

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
    console.log(req.body)

    const id = ParsePathGiveID(req.url);
    if(id == -1){res.end()}
    
    LogBackend("stopped at the api-getCollectionsDetails.js");
 
    const collectionNames = await GetCollectionsDetailsByOwner(id);

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

