import React, { useState } from 'react'
import styles from "../styles/CreateContent.module.css";
import AsyncSelect from 'react-select/async'
import { useForm, Controller  } from "react-hook-form";
import {useMoralis} from 'react-moralis';

function UploadImages() {

  // SUBMIT - validation
  const {account} = useMoralis();
  const { register, handleSubmit, formState: { errors }, control } = useForm();
  const onSubmit = data => SubmitForm();  // console.log(data);


  function SubmitForm(){

    console.log("-------0-------")
    console.log("value: " + document.getElementById('CollectionName_Async').value)
    console.log("selectedValue: " + document.getElementById('CollectionName_Async').selectedValue)

    //const el = document.getElementById('CollectionName_Async');
    //console.log("el.options[el.selectedIndex].value: " + el.options[el.selectedIndex].value)



    console.log("-------1-------")
    var form = document.querySelector('form');
    var formData = new FormData(form);
    //formData.append('UserAccount', {account});

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/api-uploadMetadata', false);
    xhr.onload = function () {
      // do something to response
      // console.log(this.responseText);

      // shot the feedback text 
      document.getElementById('submitFeedback').style.display = 'inline';
      document.getElementById('submitFeedback').innerText = 'Form submitted'

      // prevent the Submit button to be clickable
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
      Upload the Collection&apos;s Metadata 
      <br></br>
      <br></br>


      {/*<form action="/api/api-uploadMetadata" method="POST" encType="multipart/form-data"> */}
      <form id="formToSubmit" method="post" encType="multipart/form-data"  onSubmit={handleSubmit(onSubmit)}>              



      <Controller
        name="company"
        control={control}
        rules={{ required: true }}
        defaultValue="Select..."
        render={({ field }) => (
          <AsyncSelect
            {...field}
            id="CollectionName_Async"
            name='CollectionName'
            isClearable
            defaultOptions
            value={selectedValue}
            getOptionLabel={e => e.name}
            getOptionValue={e => e.name}
            loadOptions={loadOptions}
            onInputChange={handleInputChange}
            onChange={handleChange}
          />
        )}
      />


        CollectionName: {errors.CollectionName && errors.CollectionName.type === "required" && <span>required</span> }
        <br></br>
        company: {errors.company && errors.company.type === "required" && <span>required</span> }
        <br></br>
        <br></br>

        {/*
        CollectionName: <input name="CollectionName" id="CollectionName" type="text" defaultValue="Sample Collection Name" minLength="4" maxLength="24"></input>    
        */}

        <input hidden readOnly name="UserAccount" id="UserAccount" type="text" value={account}></input>
 

        MetaData .json file: 
        <input type="file" id="METADATA_FILE" {...register('METADATA_FILE', { required: true})}></input>
        {errors.METADATA_FILE && errors.METADATA_FILE.type === "required" && <span>required</span> }
        <br></br>


        <input id="SubmitButton" className={styles.submitButton} type="submit" value="Submit"></input>

      </form>

      <p id="submitFeedback" hidden></p>


    </>
  )
}

export default UploadImages