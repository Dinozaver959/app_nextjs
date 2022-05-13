import React, {  useRef } from 'react';   // useState
import Link from 'next/link';
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
      <div className={styles.createTitle}>
        Upload the Collection&apos;s Metadata
        <HelpButton title="Optional step. Recommended for generative collections with different rarities" size="18" placement="right" color="white"/>
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
          {errors.collectionNameController && errors.collectionNameController.type === "required" && <span><br></br>required</span> }
        </div>
      </div>


      Single .json file, max 10MB file size

      <Link href="/Samples/metadata_sample.json" passHref>
        <a target="_blank" rel="noopener noreferrer">
          <input className={styles.downloadSample} type="submit" value="Download Sample"></input>
        </a>
      </Link>


      <UploadImagesBulk 
        disabled={disabledUpload} 
        collectionName={selectedCollectionName} 
        UserAccount={(Moralis.User.current()).id}
        url="https://easylaunchnft.com/api/api-uploadMetadata" 
        accept=".json" 
        nextLinkID="configureSmartContractLink"
        multiple={false}
        name="METADATA_FILE"
        maxFileSize="10000000"
      />

    </>
  )
}

export default UploadImages