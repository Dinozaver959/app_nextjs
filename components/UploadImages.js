import React, {  useRef } from 'react';   // useState
import useState from 'react-usestateref';
import styles from "../styles/CreateContent.module.css";
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from "react-hook-form";
import Moralis from 'moralis';
import UploadImagesBulk from './comp_UploadImagesBulk';



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

              onChange={EnableFileUpload}

              ref={myContainer}
            />
          )}
        />
        {errors.collectionNameController && errors.collectionNameController.type === "required" && <span><br></br>required</span> }
        <br></br>

        <UploadImagesBulk disabled={disabledUpload} collectionName={selectedCollectionName} UserAccount={(Moralis.User.current()).id}/>

        <br></br>
    </>
  )
}

export default UploadImages