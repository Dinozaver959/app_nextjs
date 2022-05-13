import CreateContainer from "./CreateContainer";
import Moralis from 'moralis';
import Link from 'next/link';
import React, { useState, useEffect }  from 'react';
import { IconContext } from "react-icons";

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
import styles from "../styles/CreateContent.module.scss";


const StyledTableRow = styled(TableRow)({
  //'&:nth-of-type(odd)': {
  //  backgroundColor: "#343a3f",
  //  color: "white", // useless
  //},
  // hide last border
  //'&:last-child td, &:last-child th': {
  //  border: 0,
  //},
});

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

const StyledInnerTableCell = styled(TableCell)({
 
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#4F575D",
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,

    backgroundColor: "#4F575D",
    color: "white",
  },
  
 /*
  backgroundColor: "#343a3f",
  color: "white",
*/
  
});



export default function Dashboard() {

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        xxs: 450,
        sm: 600,
        sm2: 610,
        smd: 740,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });
  const is_smd_up = useMediaQuery(theme.breakpoints.up('sm2'));

  const [data, setData] = useState([]);

  // load options using API call
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

  return (
    <>
      <br></br>

      <CreateContainer>

        <br></br>

        {(data && data[0]) ? (
          <>
            {is_smd_up ? (   
              <Table_normal data={data} />
            ) : (
              <Table_small data={data} />
            )}
            
          </>
        ) : (
          <>
            you haven&apos;t created a collection yet. 

            <div className={styles.submitButtonOuter}> 
              <Link href="/create/startCollection" passHref>
                <input className={styles.submitButton} type="submit" value="Start Now" ></input>
              </Link>
            </div>
          </>
        )} 
        
      </CreateContainer>
    </>
  )
}


function GetScannerFromChainId(chainId){

  // "0x1"      - Ethereum Mainnet
  // "0x3"      - ropsten (ETH testnet)
  // "0x4"      - rinkeby (ETH testnet)    
  // "0x38"     - BSC
  // "0x61"     - BSC Tesnet
  // "0x89"     - Polygon
  // "0x13881"  - Mumbai
  // "0xA4B1"   - Arbitrum
  // "0xA"      - Optimism

  switch(chainId) {
    //case "0x1":
    case 1:
      return "https://etherscan.io/address/";

    //case "0x3":
    case 3:
      return "https://ropsten.etherscan.io/address/";

    //case "0x4":
    case 4:
      return "https://rinkeby.etherscan.io/address/";

    //case "0x38":
    case 56:
      return "https://bscscan.com/address/";

    //case "0x61":
    case 97:
      return "https://testnet.bscscan.com/address/";

    //case "0x89":
    case 137:
      return "https://polygonscan.com/address/";

    //case "0x13881":
    case 80001:
      return "https://mumbai.polygonscan.com/address/";

    default: // 0x1
    return "https://etherscan.io/address/";
  }
}

function GetChainNameFromChainId(chainId){

  // "0x1"      - Ethereum Mainnet
  // "0x3"      - ropsten (ETH testnet)
  // "0x4"      - rinkeby (ETH testnet)    
  // "0x38"     - BSC
  // "0x61"     - BSC Tesnet
  // "0x89"     - Polygon
  // "0x13881"  - Mumbai
  // "0xA4B1"   - Arbitrum
  // "0xA"      - Optimism

  switch(chainId) {
    //case "0x1":
    case 1:
      return "Ethereum Mainnet";

    //case "0x3":
    case 3:
      return "Ropsten";

    //case "0x4":
    case 4:
      return "Rinkeby";

    //case "0x38":
    case 56:
      return "BSC";

    //case "0x61":
    case 97:
      return "BSC Tesnet";

    //case "0x89":
    case 137:
      return "Polygon";

    //case "0x13881":
    case 80001:
      return "Mumbai";

    default: // 0x1
    return "unknown: " + chainId;
  }
}

function wrapContractAddressWithScanner(contractAddress, chainId){
  if(contractAddress && chainId){
    return(GetScannerFromChainId(chainId) + contractAddress);
  } else {
    return "";
  }
}

function wrapReveal(revealed){
  return (revealed) ? "yes" : "no";
}

function wrapPaymentOption(option){
  if(option == "royalty") return "5% mint royalty";
  if(option == "paid") return option;
  return "1000 $BYTES";  // upfront
}

function wrapchainId(chainId){
  if(chainId){
    return GetChainNameFromChainId(chainId);
  } else {
    return "";
  }
}

