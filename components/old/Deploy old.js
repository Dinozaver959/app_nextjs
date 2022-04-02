import React, { useState } from 'react'
import styles from "../styles/CreateContent.module.css";
import stylesContainer from "../styles/CreateContainer.module.css";
import AsyncSelect from 'react-select/async'
import {DeployContract_Moralis} from "../JS/local_web3_Moralis";

function  Deploy() {

  const [inputValue, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);

  // handle input change event
  const handleInputChange = value => {
    setValue(value);
  };
 
  // handle selection
  const handleChange = value => {
    setSelectedValue(value);
  }
 
  // load options using API call
  const loadOptions = (inputValue) => {
    return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-configuredNotDeployed`).then(res => res.json());    
  };


  return (
    <div className={stylesContainer.FormLikeStyle_TEMP}> 

      <div> Deploy </div> <br></br>

      {/* 
        --> later use this dropdown
        Collection Name: <select id="collectionNames_metadata" name="CollectionName" ref={collectionSelection} required onLoad={updateDropDown()}></select> 
        CollectionName: <input name="CollectionName" id="" type="text" defaultValue="Sample Collection Name" minLength="4" maxLength="24"></input>

        <pre>Input Value: "{inputValue}"</pre>
      */}
      
      <AsyncSelect
        id="CollectionName_Async"
        cacheOptions
        defaultOptions
        value={selectedValue}
        getOptionLabel={e => e.name}
        getOptionValue={e => e.id}
        loadOptions={loadOptions}
        onInputChange={handleInputChange}
        onChange={handleChange}
      />

      {/*
      <pre>Selected Value: {JSON.stringify(selectedValue || {}, null, 2)}</pre>
      <pre>selected name: { (JSON.stringify(selectedValue)).split('"')[5]}</pre>
      */}

      {/* add a security check that this selected element is in the array of possible options before submitting */}
      <input className={styles.submitButton} type="submit" value="Submit" onClick={() => 
        DeployContract_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
        catch((error) => {
          console.error(error);
          console.log("deploy error code: " + error.code);
          console.log("deploy error message: " + error.message);
          process.exitCode = 1;
        })} >
      </input>

    </div>
  );
}

export default Deploy