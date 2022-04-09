import React, { useState, useRef } from 'react';
import styles from "../styles/CreateContent.module.css";
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from "react-hook-form";
import Moralis from 'moralis';
import UploadImagesTest_ from './UploadImagesTest';


//import {FileUpload} from 'primereact/fileupload';
//import "primereact/resources/themes/lara-light-indigo/theme.css";
//import "primereact/resources/primereact.min.css";
//import "primeicons/primeicons.css"


function UploadImages() {

  const { register, handleSubmit, formState: { errors }, control } = useForm();

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

  function getSelectedValue() {
    return selectedValue;
  }

/*
  // EXTRA - TESTING
  // sends the parameters, but not the files :(

  // importand: add this to the <fileUpload> component
    customUpload={true}
    uploadHandler={customUploadHandler}     
    
  const customUploadHandler = ({files}) => {
    const [file] = files;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      uploadForm(e.target.result);
    };
    fileReader.readAsDataURL(file);
  };

  const uploadForm = async (files) => {

    //let formData = new FormData();
    var form = document.querySelector('form');
    var formData = new FormData(form);

    const response = await fetch(`https://easylaunchnft.com/serverUploadImages/bulkCollection`,
        {
            method: 'POST',
            body: formData
        },
    );
  };

*/


  const url_ = "https://easylaunchnft.com/serverUploadImages/bulkCollection"


  return (
    <> 
      <div className={styles.createTitle}>Upload Images - Upload Images</div><br></br>

      <form method="post" encType="multipart/form-data" >              

      {/** 
        <input hidden value={(Moralis.User.current()).id} {...register('UserAccount', { required: true})} ></input>
      */}

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


        <UploadImagesTest_ collectionName={handleInputChange} UserAccount={(Moralis.User.current()).id}/>
         

        {/*
        <UploadImagesTest_ 
          collectionName={} 
          UserAccount={(Moralis.User.current()).id}
        />
        */}
        

        {/*
        <FileUpload 
          name="demo[]" 
          url={url_} 
          accept="image/*" 
          multiple 
          maxFileSize="6500000000"  
        />
        */}

      </form>

      <p id="submitFeedback" hidden></p>
    </>
  )
}

export default UploadImages