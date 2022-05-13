import React, {  useRef } from 'react';   // useState
import useState from 'react-usestateref';
import styles from "../styles/CreateContent.module.scss";
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from "react-hook-form";
import Moralis from 'moralis';
import UploadImagesBulk from './UploadImagesBulkComponent';
import {AsyncSelectCustomStyles} from './AsyncSelectStyle'
import HelpButton from './help-button';


function UploadImages() {

  const { formState: { errors }, control } = useForm();

  // LOAD the dynamic DropDown
  const [inputValue, setValue, inputValueRef] = useState('');
  const [selectedValue, setSelectedValue, selectedValueRef] = useState(null);

  const [disabledUpload, setDisabledUpload] = useState(true);
  const [selectedCollectionName, setSelectedCollectionName] = useState("");

  const stateRef = useRef();
  stateRef.current = selectedValue;

  const myContainer = useRef(null);


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
      <div className={styles.createTitle}>Upload Images for your Collection</div><br></br>

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
          {errors.collectionNameController && errors.collectionNameController.type === "required" && <span><br></br>required</span> }
        </div>
      </div>

      <div> 
        10.000 collection size limit, max 600KB file size
        <HelpButton title="All images in collection need to have same extension and file names need to be number starting with 0. For example 0.jpg, 1.jpg... 9999.jpg" size="18" placement="right" color="white"/>
      </div>

      <UploadImagesBulk 
        disabled={disabledUpload} 
        collectionName={selectedCollectionName} 
        UserAccount={(Moralis.User.current()).id}
        url="https://easylaunchnft.com/serverUploadImages/bulkCollection" 
        accept="image/*"  // accept= "jpg,jpeg,png,gif"
        nextLinkID="uploadmetadataLink"
        multiple={true}
        name="demo[]"
        maxFileSize="6500000000" // total limit, but you only get a notification if a single file is over this limit
      />
 
    </>
  )
}

export default UploadImages