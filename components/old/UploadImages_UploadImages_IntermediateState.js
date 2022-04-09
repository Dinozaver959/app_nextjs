import React, { useState, useRef } from 'react';
import styles from "../styles/CreateContent.module.css";
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from "react-hook-form";
import Moralis from 'moralis';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"; 
import UploadImagesTest_ from './UploadImagesTest';


const validationSchema = yup.object().shape({
  collectionNameController : yup
  .mixed()
  .required("required")
})


function UploadImages() {

  // SUBMIT - validation
  const resolver = yupResolver(validationSchema)
  const { register, handleSubmit, formState: { errors }, control } = useForm({resolver});
  const onSubmit = data => SubmitForm();

  function SubmitForm(){

    // show the feedback text 
    document.getElementById('submitFeedback').style.display = 'inline';
    document.getElementById('submitFeedback').innerText = 'Uploading Images...'

    var form = document.querySelector('form');
    var formData = new FormData(form);
    formData.append('UserAccount', (Moralis.User.current()).id);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://easylaunchnft.com/serverUploadImages/prereveal', false);
    xhr.onload = function () {
      // update the feedback text 
      document.getElementById('submitFeedback').innerText = 'Images Uploaded'

      // prevent the Submit button to be clickable and functionable
      removeHover()
      document.getElementById('SubmitButton').disabled = true
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
      <div className={styles.createTitle}>Upload Images - Upload Images</div><br></br>

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
        {errors.collectionNameController && errors.collectionNameController.type === "required" && <span><br></br>required</span> }
        <br></br>

        <UploadImagesTest_ collectionName={handleInputChange} UserAccount={(Moralis.User.current()).id} />
        


        <input id="SubmitButton" className={styles.submitButton} type="submit" value="Submit" ref={refButton} ></input>
      </form>

      <p id="submitFeedback" hidden></p>
    </>
  )
}

export default UploadImages