import React, { useState, useRef } from 'react'
import styles from "../styles/CreateContent.module.css";
import AsyncSelect from 'react-select/async'
import {DeployContract_Moralis} from "../JS/local_web3_Moralis";
import { useForm, Controller  } from "react-hook-form";
import Moralis from 'moralis';

function  Deploy() {

  // SUBMIT - validation
  const { handleSubmit, formState: { errors }, control } = useForm();
  const onSubmit = data => SubmitForm();

  async function SubmitForm(){

    // show the feedback text 
    document.getElementById('submitFeedback').style.display = 'inline';
    document.getElementById('submitFeedback').innerText = 'Deploying contract...'

    let _CollectionName = document.getElementById("CollectionName").innerText;

    let userSigned = await DeployContract_Moralis(_CollectionName, (Moralis.User.current()).id, Moralis.chainId).      // update the deployment function - it should take 2 args from now
    catch((error) => {
      console.error(error);

      document.getElementById('submitFeedback').style.display = 'inline';
      document.getElementById('submitFeedback').innerText = 'An error occured, with error code: ' + error.code + '\n' + error.message;
      console.log("deploy error code: " + error.code);
      console.log("deploy error message: " + error.message);
      process.exitCode = 1;
    })

    if(userSigned){

      // update the feedback text 
      document.getElementById('submitFeedback').innerText = 'Contract deployed';

      // prevent the Submit button to be clickable and functionable
      removeHover()
      document.getElementById('SubmitButton').disabled = true

    } else {
      // shot the feedback text 
      document.getElementById('submitFeedback').style.display = 'inline';
      document.getElementById('submitFeedback').innerText = 'User denied transaction';
    }

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
    //return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-configuredNotDeployed`).then(res => res.json());   
    return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-configuredNotDeployed` + '?id=' + ((Moralis.User.current()).id)).then(res => res.json());     
  };


  // update Submit button
  const refButton = useRef(null);
  function removeHover(){
    const b1 = refButton.current;                 // corresponding DOM node
    b1.className = styles.submitButton_noHover;   // overwrite the style with no hover
  }


  return (
    <> 
      <div> Deploy </div><br></br>

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

        <input id="SubmitButton" className={styles.submitButton} type="submit" value="Submit" ref={refButton} ></input>
      </form>

      <p id="submitFeedback" hidden></p>
    </>
  );
}

export default Deploy