import React from 'react'
import styles from "../styles/CreateContent.module.css";
import Script from "next/script";
//import useForm from './FormHooks/useForm';
import { useForm, useFormContext } from "react-hook-form";




/*
function ValidateForm(){
  var collectionName = document.getElementsByName("CollectionName");
  alert("CollectionName: " + CollectionName);
}

onSubmit="return ValidateForm();"
*/

function UploadImages() {


/*
  //Final submit function
  const formSubmit = () => {

    console.log("Callback function when form is submitted!");
    console.log("Form Values ", values);
  }

  //Custom hook call
  const {handleChange, values,errors,handleSubmit} = useForm(formSubmit);

  <form method="post" action="/api/api-uploadImages" encType="multipart/form-data" onSubmit={handleSubmit}>              

  CollectionName: <input name="CollectionName" id="CollectionName" type="text" defaultValue="Sample Collection Name" minLength="4" maxLength="24" onChange={handleChange} ></input>
  {
    errors && ( <p> {errors.CollectionName} </p> )
  } 

  </form> 
*/

  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => SubmitForm();  // console.log(data);

  function SubmitForm(){
    var form = document.querySelector('form');
    var formData = new FormData(form);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/api-uploadImages', false);
    xhr.onload = function () {
      // do something to response
      // console.log(this.responseText);


      // shot the feedback text 
      document.getElementById('submitFeedback').style.display = 'inline';
      document.getElementById('submitFeedback').innerText = 'Form submitted'


    };
    xhr.send(formData);
  }


  return (

    <> 

      <div> UploadImages</div>      
        

      <form id="formToSubmit" method="post" action="/api/api-uploadImages" encType="multipart/form-data"  onSubmit={handleSubmit(onSubmit)}>              


        <input id="name" {...register('name', { required: true, minLength: 6, maxLength: 12, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })} />
        
        {errors.name && errors.name.type === "maxLength" && <span>Max length is 12</span> }
        {errors.name && errors.name.type === "minLength" && <span>Min length is 6</span>}
        {errors.name && errors.name.type === "maxLength" && <span>Max length exceeded</span> }
        {errors.name && errors.name.type === "pattern" && <span>give email pattern</span> }

        <input hidden name="UserAccount" id="UserAccount" type="text" value="testAccountAddress"></input>

        <br></br><br></br>

        CollectionName: <input name="CollectionName" id="CollectionName" type="text" defaultValue="Sample Collection Name" minLength="4" maxLength="24" ></input>
       

        <br></br>

        PreReveal image: <input name="uploadPreRevealImage" id="uploadPreRevealImage" type="file"></input>  
        <br></br>

        Collection&apos;s images: <input name="uploadMultipleImages" id="uploadMultipleImages" type="file" multiple="multiple"></input>      
        <br></br>
        
        Collection&apos;s description: <input name="CollectionDescription" id="CollectionDescription" type="text" width="200" height="80" defaultValue="Sample description" minLength="4" maxLength="240" ></input>
        <br></br>
        <br></br>


        <input id="CreateImagesSubmitButton" className={styles.submitButton} type="submit" value="Submit"></input>
      </form>

      <p id="submitFeedback" hidden></p>

    </>
  )
}

export default UploadImages