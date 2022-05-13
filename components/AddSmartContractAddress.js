import React, { useState, useRef } from 'react'
import styles from "../styles/CreateContent.module.scss";
import AsyncSelect from 'react-select/async'
import { useForm, Controller  } from "react-hook-form";
import Moralis from 'moralis';
import {AsyncSelectCustomStyles} from './AsyncSelectStyle'
import HelpButton from './help-button';


function Description() {

  // SUBMIT - validation
  const { register, handleSubmit, formState: { errors }, control } = useForm();
  const onSubmit = data => SubmitForm();  // console.log(data);

  function SubmitForm(){

    // show the feedback text 
    document.getElementById('submitFeedback').style.display = 'inline';
    document.getElementById('submitFeedback').innerText = 'Adding parameters...'

    var form = document.querySelector('form');
    var formData = new FormData(form);
    formData.append('UserAccount', (Moralis.User.current()).id);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/api-addSmartContractAddress', false);
    xhr.onload = function () {
      // do something to response
      // console.log(this.responseText);

      // update the feedback text 
      document.getElementById('submitFeedback').style.display = 'inline';
      document.getElementById('submitFeedback').innerText = 'Description added'

      // prevent the Submit button to be clickable and functionable
      removeHover()
      document.getElementById('SubmitButton').disabled = true

      // think about also removing the hover effect
      // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
      console.log("Address added")

    };
    xhr.send(formData);
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
      <div className={styles.createTitle}>Manually add smart contract address to your collection</div><br></br>

      <form id="formToSubmit" method="post" encType="multipart/form-data"  onSubmit={handleSubmit(onSubmit)}>              

        <div className={styles.gridContainer_1}> 

          <div className={styles.gridItem}> Select Collection:  </div> 
          <div className={styles.gridItem}>
            <Controller
              name="collectionNameController"
              control={control}
              rules={{ required: true }}

              value={selectedValue}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  styles={AsyncSelectCustomStyles}
                  id="CollectionName"
                  name="CollectionName"
                  isClearable
                  defaultOptions
                  getOptionLabel={e => e.name}
                  getOptionValue={e => e.name}
                  loadOptions={loadOptions}
                  onInputChange={handleInputChange}
                />   
              )}
            />  
          </div>
          <div className={styles.gridItem}>
          {errors.collectionNameController && errors.collectionNameController.type === "required" && <span> required</span> }
          </div>

          <div className={styles.gridItem}> 
            Address of the deployed smart contract:  
            <HelpButton title="You can only add address to a collection without an address. If you want to change it later, please contact our support" size="18" placement="right" color="white"/>
          </div> 
          <input className={styles.gridItem} type="text" {...register('_ADDRESS_', { required: true, minLength : 42, maxLength : 42})} ></input> 
          <div className={styles.gridItem}>
          {errors._ADDRESS_ && errors._ADDRESS_.type === "required" && <span>required</span> }
          {errors._ADDRESS_ && errors._ADDRESS_.type === "maxLength" && <span>Max length is 42 chars</span>}
          {errors._ADDRESS_ && errors._ADDRESS_.type === "minLength" && <span>Min length is 42 chars</span>}
          </div>

          {/*<input id="SubmitButton" className={styles.submitButton} type="submit" value="Submit" ref={refButton} ></input>*/}
        </div>

                
        <div className={styles.submitButtonOuter}> 
          <input id="SubmitButton" className={styles.submitButton} type="submit" value="Submit" ref={refButton} ></input>
        </div>

      </form>

      <p id="submitFeedback" hidden></p>
    </>
  )
}

export default Description