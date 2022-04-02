import React, { useState } from 'react'
import styles from "../styles/CreateContent.module.css";
import stylesContainer from "../styles/CreateContainer.module.css";
import AsyncSelect from 'react-select/async'
import {CheckTotalSupply_Moralis, Mint_Moralis, CheckContractName_Moralis, CheckContractSymbol_Moralis, CheckSaleActive_Moralis, CheckOwner_Moralis,
  SetSaleActive_Moralis, CheckTokenURI_Moralis, UpdateBaseURI_Moralis, CheckIfRevealed_Moralis, Reveal_Moralis, Withdraw_Moralis, SetPlatformRoyalty_Moralis} from "../JS/local_web3_Moralis";
import Moralis from 'moralis';

function  Interact() {

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
    //return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-deployed`).then(res => res.json());  
    return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-deployed` + '?id=' + ((Moralis.User.current()).id)).then(res => res.json());    
  };

  function ValidateSelection(value) {
    // undefined or null - not good
    return (value == null) ? false : true;
  }


  return (
    <div className={stylesContainer.FormLikeStyle_TEMP}> 

      <div> Interact </div><br></br>
      
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
      <br></br>

      <input className={styles.submitButton} type="submit" value="TotalSupply" onClick={ async () => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckTotalSupply_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input><br></br>
      <input className={styles.submitButton} type="submit" value="Mint" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
        Mint_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
        catch((error) => {
          console.error(error);
          console.log("mint error code: " + error.code);
          console.log("mint error message: " + error.message);
          process.exitCode = 1;
        })} >
      </input><br></br>

      <input className={styles.submitButton} type="submit" value="Check Contract Owner" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckOwner_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input><br></br>
      <input className={styles.submitButton} type="submit" value="Check Contract Name" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckContractName_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input><br></br>
      <input className={styles.submitButton} type="submit" value="Check Contract Symbol" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckContractSymbol_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input><br></br>

      <input className={styles.submitButton} type="submit" value="CheckSaleActive" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckSaleActive_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input><br></br>
      <input className={styles.submitButton} type="submit" value="SetSaleActive" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
        SetSaleActive_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
        catch((error) => {
          console.error(error);
          console.log("set sale error code: " + error.code);
          console.log("set sale error message: " + error.message);
          process.exitCode = 1;
        })} >
      </input><br></br>

      <input className={styles.submitButton} type="submit" value="Check Token_0 URI" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckTokenURI_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input><br></br>

      <input className={styles.submitButton} type="submit" value="UpdateBaseURI" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
        UpdateBaseURI_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
        catch((error) => {
          console.error(error);
          console.log("update base URI error code: " + error.code);
          console.log("update base URI error message: " + error.message);
          process.exitCode = 1;
        })} >
      </input>
      <input id="UpdateBaseURI_text" type="text" placeholder="https://yoursite.com/..."></input><br></br>

      <input className={styles.submitButton} type="submit" value="Check if Revealed" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckIfRevealed_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input><br></br>
      <input className={styles.submitButton} type="submit" value="Reveal Collection" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
        Reveal_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
        catch((error) => {
          console.error(error);
          console.log("reveal collection error code: " + error.code);
          console.log("reveal collection error message: " + error.message);
          process.exitCode = 1;
        })} >
      </input><br></br>

      <input className={styles.submitButton} type="submit" value="Withdraw" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
        Withdraw_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
        catch((error) => {
          console.error(error);
          console.log("withdraw error code: " + error.code);
          console.log("withdraw error message: " + error.message);
          process.exitCode = 1;
        })} >
      </input><br></br>
      
      <input className={styles.submitButton} type="submit" value="SetPlatformRoyalty" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
        SetPlatformRoyalty_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
        catch((error) => {
          console.error(error);
          console.log("set platform royalty error code: " + error.code);
          console.log("set platform royalty error message: " + error.message);
          process.exitCode = 1;
        })} >
      </input>
      <input id="PlatformRoyalty_value" type="number" min="0" max="1000" placeholder="200"></input><br></br>
      <br></br>

    </div>
  );
}

export default Interact