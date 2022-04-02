
var Moralis = require("moralis/node");

const serverUrl = "https://p2r5bzcvt2aq.usemoralis.com:2053/server";
const appId = "mCUbGlwPmuitdPxm5K3mtjhoGL1ENmyMIgffO5U7";
Moralis.start({ serverUrl, appId });


export async function GetCollectionNames(id) {
    const params =  { id: id };
    return Moralis.Cloud.run("GetCollectionNames", params);
}

export async function GetNotDeployedCollectionNames(id){
    const params =  { id: id };
    return Moralis.Cloud.run("GetNotDeployedCollectionNames", params);
}

export async function GetConfiguredNotDeployedCollectionNames(id){
    const params =  { id: id };
    return Moralis.Cloud.run("GetNotDeployedButReadyCollectionNames", params);
}

export async function GetDeployedCollectionNames(id){
    const params =  { id: id };
    return Moralis.Cloud.run("GetDeployedCollectionNames", params);
}


export async function GetContractAddress(collectionName) {
    const params =  { collectionName: collectionName};
    return Moralis.Cloud.run("GetContractAddress", params);
}


export async function IsCollectionRevealed(collectionName) {
    const params =  { collectionName: collectionName };
    return await Moralis.Cloud.run("IsCollectionRevealed", params);
}

export async function DoesCollectionExist(collectionName){
    const params =  { collectionName: collectionName };
    return await Moralis.Cloud.run("DoesCollectionExist", params);
}

export async function GetCollectionLength(collectionName){
    const params =  { collectionName: collectionName };
    return await Moralis.Cloud.run("GetCollectionLength", params);
}

export async function ConstructMetadataLegit(collectionName, id){
    const params =  { collectionName: collectionName, id : id };
    return await Moralis.Cloud.run("ConstructMetadataLegit", params);
}

export async function ConstructMetadataPreReveal(collectionName, id){
    const params =  { collectionName: collectionName, id : id };
    return await Moralis.Cloud.run("ConstructMetadataPreReveal", params);
}
  

export async function CheckIfUserOwnsCollection(collectionName, userAccount){
    const params =  { collectionName: collectionName, userAccount : userAccount };
    return await Moralis.Cloud.run("CheckIfUserOwnsCollection", params);
}


export async function GetCollectionsDetailsByOwner(userAccount){
    const params =  { userAccount : userAccount };
    return await Moralis.Cloud.run("GetCollectionsDetailsByOwner", params);
}

