import React, {  useRef } from 'react';   // useState
import useState from 'react-usestateref';
import styles from "../styles/CreateContent.module.scss";
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from "react-hook-form";
import Moralis from 'moralis';
import UploadImagesBulk from './UploadImagesBulkComponent';
import {AsyncSelectCustomStyles} from './AsyncSelectStyle'
import HelpButton from './help-button';


function PrerevealImage() {

  const { formState: { errors }, control } = useForm();

  // LOAD the dynamic DropDown
  const [inputValue, setValue, inputValueRef] = useState('');
  const [selectedValue, setSelectedValue, selectedValueRef] = useState(null);

  const [disabledUpload, setDisabledUpload] = useState(true);
  const [selectedCollectionName, setSelectedCollectionName] = useState("");

  const stateRef = useRef();
  stateRef.current = selectedValue;

  const myContainer = useRef(null);



  // handle input change event
  const handleInputChange = value => {
    setValue(value);
  };

  function EnableFileUpload(value){

    if(typeof value.name !== 'undefined' && value.name){  
     
      // enable upload component
      setDisabledUpload(false);

      // set the selected collectionName
      setSelectedCollectionName(value.name);
    }
  }
 
  // load options using API call
  const loadOptions = (inputValue) => {
    return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-notDeployed` + '?id=' + ((Moralis.User.current()).id)).then(res => res.json());    
  };

  return (
    <> 
      <div className={styles.createTitle}>
        Upload Prereveal Image for your Collection
        <HelpButton title="Optional step if you want to display 1 image for all nfts in the collection before reveal" size="18" placement="right" color="white"/>
      </div><br></br>  


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

                onChange={EnableFileUpload}

                ref={myContainer}
              />
            )}
          />
        </div>
        <div className={styles.gridItem}> 
          {errors.collectionNameController && errors.collectionNameController.type === "required" && <span>required</span> }
        </div>
      </div>

      Single image file, max 1MB file size
                
      <UploadImagesBulk 
        disabled={disabledUpload} 
        collectionName={selectedCollectionName} 
        UserAccount={(Moralis.User.current()).id}
        url="https://easylaunchnft.com/serverUploadImages/prereveal" 
        accept="image/*"  // accept= "jpg,jpeg,png,gif"
        nextLinkID="uploadImagesLink"
        multiple={false}
        name="demo"
        maxFileSize="1000000"
      />

    </>
  )
}

export default PrerevealImage