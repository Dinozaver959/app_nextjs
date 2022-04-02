import React, {Component, useState, useEffect, useRef } from 'react'
import styles from "../styles/CreateContent.module.css";
import stylesContainer from "../styles/CreateContainer.module.css";
//import Script from "next/script";
//import DynamicSelectComponent from './DynamicSelectComponent';
import AsyncSelect from 'react-select/async'

import {DeployContract_Moralis, GetCollectionNames} from "../JS/local_web3_Moralis";


function  Deploy() {

  //const inputCollectionName = useRef<HTMLInputElement>(null);

  //const [name, setName] = useState('');


  /*
  function Populate(){

    console.log("inside Populate");

    const collection =  JSON.parse(GetCollectionNames());
    return collection;

    for (let i = 0; i < collection.length; i++)
    {
      console.log(i + ": " + collection[i]);
    }
  } 

  useEffect(() => {
    // call api or anything
    console.log("loaded..");
    // Populate();   // -> works fine :)
    console.log("----------------------------------------------");

    //console.log('INPUT VALUE: ', inputCollectionName.current?.value);

    //inputCollectionName.current?.value = "a"

    const collection = Populate();

    


    //setName(collection[0]);

   // collectionNamesList.push({id : 1, value : collection[0]})
   // collectionNamesList.push({id : 2, value : collection[1]})

  });
  
  */


/*
  // -----------------------
  var collectionNamesList = [];
  const animalsList = [
    {
        id: 1,
        value: 'Tiger'
    }, {
        id: 2,
        value: 'Lion'
    }, {
        id: 3,
        value: 'Dog'
    }, {
        id: 4,
        value: 'Cat'
    }
  ];
  
  // generage select dropdown option list dynamically
  function Options({ options }) {
      return (
          options.map(option => 
                      <option key={option.id} value={option.value}>                                   
                      {option.value}
                      </option>)
                      );
  }
  // -----------------------
*/

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
    return fetch(`https://easylaunchnft.com/api/api-getCollectionNames`).then(res => res.json());    
  };


  return (
    <div className={stylesContainer.FormLikeStyle_TEMP}> 

      <div> Deploy </div> <br></br>

      {/* 
        --> later use this dropdown
        Collection Name: <select id="collectionNames_metadata" name="CollectionName" ref={collectionSelection} required onLoad={updateDropDown()}></select> 
      */}
              {/*  ref={inputCollectionName}   */ }
      CollectionName: <input name="CollectionName" id="CollectionName" type="text" defaultValue="Sample Collection Name" minLength="4" maxLength="24"></input>
      <br></br>

      {/* {name}  
      <div>name:  </div><br></br>

      <select
        name="animal">
        <Options options={animalsList} />
      </select>
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


      <input className={styles.submitButton} type="submit" value="Submit" onClick={DeployContract_Moralis}></input>

    </div>
  );
}

export default Deploy