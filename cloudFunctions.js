Moralis.Cloud.define("GetCollectionNames", async (request) => {
  const query = new Moralis.Query("Collections");
  query.equalTo("owner", request.params.id);
  const results = await query.find();
  var colletions = []
  for (let i = 0; i < results.length; i++) {
      colletions.push(results[i].get("collectionName"))
  }
  return colletions;
});

Moralis.Cloud.define("GetNotDeployedCollectionNames", async (request) => {

  const query = new Moralis.Query("Collections");
  query.equalTo("owner", request.params.id);
  query.doesNotExist("contractAddress"); // to be tested
  const results = await query.find();
	var colletions = []
  for (let i = 0; i < results.length; i++) {
      colletions.push(results[i].get("collectionName"))
  }
  return colletions;
});

Moralis.Cloud.define("GetNotDeployedButReadyCollectionNames", async (request) => {
  const query = new Moralis.Query("Collections");
  query.equalTo("owner", request.params.id);
  query.doesNotExist("contractAddress"); // to be tested
  query.exists("maxSupply");
  query.exists("mintPrice");
  query.exists("maxToMint");
  query.exists("tokenName");
  query.exists("tokenSymbol");
  const results = await query.find();
	var colletions = []
    for (let i = 0; i < results.length; i++) {
        colletions.push(results[i].get("collectionName"))
    }
    return colletions;
});

Moralis.Cloud.define("GetDeployedCollectionNames", async (request) => {
  const query = new Moralis.Query("Collections");
  query.equalTo("owner", request.params.id);
  query.exists("contractAddress");  // works fine 
  const results = await query.find();
  var colletions = []
  for (let i = 0; i < results.length; i++) {
      colletions.push(results[i].get("collectionName"))
  }
  return colletions;
});


Moralis.Cloud.define("IsCollectionRevealed", async (request) => {
  const query = new Moralis.Query("Collections");
  query.equalTo("collectionName", request.params.collectionName);
  query.equalTo("Revealed", true);
  const results = await query.find();
  
  if(results.length > 0){
    return true;
  }
  return false;
});


Moralis.Cloud.define("DoesCollectionExist", async (request) => {
  const query = new Moralis.Query("Collections");
  query.equalTo("collectionName", request.params.collectionName);
  const results = await query.find();

  if(results.length > 0){return true;}
  else {return false;}
});


// based on the value supplied by the user - maxSupply
Moralis.Cloud.define("GetCollectionSize", async (request) => {
  const query = new Moralis.Query("Collections");
  query.equalTo("collectionName", request.params.collectionName);
  const results = await query.find();
  return results[0].get("maxSupply");
});


// based on the total number of rows in the collection's specific DB Table - old approach
Moralis.Cloud.define("GetCollectionLength", async (request) => {
  const query = new Moralis.Query(request.params.collectionName);
  const results = await query.find();
  return results.length;
});


Moralis.Cloud.define("ConstructMetadataPreReveal", async (request) => {
    var returnString = new Object();
  
    const collectionName = request.params.collectionName;
    returnString.name = collectionName + " #" + request.params.id;
  
    // get prereveal img url
    const query = new Moralis.Query("Collections");
    query.equalTo("collectionName", collectionName);
    const results = await query.find(); 
    returnString.image = results[0].get('prerevealImgUrl');
  
    // get description
    returnString.description = results[0].get('Description');

    // add external url
    returnString.external_url = "https://easylaunchnft.com/"
  
    return returnString;
});



