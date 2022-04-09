import React, { useState, useEffect } from 'react'
import styles from "../styles/CreateContent.module.css";
import Moralis from 'moralis';
import Link from 'next/link';
import style from '../styles/Dashboard.module.css';

function  Dashboard() {

  const [data, setData] = useState([]);


  // load options using API call
  async function getCollectionsDetails() {
    //return fetch(`https://easylaunchnft.com/api/api-getCollectionNames-configuredNotDeployed`).then(res => res.json());   
    const data = await fetch(`https://easylaunchnft.com/api/api-getCollectionsDetails` + '?id=' + ((Moralis.User.current()).id))
      .then(res => res.json())
      .then(json => setData(json));

    console.log(data);

    return data;
  };

  function wrapContractAddressWithScanner(contractAddress){

    // later adjust so that we add the correct network scanner

    if(contractAddress){
      return("https://mumbai.polygonscan.com/address/" + contractAddress);
    } else {
      return "";
    }
  }

  function wrapReveal(revealed){
    return (revealed) ? "yes" : "no";
  }

  function wrapAttributes(attributes){

    var str = "";
    for(let i = 0; i < attributes.length; i++){
      str += attributes[i] + " ";
      //console.log("attribute_i: " + attributes[i])
    }
    //console.log("str: " + str);
    return str;
  }

  
  // Calling the function on component mount
  useEffect(() => {
    // fetchInventory();
    getCollectionsDetails();
  }, []);


  return (
    <> 
      <div className={styles.createTitle}> Dashboard </div><br></br>



      {  
        (data && data[0]) ? (
          <>
            <div className="container">
              <table>
                <thead>
                <tr>
                  <th className={style.headerElement}>collection name</th>
                  <th className={style.headerElement}>description</th>

                  <th className={style.headerElement}>max supply</th>
                  <th className={style.headerElement}>mint price</th>
                  <th className={style.headerElement}>max to mint</th>
                  <th className={style.headerElement}>token name</th>
                  <th className={style.headerElement}>token symbol</th>

                  <th className={style.headerElement}>prereveal link</th>
                  <th className={style.headerElement}>contract address</th>

                  <th className={style.headerElement}>Revealed</th>
                  <th className={style.headerElement}>attributes</th>

                </tr>
                </thead>

                <tbody>
                  {
                    data.map((item) => (
                      <tr key={item.id} className={style.itemElement}>
                        <td className={style.itemElement}>{item.name.collectionName}</td>
                        <td className={style.itemElement}>{item.name.Description}</td>
                        <td className={style.itemElement}>{item.name.maxSupply}</td>
                        <td className={style.itemElement}>{item.name.mintPrice}</td>
                        <td className={style.itemElement}>{item.name.maxToMint}</td>
                        <td className={style.itemElement}>{item.name.tokenName}</td>
                        <td className={style.itemElement}>{item.name.tokenSymbol}</td>
                        
                        <td className={style.itemElement}>
                          {  
                            item.name.prerevealImgUrl ? (
                              <>
                                <Link href={item.name.prerevealImgUrl}> link </Link>
                              </>
                            ) : ("")           
                          } 
                        </td>

                        <td className={style.itemElement}>
                          {  
                            item.name.contractAddress ? (
                              <>
                                <Link href={wrapContractAddressWithScanner(item.name.contractAddress)}  target="_blank" rel="noopener noreferrer"> contract </Link>
                              </>
                            ) : ("")           
                          } 
                        </td>

                        <td className={style.itemElement}>{wrapReveal(item.name.Revealed)}</td>


                        <td className={style.itemElement}>
                          {  
                            item.name.Attributes ? (
                              <>
                                {wrapAttributes(item.name.Attributes)} 
                              </>
                            ) : ("")           
                          } 
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </>
        ) : (<>you haven&apos;t created a collection yet. <Link href="/create/uploadimages"> Get started now </Link></>)           
      } 
    </>
  );
}

export default Dashboard