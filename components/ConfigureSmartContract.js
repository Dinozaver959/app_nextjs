import React, { useState, useRef } from 'react'
import styles from "../styles/CreateContent.module.css";
import AsyncSelect from 'react-select/async'
import { useForm, Controller  } from "react-hook-form";
import Moralis from 'moralis';

function ConfigureSmartContract() {

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
    xhr.open('POST', '/api/api-configureSmartContract', false);
    xhr.onload = function () {
      // do something to response
      // console.log(this.responseText);

      // update the feedback text 
      document.getElementById('submitFeedback').style.display = 'inline';
      document.getElementById('submitFeedback').innerText = 'Parameters added'

      // prevent the Submit button to be clickable and functionable
      removeHover()
      document.getElementById('SubmitButton').disabled = true

      // think about also removing the hover effect
      // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
      console.log("--------------")

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
    // return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-notDeployed`).then(res => res.json());
    return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-notDeployed` + '?id=' + ((Moralis.User.current()).id)).then(res => res.json());        
  };


  // update Submit button
  const refButton = useRef(null);
  function removeHover(){
    const b1 = refButton.current;                 // corresponding DOM node
    b1.className = styles.submitButton_noHover;   // overwrite the style with no hover
  }


  return (

    <> 
      <div className={styles.createTitle}> Configure Smart Contract</div><br></br>

      <form id="formToSubmit" method="post" encType="multipart/form-data"  onSubmit={handleSubmit(onSubmit)}>              

        <div className={styles.gridContainer}> 

        <div className={styles.gridItem}></div>
          <div className={styles.gridItem}>
          <Controller
            name="collectionNameController"
            control={control}
            rules={{ required: true }}

            value={selectedValue}
            render={({ field }) => (
              <AsyncSelect
              {...field}
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
  
          <div className={styles.gridItem}> Max Supply: </div>
          <input className={styles.gridItem} type="number" {...register('MAX_SUPPLY', { required: true, min : 3, max : 10000})}></input>
          <div className={styles.gridItem}> 
          {errors.MAX_SUPPLY && errors.MAX_SUPPLY.type === "required" && <span>required</span> }
          {errors.MAX_SUPPLY && errors.MAX_SUPPLY.type === "max" && <span>Max size is 10000</span> }
          {errors.MAX_SUPPLY && errors.MAX_SUPPLY.type === "min" && <span>Min size is 3</span>}
          </div>   

          <div className={styles.gridItem}> Mint Price: </div>
          <input className={styles.gridItem} type="number" step="0.001" {...register('MINT_PRICE', { required: true, min : 0.01, max : 1})}></input> 
          <div className={styles.gridItem}> 
          {errors.MINT_PRICE && errors.MINT_PRICE.type === "required" && <span>required</span> }
          {errors.MINT_PRICE && errors.MINT_PRICE.type === "max" && <span>Max price is 1</span> }
          {errors.MINT_PRICE && errors.MINT_PRICE.type === "min" && <span>Min price is 0.01</span>}
          </div>

          <div className={styles.gridItem}> Max amount To mint: </div>
          <input className={styles.gridItem} type="number" name="MAX_TO_MINT" {...register('MAX_TO_MINT', { required: true, min : 1, max : 100})}></input> 
          <div className={styles.gridItem}> 
          {errors.MAX_TO_MINT && errors.MAX_TO_MINT.type === "required" && <span>required</span> }
          {errors.MAX_TO_MINT && errors.MAX_TO_MINT.type === "max" && <span>Max is 100</span> }
          {errors.MAX_TO_MINT && errors.MAX_TO_MINT.type === "min" && <span>Min is 1</span>}
          </div>

          <div className={styles.gridItem}> Token Name: </div>   
          <input className={styles.gridItem} type="text" {...register('_NAME_', { required: true, minLength : 4, maxLength : 16})}></input> 
          <div className={styles.gridItem}>
          {errors._NAME_ && errors._NAME_.type === "required" && <span>required</span> }
          {errors._NAME_ && errors._NAME_.type === "maxLength" && <span>Max length is 16 chars</span> }
          {errors._NAME_ && errors._NAME_.type === "minLength" && <span>Min length is 4 chars</span>}
          </div>

          <div className={styles.gridItem}> Token Symbol: </div>  
          <input className={styles.gridItem} type="text" {...register('_SYMBOL_', { required: true, minLength : 2, maxLength : 4})}></input> 
          <div className={styles.gridItem}>
          {errors._SYMBOL_ && errors._SYMBOL_.type === "required" && <span>required</span> }
          {errors._SYMBOL_ && errors._SYMBOL_.type === "maxLength" && <span>Max length is 4 chars</span> }
          {errors._SYMBOL_ && errors._SYMBOL_.type === "minLength" && <span>Min length is 2 chars</span>}
          </div>

          <input id="SubmitButton" className={styles.submitButton} type="submit" value="Submit" ref={refButton} ></input>
        </div>

      </form>

      <p id="submitFeedback" hidden></p>
    </>
  )
}

export default ConfigureSmartContract