Moralis.Cloud.define("ConstructMetadataLegit", async (request) => {
    var returnString = new Object();
   
    const id = request.params.id;
    const collectionName = request.params.collectionName;
    returnString.name = collectionName + " #" + id;
  
    // get img url
    const Collections = Moralis.Object.extend(collectionName);
    const query = new Moralis.Query(Collections);
    query.equalTo("id_", parseInt(id));                                                       
    const results = await query.find(); 
    returnString.image = results[0].get('url');
  
    // get description
    //const Collections_desc = Moralis.Object.extend("Collections");
    const query_desc = new Moralis.Query("Collections");
    query_desc.equalTo("collectionName", collectionName);
    const results_desc = await query_desc.find(); 
    returnString.description = results_desc[0].get('Description');
    
    // add external url
    returnString.external_url = "https://easylaunchnft.com/"
  
    // figure out the schema 
    //const Collections_ = Moralis.Object.extend("Collections");
    const query_ = new Moralis.Query("Collections");
    query_.equalTo("collectionName", collectionName);
    query_.exists("Attributes");
    const results_ = await query_.find();           // attributes may not be specific -> do a check if the Attributes are even present
  
    // if the attributes exist
    if(results_.length > 0){
      const schema = results_[0].get('Attributes');
  
      var attributes_ = [];
      // if the schema is non-empty, then add schema attributes
      if(schema.length > 0){
        for (let i = 0; i < schema.length; i++) {
  
          var attr = {
            'trait_type': schema[i],
            'value': results[0].get(schema[i])
          }
          attributes_.push(attr)            
        }
      }
      returnString.attributes = attributes_;
    }
  
    return returnString;
});


Moralis.Cloud.define("GetContractAddress", async (request) => {
  const collectionName = request.params.collectionName;
  const Collections = Moralis.Object.extend("Collections");
  const query = new Moralis.Query(Collections);
  query.equalTo("collectionName", collectionName);
  query.exists("contractAddress");
  const results = await query.find();

  return results[0].get("contractAddress");
});


Moralis.Cloud.define("CheckIfUserOwnsCollection", async (request) => {
  const query = new Moralis.Query("Collections");
  query.equalTo("owner", request.params.userAccount);
  query.equalTo("collectionName", request.params.collectionName);
  const results = await query.find();
  return (results.length > 0) ? true : false;
});



Moralis.Cloud.define("GetCollectionsDetailsByOwner", async (request) => {

  const pipeline = [
    { match: { owner: request.params.userAccount } },
    {project: { 
      _id: 0, 
      collectionName : 1,
      maxToMint: 1,
      mintPrice: 1,
      maxSupply: 1,
      tokenName: 1,
      tokenSymbol: 1,
      Attributes: 1,
      Description: 1,
      Revealed: 1,
      contractAddress: 1,
      prerevealImgUrl: 1
    }}
  ];
  
  const query = new Moralis.Query("Collections");
  
  return await query.aggregate(pipeline);
});


Moralis.Cloud.define("GetCollectionDetailsByCollectionName", async (request) => {

  const pipeline = [
    { match: { collectionName: request.params.collectionName } },
    {project: { 
      _id: 0, 
      collectionName : 1,
      maxToMint: 1,
      mintPrice: 1,
      maxSupply: 1,
      tokenName: 1,
      tokenSymbol: 1,
      Attributes: 1,
      Description: 1,
      Revealed: 1,
      contractAddress: 1,
      prerevealImgUrl: 1
    }}
  ];
  
  const query = new Moralis.Query("Collections");
  
  return await query.aggregate(pipeline);
});




// ------------------------


Moralis.Cloud.define("GetCollectionDescription", async (request) => {
  const query = new Moralis.Query("Collections");
  query.equalTo("collectionName", request.params.collectionName);
  const results = await query.find();
  return results[0].get("Description");
});


Moralis.Cloud.define("GetImageURL", async (request) => {
  const query = new Moralis.Query("Collections");
  query.equalTo("collectionName", request.params.collectionName);
  const results = await query.find();

  const baseImageURL = results[0].get("baseImageURL");
  const imageFileType = results[0].get("imageFileType");

  return (baseImageURL + request.params.id + imageFileType)
});


Moralis.Cloud.define("GetPrerevealImageURL", async (request) => {
  const query = new Moralis.Query("Collections");
  query.equalTo("collectionName", request.params.collectionName);
  const results = await query.find(); 
  return results[0].get('prerevealImgUrl');
});