function Table_normal(props) {
  const { data } = props;

  return (
    <TableContainer component={Paper}>
    <Table aria-label="collapsible table">
      <TableHead>
        <StyledTableRow>
          <StyledTableCell />
          <StyledTableCell>local name</StyledTableCell>
          <StyledTableCell>Collection Name</StyledTableCell>
          <StyledTableCell>Symbol</StyledTableCell>
          <StyledTableCell>contract</StyledTableCell>
          <StyledTableCell>Revealed</StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <Row_normal key={item.id} item={item.name} />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  )
}

function Table_small(props) {
  const { data } = props;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell>local name</StyledTableCell>
            <StyledTableCell>Collection Name</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <Row_small key={item.id} item={item.name} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function Row_normal(props) {
  const { item } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <StyledTableRow sx={{ '& > *': { borderBottom: 'unset'} }}>

        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            <IconContext.Provider value={{ color: "white" }} >                {/*  specify the color for the arrow */}
              {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </IconContext.Provider>
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {item.collectionName}
        </StyledTableCell>
        <StyledTableCell>{item.tokenName}</StyledTableCell>
        <StyledTableCell>{item.tokenSymbol}</StyledTableCell>
        <StyledTableCell>
        {  
          (item.contractAddress && item.chainId) ? (
            <>
              <Link href={wrapContractAddressWithScanner(item.contractAddress, item.chainId)} passHref> 
                <a target="_blank" rel="noopener noreferrer">
                  link
                </a>   
              </Link>
            </>
          ) : ("")           
        } 
        </StyledTableCell>
        <StyledTableCell>{wrapReveal(item.Revealed)}</StyledTableCell>
      </StyledTableRow>

      
      <StyledTableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>            
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="details">

                {/* 
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>maxSupply</TableCell>
                    <TableCell align="right">mintPrice</TableCell>
                    <TableCell align="right">maxToMint</TableCell>
                    <TableCell align="right">Description</TableCell>
                    <TableCell align="right">prerevealImgUrl</TableCell>
                  </TableRow>
                </TableHead>


                <TableBody>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell component="th" scope="row">
                      {item.maxSupply}
                    </TableCell>
                    <TableCell align="right">{item.mintPrice}</TableCell>
                    <TableCell align="right">{item.maxToMint}</TableCell>
                    <TableCell align="right">{item.Description}</TableCell>
                    <TableCell align="right">{wrapReveal(item.Revealed)}</TableCell>
                  </TableRow>
                </TableBody>
                */}



                <TableBody>

                  {/* 
                  <StyledTableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>maxSupply</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.maxSupply}</StyledInnerTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>mintPrice</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.mintPrice}</StyledInnerTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>maxToMint</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.maxToMint}</StyledInnerTableCell>
                  </StyledTableRow>
                  */}



                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Max Supply Public</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.maxSupply}</StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Mint Price Public</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.mintPrice}</StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Max to Mint Public</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.maxToMint}</StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Dev Allocation</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.devAllocation}</StyledInnerTableCell>
                  </TableRow>
                  
                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Presale</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.ALLOWLIST}</StyledInnerTableCell>
                  </TableRow>

                  {
                    (item.ALLOWLIST == "Yes" || item.ALLOWLIST == "YES")?(
                      <> 
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Max Supply Presale</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.maxSupplyAllowList}</StyledInnerTableCell>
                        </TableRow>
              
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Mint Price Presale</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.mintPriceAllowList}</StyledInnerTableCell>
                        </TableRow>
              
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Max to Mint  Presale</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.maxToMintAllowList}</StyledInnerTableCell>
                        </TableRow>
                      </>
                    ) : (<></>)
                  }


                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Dutch Auction</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.DUTCHAUCTION}</StyledInnerTableCell>
                  </TableRow>

                  {
                    (item.DUTCHAUCTION == "Yes" || item.DUTCHAUCTION == "YES")?(
                      <> 
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Max Supply DA</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.maxSupplyDutchAuction}</StyledInnerTableCell>
                        </TableRow>
              
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Max to Mint DA</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.maxToMintDutchAuction}</StyledInnerTableCell>
                        </TableRow>
              
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Start Mint Price DA</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.mintPriceStartDutchAuction}</StyledInnerTableCell>
                        </TableRow>

                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>End Mint Price DA</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.mintPriceEndDutchAuction}</StyledInnerTableCell>
                        </TableRow>
              
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Price Interval DA</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.priceIntervalDutchAuction}</StyledInnerTableCell>
                        </TableRow>
              
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Duration of DA</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.durationDutchAuction}</StyledInnerTableCell>
                        </TableRow>
                      </>
                    ) : (<></>)
                  }


                  <StyledTableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Description</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.Description}</StyledInnerTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>prerevealImgUrl</StyledInnerTableCell>
                    <StyledInnerTableCell>{wrapReveal(item.Revealed)}</StyledInnerTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>chain</StyledInnerTableCell>
                    <StyledInnerTableCell>{wrapchainId(item.chainId)}</StyledInnerTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>fee</StyledInnerTableCell>
                    <StyledInnerTableCell>{wrapPaymentOption(item.paymentOption)}</StyledInnerTableCell>
                  </StyledTableRow>

                </TableBody>

              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>

    </React.Fragment>
  );
}

