import React, { useState, useRef } from 'react';
import styles from "../styles/CreateContent.module.scss";
import AsyncSelect from 'react-select/async'
import { useForm, Controller } from "react-hook-form";
import Moralis from 'moralis'
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"; 
import {AsyncSelectCustomStyles} from '../AsyncSelectStyle'


const maxFileSize = 1024 * 1024; // 1MB for images
const minFileSize = 100 * 1024  // 100KB 

const validationSchema = yup.object().shape({
  uploadPreRevealImage : yup
    .mixed()
    .test('name', 'File is required', value => {
      return value[0] && value[0].name !== '';
    })
    .test("fileSize", "Min file size is 100kB", (value) => { 
      return value[0] && minFileSize <= value[0].size
    })
    .test("fileSize", "Max file size is 1MB", (value) => { 
      return value[0] && value[0].size <= maxFileSize
    })
    .test("type", "Image file type expected", (value) => {
      return value[0] && value[0].type.includes('image');
    })
  ,

  collectionNameController : yup
  .mixed()
  .required("required")
})


function PrerevealImage() {

  // SUBMIT - validation
  const resolver = yupResolver(validationSchema)
  const { register, handleSubmit, formState: { errors }, control } = useForm({resolver});
  const onSubmit = data => SubmitForm(); 

  async function SubmitForm(){

    // show the feedback text 
    document.getElementById('submitFeedback').style.display = 'inline';
    document.getElementById('submitFeedback').innerText = 'Uploading prereveal image...'

    var form = document.querySelector('form');
    var formData = new FormData(form);
    
    // this needs to come before the file
    // formData.append('UserAccount', (Moralis.User.current()).id);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://easylaunchnft.com/serverUploadImages/prereveal', true);  //false 
    xhr.onload = function () {
      // update the feedback text 
      document.getElementById('submitFeedback').innerText = 'Prereveal image uploaded'

      // prevent the Submit button to be clickable and functionable
      removeHover();
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
      <div className={styles.createTitle}>Upload Prereveal Image for your Collection</div><br></br>  
        
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
          </div>
          <div className={styles.gridItem}> 
            {errors.collectionNameController && errors.collectionNameController.type === "required" && <span>required</span> }
          </div>


          <input hidden id="UserAccount" value={(Moralis.User.current()).id}  {...register('UserAccount', { required: true })} ></input>
          

          <div className={styles.gridItem}> PreReveal image:  </div> 
          <input className={styles.gridItem} id="uploadPreRevealImage" type="file"  {...register('uploadPreRevealImage', { required: true})} ></input>  
          <div className={styles.gridItem}>
          {errors.uploadPreRevealImage && errors.uploadPreRevealImage.type === "required" && <span><p>required</p></span> }
          {errors.uploadPreRevealImage && <span><p>{errors.uploadPreRevealImage.message}</p></span>}
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

export default PrerevealImage