import React, { useState } from 'react'
import Link from 'next/link';
import styles from "../styles/CreateContent.module.scss";
import style from "../styles/Interact.module.scss";
import stylesContainer from "../styles/CreateContainer.module.scss";
import AsyncSelect from 'react-select/async'
import {CheckTotalSupply_Moralis, PublicMint_Moralis, AllowListMint_Moralis, CheckContractName_Moralis, CheckContractSymbol_Moralis, CheckPreSaleActive_Moralis, CheckPublicSaleActive_Moralis, CheckOwner_Moralis,
  SetPreSaleActive_Moralis, SetPublicSaleActive_Moralis, CheckTokenURI_Moralis, UpdateBaseURI_Moralis, CheckIfRevealed_Moralis, Reveal_Moralis, Withdraw_Moralis, SetPlatformRoyalty_Moralis} from "../JS/local_web3_Moralis";
import Moralis from 'moralis';
import {AsyncSelectCustomStyles} from './AsyncSelectStyle'
import HelpButton from './help-button';


function  Interact() {

  const [inputValue, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);

  // handle input change event
  const handleInputChange = value => {
    setValue(value);
  };
 
  // handle selection
  const handleChange = value => {
    setSelectedValue(value);
    HideDisplays();
  }
 
  // load options using API call
  const loadOptions = (inputValue) => {
    return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-deployed` + '?id=' + ((Moralis.User.current()).id)).then(res => res.json());    
  };

  function ValidateSelection(value) {
    // undefined or null - not good
    return (value == null) ? false : true;
  }

  function HideDisplays(){
    document.getElementById('Interact_TotalSupplyDisplay').style.visibility = "hidden";
    document.getElementById('Interact_CheckSaleActiveDisplay').style.visibility = "hidden";
    document.getElementById('Interact_CheckIfRevealedDisplay').style.visibility = "hidden";

    document.getElementById('Interact_TotalSupplyDisplay').innerText = "";
    document.getElementById('Interact_CheckSaleActiveDisplay').innerText = "";
    document.getElementById('Interact_CheckIfRevealedDisplay').innerText = "";

    // just added for write operations
    document.getElementById('Interact_MintDisplay').style.visibility = "hidden";
    document.getElementById('Interact_SetSaleActiveDisplay').style.visibility = "hidden";
    document.getElementById('Interact_MintDisplay').innerText = "";
    document.getElementById('Interact_CheckPreSaleActiveDisplay').innerText = "";
    document.getElementById('Interact_SetPreSaleActiveDisplay').innerText = "";
    document.getElementById('Interact_AllowListMintDisplay').innerText = "";
    document.getElementById('Interact_SetSaleActiveDisplay').innerText = "";
    document.getElementById('UpdateBaseURI_text').value = "";

    //document.getElementById('Interact_CheckToken_0URIDisplay').style.visibility = "hidden";
    //document.getElementById('Interact_CheckToken_0URIDisplay').innerText = "";
    //document.getElementById('Interact_CheckOwnerDisplay').style.visibility = "hidden";
    //document.getElementById('Interact_CheckContractNameDisplay').style.visibility = "hidden";
    //document.getElementById('Interact_CheckContractSymbolDisplay').style.visibility = "hidden";
    //document.getElementById('Interact_CheckOwnerDisplay').innerText = "";
    //document.getElementById('Interact_CheckContractNameDisplay').innerText = "";
    //document.getElementById('Interact_CheckContractSymbolDisplay').innerText = "";    
    //document.getElementById('PlatformRoyalty_value').value = "";
  }


  return (

    <> 
      <div className={styles.createTitle}>Interact with smart contracts you&apos;ve launched</div><br></br>

      <div className={stylesContainer.FormLikeStyle_TEMP}>

        <div className={styles.gridItem}> 
          Select Collection:  
          <HelpButton title="You need to be connected to appropriate network in MM for buttons to work. Check in Dashboard on which network a contract was deployed" size="18" placement="right" color="white"/>
        </div> 
        <div className={styles.gridItem}>
          <AsyncSelect
            styles={AsyncSelectCustomStyles}
            id="CollectionName_Async"
            cacheOptions
            defaultOptions
            value={selectedValue}
            getOptionLabel={e => e.name}
            getOptionValue={e => e.id}
            loadOptions={loadOptions}
            onInputChange={handleInputChange}
            onChange={handleChange}
          />
        </div>

        <div className={styles.gridContainer_2}>         

          <Link href="/interact/uploadAllowList" passHref >
            <input className={styles.interactButton} type="submit" value="Upload Presale Allow List"></input>
          </Link>
          <div className={style.display} id="none"></div>


          <input className={styles.interactButton} type="submit" value="Check Presale Active" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckPreSaleActive_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input>
          <div className={style.display} id="Interact_CheckPreSaleActiveDisplay"></div>
          
          <input className={styles.interactButton} type="submit" value="Set Presale Active" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
            SetPreSaleActive_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
            then(() => {
              document.getElementById('Interact_SetPreSaleActiveDisplay').innerText = "Presale activated!";
              document.getElementById('Interact_SetPreSaleActiveDisplay').style.visibility = "visible";
            }).
            catch((error) => {
              console.error(error);
              console.log("set sale error code: " + error.code);
              console.log("set sale error message: " + error.message);
              document.getElementById('Interact_SetPreSaleActiveDisplay').innerText = error.message;
              document.getElementById('Interact_SetPreSaleActiveDisplay').style.visibility = "visible";
              process.exitCode = 1;
            })} >
          </input>
          <div className={style.display} id="Interact_SetPreSaleActiveDisplay"></div>

          <input className={styles.interactButton} type="submit" value="Allow List Mint" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
            AllowListMint_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
            then(() => {
              document.getElementById('Interact_AllowListMintDisplay').innerText = "Minted!";
              document.getElementById('Interact_AllowListMintDisplay').style.visibility = "visible";
            }).
            catch((error) => {
              console.error(error);
              console.log("mint error code: " + error.code);
              console.log("mint error message: " + error.message);
              document.getElementById('Interact_AllowListMintDisplay').innerText = error.data.message;
              document.getElementById('Interact_AllowListMintDisplay').style.visibility = "visible";
              process.exitCode = 1;
            })} >
          </input>
          <div className={style.display} id="Interact_AllowListMintDisplay"></div>


          <div className={style.verticalSpacer}></div>
          <div className={style.verticalSpacer}></div>


          <input className={styles.interactButton} type="submit" value="Check Sale Active" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckPublicSaleActive_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input>
          <div className={style.display} id="Interact_CheckSaleActiveDisplay"></div>
          
          <input className={styles.interactButton} type="submit" value="Set Sale Active" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
            SetPublicSaleActive_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
            then(() => {
              document.getElementById('Interact_SetSaleActiveDisplay').innerText = "Sale activated!";
              document.getElementById('Interact_SetSaleActiveDisplay').style.visibility = "visible";
            }).
            catch((error) => {
              console.error(error);
              console.log("set sale error code: " + error.code);
              console.log("set sale error message: " + error.data.message);
              document.getElementById('Interact_SetSaleActiveDisplay').innerText = error.data.message;
              document.getElementById('Interact_SetSaleActiveDisplay').style.visibility = "visible";
              process.exitCode = 1;
            })} >
          </input>
          <div className={style.display} id="Interact_SetSaleActiveDisplay"></div>

          <input className={styles.interactButton} type="submit" value="Mint" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
            PublicMint_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
            then(() => {
              document.getElementById('Interact_MintDisplay').innerText = "Minted!";
              document.getElementById('Interact_MintDisplay').style.visibility = "visible";
            }).
            catch((error) => {
              console.error(error);
              console.log("mint error code: " + error.code);
              console.log("mint error message: " + error.message);
              document.getElementById('Interact_MintDisplay').innerText = error.message;
              document.getElementById('Interact_MintDisplay').style.visibility = "visible";
              process.exitCode = 1;
            })} >
          </input>   {/*<br></br> */}
          <div className={style.display} id="Interact_MintDisplay"></div>


          <div className={style.verticalSpacer}></div>
          <div className={style.verticalSpacer}></div>
 


          <input className={styles.interactButton} type="submit" value="Check if Revealed" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckIfRevealed_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input>
          <div className={style.display} id="Interact_CheckIfRevealedDisplay"></div>
          
          <input className={styles.interactButton} type="submit" value="Reveal Collection" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
            Reveal_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
            then(() => {
              document.getElementById('Interact_RevealDisplay').innerText = "Collection Revealed!";
              document.getElementById('Interact_RevealDisplay').style.visibility = "visible";
            }).
            catch((error) => {
              console.error(error);
              console.log("reveal collection error code: " + error.code);
              console.log("reveal collection error message: " + error.message);
              document.getElementById('Interact_RevealDisplay').innerText = error.message;
              document.getElementById('Interact_RevealDisplay').style.visibility = "visible";
              process.exitCode = 1;
            })} >
          </input>
          <div className={style.display} id="Interact_RevealDisplay"></div>

          <input className={styles.interactButton} type="submit" value="Total Supply" onClick={ async () => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckTotalSupply_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input>
          <div className={style.display} id="Interact_TotalSupplyDisplay"></div>

          <input className={styles.interactButton} type="submit" value="Update BaseURI" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
            UpdateBaseURI_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
            catch((error) => {
              console.error(error);
              console.log("update base URI error code: " + error.code);
              console.log("update base URI error message: " + error.message);
              process.exitCode = 1;
            })} >
          </input>
          <input className={styles.gridItem} id="UpdateBaseURI_text" type="text" placeholder="https://yoursite.com/..."></input>

          <input className={styles.interactButton} type="submit" value="Withdraw" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
            Withdraw_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
            then(() => {
              document.getElementById('Interact_WithdrawDisplay').innerText = "Funds withdrawn!";
              document.getElementById('Interact_WithdrawDisplay').style.visibility = "visible";
            }).
            catch((error) => {
              console.error(error);
              console.log("withdraw error code: " + error.code);
              console.log("withdraw error message: " + error.message);
              document.getElementById('Interact_WithdrawDisplay').innerText = error.message;
              document.getElementById('Interact_WithdrawDisplay').style.visibility = "visible";
              process.exitCode = 1;
            })} >
          </input>
          <div className={style.display} id="Interact_WithdrawDisplay"></div>
          



          {/* 
          <input className={styles.interactButton} type="submit" value="Check Contract Owner" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckOwner_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input>
          <div className={style.display} id="Interact_CheckOwnerDisplay"></div>
          
          <input className={styles.interactButton} type="submit" value="Check Contract Name" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckContractName_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input>
          <div className={style.display} id="Interact_CheckContractNameDisplay"></div>
          
          <input className={styles.interactButton} type="submit" value="Check Contract Symbol" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckContractSymbol_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input>
          <div className={style.display} id="Interact_CheckContractSymbolDisplay"></div>

          <input className={styles.interactButton} type="submit" value="SetPlatformRoyalty" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && 
            SetPlatformRoyalty_Moralis((JSON.stringify(selectedValue)).split('"')[5]).
            catch((error) => {
              console.error(error);
              console.log("set platform royalty error code: " + error.code);
              console.log("set platform royalty error message: " + error.message);
              process.exitCode = 1;
            })} >
          </input>
          <input className={styles.gridItem} id="PlatformRoyalty_value" type="number" min="0" max="1000" placeholder="200"></input>

          <input className={styles.interactButton} type="submit" value="Check Token 0 URI" onClick={() => ValidateSelection((JSON.stringify(selectedValue)).split('"')[5]) && CheckTokenURI_Moralis((JSON.stringify(selectedValue)).split('"')[5])}></input>
          <div className={style.display} id="Interact_CheckToken_0URIDisplay"></div>
          */}

        </div>

      </div>
    </>
  );
}

export default Interact