import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from "../styles/CreateContent.module.scss";
import AsyncSelect from 'react-select/async';
import {DeployContract_Moralis} from "../JS/local_web3_Moralis";
import { useForm, Controller  } from "react-hook-form";
import Moralis from 'moralis';
import {AsyncSelectCustomStyles} from './AsyncSelectStyle';


import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell,  { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {MdKeyboardArrowUp} from "react-icons/md";
import {MdKeyboardArrowDown} from "react-icons/md";
import { useMediaQuery } from '@material-ui/core';
import { createTheme, ThemeProvider , styled  } from '@mui/material/styles';




function  Deploy() {

  // SUBMIT - validation
  const { handleSubmit, formState: { errors }, control } = useForm();
  const onSubmit = data => SubmitForm();

  async function SubmitForm(){

    // show the feedback text 
    document.getElementById('submitFeedback').style.display = 'inline';
    document.getElementById('submitFeedback').innerText = 'Deploying contract...'

    let _CollectionName = document.getElementById("CollectionName").innerText;

    let userSigned = await DeployContract_Moralis(_CollectionName, (Moralis.User.current()).id).      // update the deployment function - it should take 2 args from now
    catch((error) => {
      console.error(error);

      document.getElementById('submitFeedback').style.display = 'inline';
      //document.getElementById('submitFeedback').innerText = 'An error occured, with error code: ' + error.code + '\n' + error.message;
      document.getElementById('submitFeedback').innerText = 'User denied transaction';
      console.log("deploy error code: " + error.code);
      console.log("deploy error message: " + error.message);
      process.exitCode = 1;
    })

    if(userSigned){

      // update the feedback text 
      document.getElementById('submitFeedback').innerText = 'Contract deployed';

      // prevent the Submit button to be clickable and functionable
      removeHover()
      document.getElementById('SubmitButton').disabled = true

    } else {
      // shot the feedback text 
      //document.getElementById('submitFeedback').style.display = 'inline';
      //document.getElementById('submitFeedback').innerText = 'User denied transaction';
    }
  }


  // LOAD the dynamic DropDown
  const [inputValue, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);

  // handle input change event
  //const handleInputChange = value => {
  const handleInputChange = (e) => {
    setValue(e);
  };
 
  // load options using API call
  const loadOptions = (inputValue) => {
    //return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-configuredNotDeployed`).then(res => res.json());   
    return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-configuredNotDeployed` + '?id=' + ((Moralis.User.current()).id)).then(res => res.json());     
  };


  // update Submit button
  const refButton = useRef(null);
  function removeHover(){
    const b1 = refButton.current;                 // corresponding DOM node
    b1.className = styles.submitButton_noHover;   // overwrite the style with no hover
  }


  // get summary for each collection
  const [data, setData] = useState([]);
  async function getCollectionsDetails() {
    const data = await fetch(`https://easylaunchnft.com/api/api-getCollectionsDetails` + '?id=' + ((Moralis.User.current()).id))
    .then(res => res.json())
    .then(json => setData(json));
    console.log(data);

    return data;
  };

  // Calling the function on component mount
  useEffect(() => {
    getCollectionsDetails();
  }, []);

  const [selectedValueTable, setSelectedValueTable] = useState(null);
  const handleChange = (e) => {

    if(e && e.name){ 
      // TODO:
      // enabled submit
      //  SubmitButton

      // name of the selected collection
      //console.log(e.name);
      // from the value figure out the index of the data-array
      for (let i = 0; i < data.length; i++){

        if(e.name == data[i].name.collectionName){

          // this is the relevant i
          setSelectedValueTable(data[i].name)

          break; // out of the for-loop
        }
      }
    } else {
      setSelectedValueTable(null)
      // TODO:
      // disable submit
    }
  }


  return (
    <> 
      <div className={styles.createTitle}> Deploy </div><br></br>

      <form id="formToSubmit" method="post" encType="multipart/form-data"  onSubmit={handleSubmit(onSubmit)}>              

        <div className={styles.gridContainer_1}> 
          <div className={styles.gridItem}> Select Collection:  </div> 
          <div className={styles.gridItem}>           {/*  was inside the Controller:  rules={{ required: true }} */}
          <Controller
            name="collectionNameController"
            control={control}
            
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
                
                onChange={handleChange}
                onInputChange={handleInputChange}
              />
            )}
          />
          </div>
          <div className={styles.gridItem}>
            {errors.collectionNameController && errors.collectionNameController.type === "required" && <span> required</span> }
          </div>

          {/*<input id="SubmitButton" className={styles.submitButton} type="submit" value="Submit" ref={refButton} ></input> */}

        </div>




        {/* insert summary table here */}
        {(selectedValueTable) ? (
        <Table_small item={selectedValueTable}/>
        ):(<></>)}





        <div className={styles.submitButtonOuter}> 
          <input id="SubmitButton" className={styles.submitButton} type="submit" value="Deploy" ref={refButton} ></input>
        </div>       

      </form>


      <p id="submitFeedback" hidden></p>


      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className={styles.postDeploymentDiv}>
        Already deployed contract, but it wasn&apos;t registered in the system?
        This could happen if it took too long for the contract to get deployed on the network.
        You can manually add the contract address after it got deployed.
        <br></br>

        
        <div className={styles.submitButtonOuter}> 
          <Link href="/create/updateSmartContractAddress" passHref>
            <input className={styles.postDeploymentLink} type="submit" value="add address"></input> 
          </Link>
        </div>
      
      </div>

    </>
  );
}

