import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import {LogBackend, ParsePathGiveID, ParsePathGiveCollectionName, CheckFileExists} from '../../JS/backendLog'
const {MerkleTree} = require('merkletreejs');
const keccak256 = require("keccak256");
var fs = require("fs");

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
    console.log(req.body)

    // `https://easylaunchnft.com/api/api-getMerkleProof` + '?id=' + account + '&collectionName=' + collectionName
    const id = ParsePathGiveID(req.url);
    if(id == -1){res.end()}

    const collectionName = ParsePathGiveCollectionName(req.url);
    if(collectionName == -1){res.end()}
    
    LogBackend("stopped at the api-getMerkleProof.js");
    console.log("id: " + id);

    // -------------------------------------
    const allowListFilePath = "/var/www/app_nextjs/AllowList/" + collectionName + "/" + "allowList.txt";

    // check if file exists
    if(await CheckFileExists(allowListFilePath)) { 

        // 2. load file into variable
        var allowListAddresses = fs.readFileSync(allowListFilePath).toString().split("\n");

        if(allowListAddresses[1] && allowListAddresses[1].includes('\r')){
            console.log(allowListAddresses);
            allowListAddresses = fs.readFileSync(allowListFilePath).toString().split("\r\n"); // need to consider also \r\n ??
        }
        console.log(allowListAddresses);
        

        // 3. create merkle tree + get the proof        // filter removes empty lines
        const leafNodes = allowListAddresses.filter(function(addr) {
            if(addr != "") return addr;
        }).map(addr => keccak256(addr));

        const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
        const hexProof = merkleTree.getHexProof(keccak256(id));

        console.log("hexProof:")
        console.log(hexProof)

        // verification
        console.log("should be on the whitelist?:")
        console.log(merkleTree.verify(hexProof, keccak256(id), merkleTree.getRoot()));

        res.end(JSON.stringify(hexProof, null, 3));

    } else {
        console.log("file does not exist")
        res.end(JSON.stringify("", null, 3));
    }
})

export const config = {
    api: {
      bodyParser: false
    }
} 
export default apiRoute

