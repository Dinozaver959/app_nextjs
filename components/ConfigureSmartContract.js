import React, { useState, useRef } from 'react'
import styles from "../styles/CreateContent.module.scss";
import AsyncSelect from 'react-select/async'
import { useForm, Controller  } from "react-hook-form";
import Moralis from 'moralis';
import {AsyncSelectCustomStyles} from './AsyncSelectStyle'

import HelpButton from './help-button';

import Radio from '@mui/material/Radio';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


function ConfigureSmartContract() {

  // SUBMIT - validation
  const { register, handleSubmit, formState: { errors }, control } = useForm();
  const onSubmit = data => SubmitForm();  // console.log(data);

  function SubmitForm(){
    // show the feedback text 
    document.getElementById('submitFeedback').style.display = 'inline';
    document.getElementById('submitFeedback').innerText = 'Adding parameters...'

    var form = document.querySelector('form');
    var formData = new FormData(form);
    formData.append('UserAccount', (Moralis.User.current()).id);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/api-configureSmartContract', false);
    xhr.onload = function () {
      // do something to response
      // console.log(this.responseText);

      // update the feedback text 
      document.getElementById('submitFeedback').style.display = 'inline';
      document.getElementById('submitFeedback').innerText = 'Parameters added'

      // prevent the Submit button to be clickable and functionable
      removeHover()
      document.getElementById('SubmitButton').disabled = true

      // think about also removing the hover effect
      // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
      console.log("--------------")

      // move to the next tab
      document.getElementById('deployLink').click();

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
    // return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-notDeployed`).then(res => res.json());
    return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-notDeployed` + '?id=' + ((Moralis.User.current()).id)).then(res => res.json());        
  };


  // update Submit button
  const refButton = useRef(null);
  function removeHover(){
    const b1 = refButton.current;                 // corresponding DOM node
    b1.className = styles.submitButton_noHover;   // overwrite the style with no hover
  }


  
  // update Config values
  const maxSupplyRef = useRef(null);
  const mintPriceRef = useRef(null);
  const maxToMintRef = useRef(null);
  const tokenNameRef = useRef(null);
  const tokenSymbolRef = useRef(null);
  var lastSelectedValue = "";

  async function SetConfigValues(value){

    if(lastSelectedValue != value.name){
      lastSelectedValue = value.name;

      const collectionName = value.name;

      // get configValues
      const configValues = await fetch(`https://easylaunchnft.com/api/api-getConfigValues` + '?id=' + ((Moralis.User.current()).id) + "&collectionName=" + collectionName) // .then(res => res.json());  
      .then(res => res.json());

      //console.log(configValues)
      //console.log("-------------")

      maxSupplyRef.current.value = (configValues[0].maxSupply) ? configValues[0].maxSupply : ""
      mintPriceRef.current.value = (configValues[0].mintPrice) ? configValues[0].mintPrice : ""

      maxToMintRef.current.value = (configValues[0].maxToMint) ? configValues[0].maxToMint : ""
      tokenNameRef.current.value = (configValues[0].tokenName) ? configValues[0].tokenName : ""
      tokenSymbolRef.current.value = (configValues[0].tokenSymbol) ? configValues[0].tokenSymbol : ""
    }
  }


  // radio group for deployment option
  const [radioValue_deploymentOption, setRadioValue_deploymentOption] = useState('Free');
  function onChangeRadioGroup_deploymentOption(ev) {
    setRadioValue_deploymentOption({ selected: ev.target.value });
  }

  // radio group for allow list sale
  const [radioValue_allowListSale, setRadioValue_allowListSale] = useState('No');
  function onChangeRadioGroup_allowListSale(ev) {
    setRadioValue_allowListSale(ev.target.value);   // need to check if the value for the _ALLOWLIST_ gets set correctly
  }
  
  // radio group for allow list sale
  const [radioValue_dutchAuction, setRadioValue_dutchAuction] = useState('No');
  function onChangeRadioGroup_dutchAuction(ev) {
    setRadioValue_dutchAuction(ev.target.value);   // need to check if the value for the _DUTCHAUCTION_ gets set correctly
  }
  

  return (

    <> 
      <div className={styles.createTitle}> Configure Smart Contract</div><br></br>

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
                name="CollectionName"
                isClearable
                defaultOptions
                getOptionLabel={e => e.name}
                getOptionValue={e => e.name}
                loadOptions={loadOptions}
                onInputChange={handleInputChange}
                //onChange={SetConfigValues}
              />   
            )}
          />  
          </div>
          <div className={styles.gridItem}>
          {errors.collectionNameController && errors.collectionNameController.type === "required" && <span> required</span> }
          </div>

          <div className={styles.gridItem}> 
            Public Collection Name: 
            <HelpButton title="The collection name that will appear publicly, on platforms like Opensea and Looksrare" size="18" placement="right" color="white"/>
          </div>   
          <input className={styles.gridItem} type="text" {...register('_NAME_', { required: true, minLength : 4, maxLength : 16})} ></input> 
          <div className={styles.gridItem}>
          {errors._NAME_ && errors._NAME_.type === "required" && <span>required</span> }
          {errors._NAME_ && errors._NAME_.type === "maxLength" && <span>Max length is 16 chars</span> }
          {errors._NAME_ && errors._NAME_.type === "minLength" && <span>Min length is 4 chars</span>}
          </div>

          <div className={styles.gridItem}> 
            Token Symbol: 
            <HelpButton title="Abbreviation for the Collection name" size="18" placement="right" color="white"/>
            <input className={styles.inlineField} type="text" {...register('_SYMBOL_', { required: true, minLength : 2, maxLength : 4})} ></input> 
          </div>        
          <div className={styles.gridItem}>
          {errors._SYMBOL_ && errors._SYMBOL_.type === "required" && <span>required</span> }
          {errors._SYMBOL_ && errors._SYMBOL_.type === "maxLength" && <span>Max length is 4 chars</span> }
          {errors._SYMBOL_ && errors._SYMBOL_.type === "minLength" && <span>Min length is 2 chars</span>}
          </div>
  
          <div className={styles.gridItem}> 
            Max Supply: 
            <HelpButton title="The size of your collection" size="18" placement="right" color="white"/>
            <input className={styles.inlineField} type="number" {...register('MAX_SUPPLY', { required: true, min : 1, max : 10000})} ></input>
          </div>
          <div className={styles.gridItem}> 
          {errors.MAX_SUPPLY && errors.MAX_SUPPLY.type === "required" && <span>required</span> }
          {errors.MAX_SUPPLY && errors.MAX_SUPPLY.type === "max" && <span>Max size is 10000</span> }
          {errors.MAX_SUPPLY && errors.MAX_SUPPLY.type === "min" && <span>Min size is 1</span>}
          </div>   

          <div className={styles.gridItem}> 
            Max to Mint: 
            <HelpButton title="The maximum amount of NFTs to mint in 1 transaction at public sale" size="18" placement="right" color="white"/>
            <input className={styles.inlineField} type="number" {...register('MAX_TO_MINT', { required: true, min : 1, max : 100})} ></input> 
          </div>
          <div className={styles.gridItem}> 
          {errors.MAX_TO_MINT && errors.MAX_TO_MINT.type === "required" && <span>required</span> }
          {errors.MAX_TO_MINT && errors.MAX_TO_MINT.type === "max" && <span>Max `max to mint` is 100</span> }
          {errors.MAX_TO_MINT && errors.MAX_TO_MINT.type === "min" && <span>Min `max to mint` is 1</span>}
          </div>

          <div className={styles.gridItem}> 
            Mint Price: 
            <HelpButton title="The price of a nft for public sale in native currency ETH/BNB/Matic..." size="18" placement="right" color="white"/>
            <input className={styles.inlineField} type="number" step="0.001" {...register('MINT_PRICE', { required: true, min : 0.01, max : 10})} ></input> 
          </div>
          <div className={styles.gridItem}> 
          {errors.MINT_PRICE && errors.MINT_PRICE.type === "required" && <span>required</span> }
          {errors.MINT_PRICE && errors.MINT_PRICE.type === "max" && <span>Max price is 10</span> }
          {errors.MINT_PRICE && errors.MINT_PRICE.type === "min" && <span>Min price is 0.01</span>}
          </div>

          <div className={styles.gridItem}> 
            Dev Allocation: 
            <HelpButton title="Amount of NFTs reserved for the team. Make sure this is a multiple of the Max to Mint" size="18" placement="right" color="white"/>
            <input className={styles.inlineField} type="number" {...register('DEV_ALLOCATION', { required: true, min : 0, max : 10000})} ></input>
          </div>
          <div className={styles.gridItem}> 
          {errors.DEV_ALLOCATION && errors.DEV_ALLOCATION.type === "required" && <span>required</span> }
          {errors.DEV_ALLOCATION && errors.DEV_ALLOCATION.type === "max" && <span>Max size is 10000</span> }
          {errors.DEV_ALLOCATION && errors.DEV_ALLOCATION.type === "min" && <span>Min size is 0</span>}
          </div>   




          <div className={styles.gridItem}>
            Allow List Sale:
          </div>
          <div className={styles.gridItem}>
            <RadioGroup row name="_ALLOWLIST_" defaultValue="No" onChange={onChangeRadioGroup_allowListSale}>
              <FormControlLabel value="No" label={<> No <HelpButton title="The contract will not support presale" size="18" placement="right" color="white"/> </> } control={<Radio size="small" sx={{color: "white"}}> AAA </Radio> } />   
              <FormControlLabel value="Yes" label={<> Yes  <HelpButton title="After deployment you will be able to upload a list of address with access to presale" size="18" placement="right" color="white"/> </>} control={<Radio size="small" sx={{color: "white"}}/>} />
            </RadioGroup>
          </div>
          <div className={styles.gridItem}></div>

          
          { (radioValue_allowListSale == 'Yes') && (
            <>
              <div className={styles.gridItem}> 
                Max Supply: 
                <HelpButton title="Max supply reserved for presale" size="18" placement="right" color="white"/>
                <input className={styles.inlineField} type="number" {...register('MAX_SUPPLY_ALLOWLIST', { required: true, min : 1, max : 10000})} ></input>
              </div>
              <div className={styles.gridItem}> 
              {errors.MAX_SUPPLY_ALLOWLIST && errors.MAX_SUPPLY_ALLOWLIST.type === "required" && <span>required</span> }
              {errors.MAX_SUPPLY_ALLOWLIST && errors.MAX_SUPPLY_ALLOWLIST.type === "max" && <span>Max size is 10000</span> }
              {errors.MAX_SUPPLY_ALLOWLIST && errors.MAX_SUPPLY_ALLOWLIST.type === "min" && <span>Min size is 1</span>}
              </div>   

              <div className={styles.gridItem}> 
                Max to Mint: 
                <HelpButton title="The maximum amount of NFTs to mint during presale by one wallet" size="18" placement="right" color="white"/>
                <input className={styles.inlineField} type="number" {...register('MAX_TO_MINT_ALLOWLIST', { required: true, min : 1, max : 100})} ></input> 
              </div>
              <div className={styles.gridItem}> 
              {errors.MAX_TO_MINT_ALLOWLIST && errors.MAX_TO_MINT_ALLOWLIST.type === "required" && <span>required</span> }
              {errors.MAX_TO_MINT_ALLOWLIST && errors.MAX_TO_MINT_ALLOWLIST.type === "max" && <span>Max `max to mint` is 100</span> }
              {errors.MAX_TO_MINT_ALLOWLIST && errors.MAX_TO_MINT_ALLOWLIST.type === "min" && <span>Min `max to mint` is 1</span>}
              </div>

              <div className={styles.gridItem}> 
                Mint Price: 
                <HelpButton title="The price of a nft for presale in native currency ETH/BNB/Matic..." size="18" placement="right" color="white"/>
                <input className={styles.inlineField} type="number" step="0.001" {...register('MINT_PRICE_ALLOWLIST', { required: true, min : 0.01, max : 10})} ></input> 
              </div>
              <div className={styles.gridItem}> 
              {errors.MINT_PRICE_ALLOWLIST && errors.MINT_PRICE_ALLOWLIST.type === "required" && <span>required</span> }
              {errors.MINT_PRICE_ALLOWLIST && errors.MINT_PRICE_ALLOWLIST.type === "max" && <span>Max price is 10</span> }
              {errors.MINT_PRICE_ALLOWLIST && errors.MINT_PRICE_ALLOWLIST.type === "min" && <span>Min price is 0.01</span>}
              </div>
            </>
          )}






          <div className={styles.gridItem}>
            Dutch Auction Sale:
          </div>
          <div className={styles.gridItem}>
            <RadioGroup row name="_DUTCHAUCTION_" defaultValue="No" onChange={onChangeRadioGroup_dutchAuction}> 
              <FormControlLabel value="No" label={<> No <HelpButton title="The contract will not support dutch auction" size="18" placement="right" color="white"/> </> } control={<Radio size="small" sx={{color: "white"}}> AAA </Radio> } />   
              <FormControlLabel value="Yes" label={<> Yes  <HelpButton title="The contract will support dutch auction" size="18" placement="right" color="white"/> </>} control={<Radio size="small" sx={{color: "white"}}/>} />
            </RadioGroup>
          </div>
          <div className={styles.gridItem}></div>

          
          { (radioValue_dutchAuction == 'Yes') && (
            <>
              <div className={styles.gridItem}> 
                Max Supply: 
                <HelpButton title="Max supply reserved for dutch auction" size="18" placement="right" color="white"/>
                <input className={styles.inlineField} type="number" {...register('MAX_SUPPLY_DUTCHAUCTION', { required: true, min : 1, max : 10000})} ></input>
              </div>
              <div className={styles.gridItem}> 
              {errors.MAX_SUPPLY_DUTCHAUCTION && errors.MAX_SUPPLY_DUTCHAUCTION.type === "required" && <span>required</span> }
              {errors.MAX_SUPPLY_DUTCHAUCTION && errors.MAX_SUPPLY_DUTCHAUCTION.type === "max" && <span>Max size is 10000</span> }
              {errors.MAX_SUPPLY_DUTCHAUCTION && errors.MAX_SUPPLY_DUTCHAUCTION.type === "min" && <span>Min size is 1</span>}
              </div>   

              <div className={styles.gridItem}> 
                Max to Mint: 
                <HelpButton title="The maximum amount of NFTs to mint during dutch auction by one wallet" size="18" placement="right" color="white"/>
                <input className={styles.inlineField} type="number" {...register('MAX_TO_MINT_DUTCHAUCTION', { required: true, min : 1, max : 100})} ></input> 
              </div>
              <div className={styles.gridItem}> 
              {errors.MAX_TO_MINT_DUTCHAUCTION && errors.MAX_TO_MINT_DUTCHAUCTION.type === "required" && <span>required</span> }
              {errors.MAX_TO_MINT_DUTCHAUCTION && errors.MAX_TO_MINT_DUTCHAUCTION.type === "max" && <span>Max `max to mint` is 100</span> }
              {errors.MAX_TO_MINT_DUTCHAUCTION && errors.MAX_TO_MINT_DUTCHAUCTION.type === "min" && <span>Min `max to mint` is 1</span>}
              </div>

              <div className={styles.gridItem}> 
                Start Mint Price: 
                <HelpButton title="The mint price of at the start of dutch auction in native currency ETH/BNB/Matic..." size="18" placement="right" color="white"/>
                <input className={styles.inlineField} type="number" step="0.001" {...register('MINT_PRICE_DUTCHAUCTION_START', { required: true, min : 0.01, max : 10})} ></input> 
              </div>
              <div className={styles.gridItem}> 
              {errors.MINT_PRICE_DUTCHAUCTION_START && errors.MINT_PRICE_DUTCHAUCTION_START.type === "required" && <span>required</span> }
              {errors.MINT_PRICE_DUTCHAUCTION_START && errors.MINT_PRICE_DUTCHAUCTION_START.type === "max" && <span>Max start price is 10</span> }
              {errors.MINT_PRICE_DUTCHAUCTION_START && errors.MINT_PRICE_DUTCHAUCTION_START.type === "min" && <span>Min start price is 0.01</span>}
              </div>

              <div className={styles.gridItem}> 
                End Mint Price: 
                <HelpButton title="The mint price of at the end of dutch auction in native currency ETH/BNB/Matic..." size="18" placement="right" color="white"/>
                <input className={styles.inlineField} type="number" step="0.001" {...register('MINT_PRICE_DUTCHAUCTION_END', { required: true, min : 0.01, max : 10})} ></input> 
              </div>
              <div className={styles.gridItem}> 
              {errors.MINT_PRICE_DUTCHAUCTION_END && errors.MINT_PRICE_DUTCHAUCTION_END.type === "required" && <span>required</span> }
              {errors.MINT_PRICE_DUTCHAUCTION_END && errors.MINT_PRICE_DUTCHAUCTION_END.type === "max" && <span>Max end price is 10</span> }
              {errors.MINT_PRICE_DUTCHAUCTION_END && errors.MINT_PRICE_DUTCHAUCTION_END.type === "min" && <span>Min end price is 0.01</span>}
              </div>

              <div className={styles.gridItem}> 
                Duration: 
                <HelpButton title="The duration in minutes between the starting and ending price" size="18" placement="right" color="white"/>
                <input className={styles.inlineField} type="number" {...register('DURATION_DUTCHAUCTION', { required: true, min : 1, max : 2880})} ></input> 
              </div>
              <div className={styles.gridItem}> 
              {errors.DURATION_DUTCHAUCTION && errors.DURATION_DUTCHAUCTION.type === "required" && <span>required</span> }
              {errors.DURATION_DUTCHAUCTION && errors.DURATION_DUTCHAUCTION.type === "max" && <span>Max dutch auction duration is 2880 minutes</span> }
              {errors.DURATION_DUTCHAUCTION && errors.DURATION_DUTCHAUCTION.type === "min" && <span>Min dutch auction duration is 1 minute</span>}
              </div>

              <div className={styles.gridItem}> 
                Price Interval: 
                <HelpButton title="Length of intervals between price drops in minutes" size="18" placement="right" color="white"/>
                <input className={styles.inlineField} type="number" {...register('PRICE_INTERVAL_DUTCHAUCTION', { required: true, min : 1, max : 180})} ></input> 
              </div>
              <div className={styles.gridItem}> 
              {errors.PRICE_INTERVAL_DUTCHAUCTION && errors.PRICE_INTERVAL_DUTCHAUCTION.type === "required" && <span>required</span> }
              {errors.PRICE_INTERVAL_DUTCHAUCTION && errors.PRICE_INTERVAL_DUTCHAUCTION.type === "max" && <span>Max price interval is 180 minutes</span> }
              {errors.PRICE_INTERVAL_DUTCHAUCTION && errors.PRICE_INTERVAL_DUTCHAUCTION.type === "min" && <span>Min price interval is 1 minute</span>}
              </div>
            </>
          )}






          <div className={styles.gridItem}>
            Deployment Option:
          </div>
          <div className={styles.gridItem}>
            <RadioGroup name="_OPTION_" defaultValue="royalty" onChange={onChangeRadioGroup_deploymentOption}>   {/*  {...register('_OPTION_', { required: true })} */}
              <FormControlLabel value="royalty" label={<> Freemium <HelpButton title="0 upfront costs and 5% royalty from the mint revenue" size="18" placement="right" color="white"/> </> } control={<Radio size="small" sx={{color: "white"}}> AAA </Radio> } />   
              <FormControlLabel value="upfront" label={<> 1000 $BYTES  <HelpButton title="0% royalty from the mints - only possible on ETH mainnet" size="18" placement="right" color="white"/> </>} control={<Radio size="small" sx={{color: "white"}}/>} />
            </RadioGroup>
          </div>
          <div className={styles.gridItem}></div>

        </div>

        <div className={styles.submitButtonOuter}> 
          <input id="SubmitButton" className={styles.submitButton} type="submit" value="Configure" ref={refButton} ></input>
        </div>

      </form>

      <p id="submitFeedback" hidden></p>
    </>
  )
}

export default ConfigureSmartContract