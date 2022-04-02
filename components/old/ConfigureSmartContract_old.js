import React, { useState } from 'react'
import styles from "../styles/CreateContent.module.css";
import AsyncSelect from 'react-select/async'

function ConfigureSmartContract() {

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
    return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-notDeployed`).then(res => res.json());    
  };


  return (

    <> 

      {/*
      <Script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js" strategy="beforeInteractive" />
      <Script src="https://npmcdn.com/moralis@latest/dist/moralis.js" strategy="beforeInteractive" />
      <Script src="/JS/moralis.js" strategy="lazyOnload" />
      */}

      <div> ConfigureSmartContract</div><br></br>
      
      

      <form method="post" action="/api/api-configureSmartContract" encType="multipart/form-data">      

            
        <AsyncSelect
          id="CollectionName_Async"
          name="CollectionName"
          cacheOptions
          defaultOptions
          value={selectedValue}
          getOptionLabel={e => e.name}
          getOptionValue={e => e.name}
          loadOptions={loadOptions}
          onInputChange={handleInputChange}
          onChange={handleChange}
        />        

        
        Max Supply: <input type="number" name="MAX_SUPPLY" required min="3" max="10000"></input> <br></br>
        Mint Price: <input type="number" name="MINT_PRICE" required step="0.001" min="0.01" max="1"></input> <br></br>
        Max amount To mint: <input type="number" name="MAX_TO_MINT" required min="1" max="10"></input> <br></br>
        Token Name: <input type="text" name="_NAME_" required minLength="4" maxLength="16"></input> <br></br>
        Token Symbol: <input type="text" name="_SYMBOL_" required minLength="2" maxLength="4"></input> <br></br>

        <input id="CreateImagesSubmitButton" className={styles.submitButton} type="submit" value="Submit"></input>
      </form>

      {/*
      CollectionName: <input name="CollectionName" id="CollectionName" type="text" defaultValue="Sample Collection Name" minLength="4" maxLength="24"></input> <br></br>
      
      <input id="CreateImagesSubmitButton" className={styles.submitButton} type="submit" value="Submit" onClick={(e) => UploadImages(e, '/')}></input>
      */}

      <p id="warningCollectionWithThisNameAlreadyExist" hidden></p>


    </>
  )
}

export default ConfigureSmartContract