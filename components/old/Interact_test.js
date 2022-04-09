import React, { useState } from 'react'
import styles from "../styles/CreateContent.module.css";
import stylesContainer from "../styles/CreateContainer.module.css";
import AsyncSelect from 'react-select/async'
import {CheckTotalSupply_Moralis, Mint_Moralis, CheckContractName_Moralis, CheckContractSymbol_Moralis, CheckSaleActive_Moralis, SetSaleActive_Moralis, CheckTokenURI_Moralis, UpdateBaseURI_Moralis, CheckIfRevealed_Moralis, Reveal_Moralis} from "../../JS/local_web3_Moralis";
import { useForm, Controller  } from "react-hook-form";
import {useMoralis} from 'react-moralis';

function  Interact() {

  // SUBMIT - validation
  const {account} = useMoralis();
  const { handleSubmit, formState: { errors }, control } = useForm();
  const onSubmit = data => SubmitForm();  // console.log(data);

  function SubmitForm(){
    console.log("submited")
  }


  // LOAD the dynamic DropDown
  const [inputValue, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);

  // handle input change event
  const handleInputChange = value => {
    setValue(value);
  };

  // load options using API call
  const loadOptions = (inputValue) => {
    return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-deployed`).then(res => res.json());    
  };


  return (
    <div className={stylesContainer.FormLikeStyle_TEMP}> 

      <div> Interact </div> <br></br>
      

      <form id="formToSubmit" method="post" encType="multipart/form-data"  onSubmit={handleSubmit(onSubmit)}>              

        <Controller
          name="collectionNameController"
          control={control}
          rules={{ required: true }}

          value={selectedValue}
          render={({ field }) => (
            <AsyncSelect
              {...field}
              id="CollectionName"
              name='CollectionName'
              isClearable
              defaultOptions
              getOptionLabel={e => e.name}
              getOptionValue={e => e.name}
              loadOptions={loadOptions}
              onInputChange={handleInputChange}
            />
          )}
        />
        {errors.collectionNameController && errors.collectionNameController.type === "required" && <span> required</span> }
        <br></br>
        <br></br>


        <input id="SubmitButton" className={styles.submitButton} type="submit" value="Submit"></input>

      

      <input className={styles.submitButton} type="submit" value="TotalSupply" onClick={async () => CheckTotalSupply_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input><br></br>
      <input className={styles.submitButton} type="submit" value="Mint" onClick={() => 
        Mint_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
        catch((error) => {
          console.error(error);
          console.log("mint error code: " + error.code);
          console.log("mint error message: " + error.message);
          process.exitCode = 1;
        })} >
      </input><br></br>

      <input className={styles.submitButton} type="submit" value="Check Contract Name" onClick={() => CheckContractName_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input><br></br>
      <input className={styles.submitButton} type="submit" value="Check Contract Symbol" onClick={() => CheckContractSymbol_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input><br></br>
 </form> 
      <input className={styles.submitButton} type="submit" value="CheckSaleActive" onClick={() => CheckSaleActive_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input><br></br>
      <input className={styles.submitButton} type="submit" value="SetSaleActive" onClick={() => 
        SetSaleActive_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
        catch((error) => {
          console.error(error);
          console.log("set sale error code: " + error.code);
          console.log("set sale error message: " + error.message);
          process.exitCode = 1;
        })} >
      </input><br></br>

      <input className={styles.submitButton} type="submit" value="Check Token_0 URI" onClick={() => CheckTokenURI_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input><br></br>

      <input className={styles.submitButton} type="submit" value="UpdateBaseURI" onClick={() => 
        UpdateBaseURI_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
        catch((error) => {
          console.error(error);
          console.log("update base URI error code: " + error.code);
          console.log("update base URI error message: " + error.message);
          process.exitCode = 1;
        })} >
      </input><br></br>
      <input id="UpdateBaseURI_text" type="text" defaultValue=""></input><br></br>

      <input className={styles.submitButton} type="submit" value="Check if Revealed" onClick={() => CheckIfRevealed_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input><br></br>
      <input className={styles.submitButton} type="submit" value="Reveal Collection" onClick={() => 
        Reveal_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
        catch((error) => {
          console.error(error);
          console.log("reveal collection error code: " + error.code);
          console.log("reveal collection error message: " + error.message);
          process.exitCode = 1;
        })} >
      </input><br></br>

    </div>
  );
}

export default Interact