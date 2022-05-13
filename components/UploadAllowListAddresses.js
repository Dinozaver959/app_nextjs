import React, {  useRef } from 'react';   // useState
import Link from 'next/link';
import useState from 'react-usestateref';
import styles from "../styles/CreateContent.module.scss";
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from "react-hook-form";
import {setAllowListRoot_Moralis} from "../JS/local_web3_Moralis";
import Moralis from 'moralis';
import UploadImagesBulk from './UploadImagesBulkComponent';
import {AsyncSelectCustomStyles} from './AsyncSelectStyle'


function UploadAllowListAddresses() {

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

  function ValidateSelection(value) {
    // undefined or null - not good
    return (value == null) ? false : true;
  }


  // load options using API call
  const loadOptions = (inputValue) => {
    return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-deployed` + '?id=' + ((Moralis.User.current()).id)).then(res => res.json());    
  };


  return (
    <> 
      <div className={styles.createTitle}>Upload the Addresses for the Allow List</div><br></br>


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


      Single .txt file, max 1MB file size

      <Link href="/Samples/allowList_sample.txt" passHref>
        <a target="_blank" rel="noopener noreferrer">
          <input className={styles.downloadSample} type="submit" value="Download Sample"></input>
        </a>
      </Link>


      <UploadImagesBulk 
        disabled={disabledUpload} 
        collectionName={selectedCollectionName} 
        UserAccount={(Moralis.User.current()).id}
        url="https://easylaunchnft.com/api/api-uploadAllowListAddresses" 
        accept=".txt" 
        nextLinkID=""
        multiple={false}
        name="ALLOWLISTADDRESSES_FILE"
        maxFileSize="1000000"
      />

      <br></br>
      after you have uploaded the file, send it to the blockchain below

      <input className={styles.interactButton} type="submit" value="set allow list" onClick={ async () => ValidateSelection(selectedCollectionName) && setAllowListRoot_Moralis(selectedCollectionName)}></input>

      <br></br>

      <Link href="/interact" passHref >
        <input className={styles.interactButton} type="submit" value="back to interact page"></input>
      </Link>
    </>
  )
}

export default UploadAllowListAddresses