function Row_small(props) {
  const { item } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>

        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            <IconContext.Provider value={{ color: "white" }} >                {/*  specify the color for the arrow */}
              {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </IconContext.Provider>
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {item.collectionName}
        </StyledTableCell>
        <StyledTableCell>{item.tokenName}</StyledTableCell>
      </TableRow>

      
      <TableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>            
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="details">

                <TableBody>
                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Symbol</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.tokenSymbol}</StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Contract</StyledInnerTableCell>
                    <StyledInnerTableCell>
                      {  
                      (item.contractAddress && item.chainId) ? (
                        <>
                          <Link href={wrapContractAddressWithScanner(item.contractAddress, item.chainId)} passHref> 
                            <a target="_blank" rel="noopener noreferrer">
                              link
                            </a>   
                          </Link>
                        </>
                      ) : ("")           
                      }   
                    </StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Prereveal Image URL</StyledInnerTableCell>
                    <StyledInnerTableCell>{wrapReveal(item.Revealed)}</StyledInnerTableCell>
                  </TableRow>


                  {/*  
                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>maxSupply</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.maxSupply}</StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>mintPrice</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.mintPrice}</StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>maxToMint</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.maxToMint}</StyledInnerTableCell>
                  </TableRow>
                  */}




                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Max Supply Public</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.maxSupply}</StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Mint Price Public</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.mintPrice}</StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Max to Mint Public</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.maxToMint}</StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Dev Allocation</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.devAllocation}</StyledInnerTableCell>
                  </TableRow>
                  
                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Presale</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.ALLOWLIST}</StyledInnerTableCell>
                  </TableRow>

                  {
                    (item.ALLOWLIST == "Yes" || item.ALLOWLIST == "YES")?(
                      <> 
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Max Supply Presale</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.maxSupplyAllowList}</StyledInnerTableCell>
                        </TableRow>
              
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Mint Price Presale</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.mintPriceAllowList}</StyledInnerTableCell>
                        </TableRow>
              
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Max to Mint  Presale</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.maxToMintAllowList}</StyledInnerTableCell>
                        </TableRow>
                      </>
                    ) : (<></>)
                  }


                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Dutch Auction</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.DUTCHAUCTION}</StyledInnerTableCell>
                  </TableRow>

                  {
                    (item.DUTCHAUCTION == "Yes" || item.DUTCHAUCTION == "YES")?(
                      <> 
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Max Supply DA</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.maxSupplyDutchAuction}</StyledInnerTableCell>
                        </TableRow>
              
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Max to Mint DA</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.maxToMintDutchAuction}</StyledInnerTableCell>
                        </TableRow>
              
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Start Mint Price DA</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.mintPriceStartDutchAuction}</StyledInnerTableCell>
                        </TableRow>

                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>End Mint Price DA</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.mintPriceEndDutchAuction}</StyledInnerTableCell>
                        </TableRow>
              
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Price Interval DA</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.priceIntervalDutchAuction}</StyledInnerTableCell>
                        </TableRow>
              
                        <TableRow>
                          <StyledInnerTableCell></StyledInnerTableCell>
                          <StyledInnerTableCell>Duration of DA</StyledInnerTableCell>
                          <StyledInnerTableCell>{item.durationDutchAuction}</StyledInnerTableCell>
                        </TableRow>
                      </>
                    ) : (<></>)
                  }



                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Description</StyledInnerTableCell>
                    <StyledInnerTableCell>{item.Description}</StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>prerevealImgUrl</StyledInnerTableCell>
                    <StyledInnerTableCell>{wrapReveal(item.Revealed)}</StyledInnerTableCell>
                  </TableRow>

                  <StyledTableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>chain</StyledInnerTableCell>
                    <StyledInnerTableCell>{wrapchainId(item.chainId)}</StyledInnerTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>fee</StyledInnerTableCell>
                    <StyledInnerTableCell>{wrapPaymentOption(item.paymentOption)}</StyledInnerTableCell>
                  </StyledTableRow>

                </TableBody>

              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </TableRow>

    </React.Fragment>
  );
}

