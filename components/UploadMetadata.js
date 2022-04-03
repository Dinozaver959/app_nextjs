import React, { useState, useRef, useCallback } from 'react'
import styles from "../styles/CreateContent.module.css";
import AsyncSelect from 'react-select/async'
import { useForm, Controller  } from "react-hook-form";
import Moralis from 'moralis';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"; 


const maxFileSize = 1024 * 1024; // 10MB for json

const validationSchema = yup.object().shape({
  METADATA_FILE : yup
    .mixed()
    .test('name', 'File is required', value => {
      return value[0] && value[0].name !== '';
    })
    .test("fileSize", "Max file size is 10MB", (value) => { 
      return value[0] && value[0].size <= maxFileSize
    })
    .test("type", "Valid file type: .json", (value) => {
      return value[0] && value[0].type == "application/json";
    })
  ,

  collectionNameController : yup
  .mixed()
  .required("required")
})


function UploadImages() {

  // SUBMIT - validation
  const resolver = yupResolver(validationSchema)
  const { register, handleSubmit, formState: { errors }, control } = useForm({resolver});
  const onSubmit = data => SubmitForm();  // console.log(data);

  function SubmitForm(){

    // show the feedback text 
    document.getElementById('submitFeedback').style.display = 'inline';
    document.getElementById('submitFeedback').innerText = 'Adding metadata...'

    var form = document.querySelector('form');
    var formData = new FormData(form);
    formData.append('UserAccount', (Moralis.User.current()).id);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/api-uploadMetadata', false);
    xhr.onload = function () {
      // do something to response
      // console.log(this.responseText);

      // update the feedback text 
      document.getElementById('submitFeedback').innerText = 'Metadata added'

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
      <div className={styles.createTitle}>Upload the Collection&apos;s Metadata</div><br></br>

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

        MetaData file: 
        <input type="file" id="METADATA_FILE" {...register('METADATA_FILE', { required: true})} ></input><br></br>
        {errors.METADATA_FILE && errors.METADATA_FILE.type === "required" && <span><p>required</p></span> }
        {errors.METADATA_FILE && <span><p>{errors.METADATA_FILE.message}</p></span>}

        <br></br>
        <br></br>

        


        <input id="SubmitButton" className={styles.submitButton} type="submit" value="Submit" ref={refButton} ></input>
      </form>

      <p id="submitFeedback" hidden></p>
    </>
  )
}

export default UploadImages