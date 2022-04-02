//document.querySelector('#CreateImagesSubmitButton').addEventListener('click', () => {UploadImages()});


const serverUrl = "https://p2r5bzcvt2aq.usemoralis.com:2053/server";
const appId = "mCUbGlwPmuitdPxm5K3mtjhoGL1ENmyMIgffO5U7";
Moralis.start({serverUrl, appId});

/*
async function LoginWithMoralis() 
{
    console.log("log in")
    const user = await Moralis.authenticate()
    document.getElementById('MoralisPART').style.display = 'inline';    

    console.log(user)
    console.log(user.get('ethAddress'))

    document.getElementById('loginAddress').innerHTML = "connected address: " + user.get('ethAddress')
}
*/

/*
This function creates a new collection. 
Uploads each image individually to the IPFS, gets the url for it, creates a new entry in the DB (new collection table) with the url to the image uploaded.
So every image uploaded will have its own row in the DB, in the collectino's table.
*/

async function ShowWarning(elementID, text){
    var warning = document.getElementById(elementID);
    warning.style.display = 'inline';
    warning.innerHTML = text;
    warning.style.backgroundColor = "red";
    warning.style.color = "white";  
    warning.style.borderRadius = "20px";
}

async function ShowSuccess(elementID, text){
    var warning = document.getElementById(elementID);
    warning.style.display = 'inline';
    warning.innerHTML = text;
    warning.style.backgroundColor = "green";
    warning.style.color = "white";  
    warning.style.borderRadius = "20px";
}

async function HideWarning(elementID){
    document.getElementById(elementID).style.display = "none";
}

async function UploadImages(){

    var chosenCollectionName = document.getElementById("CollectionName").value
    
    console.log("colleciton name: " + chosenCollectionName);

   // check if chosenCollectionName contains a space ' ' -> file a warning
    if (chosenCollectionName.indexOf(' ') >= 0){
        ShowWarning("warningCollectionWithThisNameAlreadyExist", "please dont use space in the collection name for the time being");
        return;
    }

    var collections_ = await Moralis.Cloud.run("GetCollectionNames");
    var collections = String(collections_).split(",");

    // check that the CollectionName is not already used -> we want it to be unique
    for (var i=0; i < collections.length; ++i){   
        if(chosenCollectionName.localeCompare(collections[i]) == 0){
            // this name is already in the DB -> show a warning and end this function
            ShowWarning("warningCollectionWithThisNameAlreadyExist", "Collection with this name already exist, please choose a different name");
            return;
        }
    }

    // If there are no errors make sure to hide any warning from previous trials
    HideWarning("warningCollectionWithThisNameAlreadyExist");
    ShowSuccess("warningCollectionWithThisNameAlreadyExist", "Collection successfully created.");

    // adds a Collection to the set of collections
    AddCollectionToMoralisDB(chosenCollectionName);

    // works for now -> (space def breaks the code) - > check done above, but can we make it work anyway?
    const NFTCollection = Moralis.Object.extend(chosenCollectionName);
    const fileUploadControl = document.getElementById("uploadMultipleImages");
    
    // console.time("test");
    if (fileUploadControl.files.length > 0) {
        for (let i = 0; i < fileUploadControl.files.length; i++)
        {
            console.log("--------------------------");
            image = fileUploadControl.files[i];

            const ipfsFile = new Moralis.File(image.name, image);
        
            await ipfsFile.saveIPFS();
            console.log("image ipfs: " + ipfsFile.ipfs())
        
            const NFT = new NFTCollection();
            NFT.set("id_", i);                  // there seems to be a problem with 'id' as the column name
            NFT.set("url", ipfsFile.ipfs());

            await NFT.save()
            .then((NFTFile) => {
                // Execute any logic that should take place after the object is saved.
                console.log('NFTFile created with Id: ' + i);
            }, (error) => {
                // Execute any logic that should take place if the save fails.
                // error is a Moralis.Error with an error code and message.
                console.log('Failed to create new object, with error code: ' + error.message);
            });
        }
    }
    // console.timeEnd("test");
}

async function AddCollectionToMoralisDB(collectionName) {
    
    const Collections = Moralis.Object.extend("Collections");
    const collection = new Collections();

    collection.set("collectionName", collectionName);

    const fileUploadControl = document.getElementById("uploadPreRevealImage");
    if (fileUploadControl.files.length > 0) {
        image = fileUploadControl.files[0];
        const ipfsFile = new Moralis.File(image.name, image);    
        await ipfsFile.saveIPFS();

        collection.set("prerevealImgUrl", ipfsFile.ipfs());
    }

    await collection.save()
        .then((collection) => {
            // Execute any logic that should take place after the object is saved.
            console.log('New object created with objectId: ' + collection.id);
            console.log('collectionName: ' + collectionName);

        }, (error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            console.log('Failed to create new object, with error code: ' + error.message);
        });
}

async function SetCollectionAsRevealed(collectionName){

    const Collections = Moralis.Object.extend("Collections");
    const query = new Moralis.Query(Collections);
    query.equalTo("collectionName", collectionName);
    const results = await query.find();

    if (results.length > 0) {
        const object = results[0];

        object.set("Revealed", true);
        await object.save()
            .then((object) => {
                // Execute any logic that should take place after the object is saved.
                console.log('Collection successfully set as revealed.');
            }, (error) => {
                // Execute any logic that should take place if the save fails.
                // error is a Moralis.Error with an error code and message.
                console.log('Failed to set collection as revealed, with error code: ' + error.message);
            });
    }
}