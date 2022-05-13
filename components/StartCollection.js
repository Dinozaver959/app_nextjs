import React, { useRef } from 'react';
import styles from "../styles/CreateContent.module.scss";
import { useForm, useFormContext } from "react-hook-form";
import Moralis from 'moralis'
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"; 
import {GetWallet_NonMoralis} from "../JS/local_web3_Moralis";

import HelpButton from './help-button';

const validationSchema = yup.object().shape({

  CollectionName : yup
    .string()
    .required("required")
    .matches(/^[a-zA-Z0-9]+$/ , "No spaces or special characters")
    .matches(/^[a-zA-Z][a-zA-Z0-9_-]*$/ , "Start with an alphabet character.")
    .test('len', 'Must be between 4 and 24 chars', val => val.length >= 4 && val.length <= 24)
})


function StartCollection() {

  const resolver = yupResolver(validationSchema)
  const { register, handleSubmit, formState: { errors } } = useForm({resolver});
  const onSubmit = data => SubmitForm(); 

  async function SubmitForm(){

    // check in DB if collectionName already exists
    const colName= document.getElementById('CollectionName').value;
    const params =  { collectionName: colName };
    if(await Moralis.Cloud.run("DoesCollectionExist", params)){
      document.getElementById('submitFeedback').style.display = 'inline';
      document.getElementById('submitFeedback').innerText = 'collection with this name already exist'
      return;
    }

    // show the feedback text 
    document.getElementById('submitFeedback').style.display = 'inline';
    document.getElementById('submitFeedback').innerText = 'Creating collection...'

    var form = document.querySelector('form');
    var formData = new FormData(form);
    formData.append('UserAccount', (Moralis.User.current()).id);

    const connectedAddress = await GetWallet_NonMoralis();
    formData.append('OwnerWallet', connectedAddress);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/api-startCollection', false);
    xhr.onload = function () {
      // do something to response
      // console.log(this.responseText);

      // update the feedback text 
      document.getElementById('submitFeedback').innerText = 'Collection created'

      // prevent the Submit button to be clickable and functionable
      removeHover()
      document.getElementById('SubmitButton').disabled = true

      // think about also removing the hover effect
      // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
      console.log("collection created")

      // move to the next tab
      //window.location.replace("./description");
      document.getElementById('descriptionLink').click();

    };
    xhr.send(formData);
  }


  // update Submit button
  const refButton = useRef(null);
  function removeHover(){
    const b1 = refButton.current;                 // corresponding DOM node
    b1.className = styles.submitButton_noHover;   // overwrite the style with no hover
  }


  return (
    <> 
      <div className={styles.createTitle}>Create a Collection</div>

      <br></br>  
        
      <form id="formToSubmit" method="post" encType="multipart/form-data"  onSubmit={handleSubmit(onSubmit)}>              {/** action="/api/api-uploadImages" */}

        <div className={styles.gridContainer_1}> 

          <div className={styles.gridItem}> 
            Local Name for Collection:  
            <HelpButton title="Unique collection name for internal Database. You will be able to specify the actual collection name later." size="18" placement="right" color="white"/>
          </div>

          <input className={styles.gridItem} id="CollectionName" type="text" {...register('CollectionName', { required: true, minLength: 4, maxLength: 24, pattern: /^[a-z][a-z0-9_-]*/i })} ></input>
          <div className={styles.gridItem}> 
          {/*
          {errors.CollectionName && errors.CollectionName.type === "required" && <span><p>required</p></span> }
          {errors.CollectionName && errors.CollectionName.type === "maxLength" && <span><p>Max length is 24 chars</p></span> }
          {errors.CollectionName && errors.CollectionName.type === "minLength" && <span><p>Min length is 4 chars</p></span>}
          {errors.CollectionName && errors.CollectionName.type === "pattern" && <span><p>Start with an alphabet character. No spaces or special characters</p></span> }
          */}
          {errors.CollectionName && <span><p>{errors.CollectionName.message}</p></span>}
          </div>
  

          
        </div>
        
        <div className={styles.submitButtonOuter}> 
          <input id="SubmitButton" className={styles.submitButton} type="submit" value="Submit" ref={refButton} ></input>
        </div>

      </form>

      <p id="submitFeedback" hidden></p>

    </>
  )
}

export default StartCollection