function wrapPaymentOption(option){
  if(option == "royalty") return "5% mint royalty";
  if(option == "paid") return option;
  return "1000 $BYTES";  // upfront
}

const StyledTableCell = styled(TableCell)({
 
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#4F575D",
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,

    backgroundColor: "#343a3f",
    color: "white",
  },
  /*
  backgroundColor: "#343a3f",
  color: "white",
  */
});

function Table_small(props) {
  const { item } = props;

  return (
    
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>

          <TableRow>
            <StyledTableCell>public collection name</StyledTableCell>
            <StyledTableCell>{item.collectionName}</StyledTableCell>
          </TableRow>

          <TableRow>
            <StyledTableCell>Symbol</StyledTableCell>
            <StyledTableCell>{item.tokenSymbol}</StyledTableCell>
          </TableRow>

          <TableRow>
            <StyledTableCell>Max Supply Public</StyledTableCell>
            <StyledTableCell>{item.maxSupply}</StyledTableCell>
          </TableRow>

          <TableRow>
            <StyledTableCell>Mint Price Public</StyledTableCell>
            <StyledTableCell>{item.mintPrice}</StyledTableCell>
          </TableRow>

          <TableRow>
            <StyledTableCell>Max to Mint Public</StyledTableCell>
            <StyledTableCell>{item.maxToMint}</StyledTableCell>
          </TableRow>

          <TableRow>
            <StyledTableCell>Dev Allocation</StyledTableCell>
            <StyledTableCell>{item.devAllocation}</StyledTableCell>
          </TableRow>
          
          <TableRow>
            <StyledTableCell>Presale</StyledTableCell>
            <StyledTableCell>{item.ALLOWLIST}</StyledTableCell>
          </TableRow>

          {
            (item.ALLOWLIST == "Yes" || item.ALLOWLIST == "YES")?(
              <> 
                <TableRow>
                  <StyledTableCell>Max Supply Presale</StyledTableCell>
                  <StyledTableCell>{item.maxSupplyAllowList}</StyledTableCell>
                </TableRow>
      
                <TableRow>
                  <StyledTableCell>Mint Price Presale</StyledTableCell>
                  <StyledTableCell>{item.mintPriceAllowList}</StyledTableCell>
                </TableRow>
      
                <TableRow>
                  <StyledTableCell>Max to Mint  Presale</StyledTableCell>
                  <StyledTableCell>{item.maxToMintAllowList}</StyledTableCell>
                </TableRow>
              </>
            ) : (<></>)
          }


          <TableRow>
            <StyledTableCell>Dutch Auction</StyledTableCell>
            <StyledTableCell>{item.DUTCHAUCTION}</StyledTableCell>
          </TableRow>

          {
            (item.DUTCHAUCTION == "Yes" || item.DUTCHAUCTION == "YES")?(
              <> 
                <TableRow>
                  <StyledTableCell>Max Supply DA</StyledTableCell>
                  <StyledTableCell>{item.maxSupplyDutchAuction}</StyledTableCell>
                </TableRow>
      
                <TableRow>
                  <StyledTableCell>Max to Mint DA</StyledTableCell>
                  <StyledTableCell>{item.maxToMintDutchAuction}</StyledTableCell>
                </TableRow>
      
                <TableRow>
                  <StyledTableCell>Start Mint Price DA</StyledTableCell>
                  <StyledTableCell>{item.mintPriceStartDutchAuction}</StyledTableCell>
                </TableRow>

                <TableRow>
                  <StyledTableCell>End Mint Price DA</StyledTableCell>
                  <StyledTableCell>{item.mintPriceEndDutchAuction}</StyledTableCell>
                </TableRow>
      
                <TableRow>
                  <StyledTableCell>Price Interval DA</StyledTableCell>
                  <StyledTableCell>{item.priceIntervalDutchAuction}</StyledTableCell>
                </TableRow>
      
                <TableRow>
                  <StyledTableCell>Duration of DA</StyledTableCell>
                  <StyledTableCell>{item.durationDutchAuction}</StyledTableCell>
                </TableRow>
              </>
            ) : (<></>)
          }


          <TableRow>
            <StyledTableCell>Description</StyledTableCell>
            <StyledTableCell>{item.Description}</StyledTableCell>
          </TableRow>

          <TableRow>
            <StyledTableCell>deployment option</StyledTableCell>
            <StyledTableCell>{wrapPaymentOption(item.paymentOption)}</StyledTableCell>
          </TableRow>

        </TableHead>
      </Table>
    </TableContainer>

  )
}



export default Deploy