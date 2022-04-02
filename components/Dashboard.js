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

    //console.log(data);

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
      console.log("attribute_i: " + attributes[i])
    }
    console.log("str: " + str);
    return str;
  }

  
  // Calling the function on component mount
  useEffect(() => {
    // fetchInventory();
    getCollectionsDetails();
  }, []);


  return (
    <> 
      <div> Dashboard </div><br></br>



      {  
        (data && data[0]) ? (
          <>
            <div className="container">
              <table>
                <thead>
                <tr>
                  <th className={styles.headerElement}>collection name</th>
                  <th>description</th>

                  <th className={styles.headerElement}>max supply</th>
                  <th className={styles.headerElement}>mint price</th>
                  <th className={styles.headerElement}>max to mint</th>
                  <th className={styles.headerElement}>token name</th>
                  <th className={styles.headerElement}>token symbol</th>

                  <th className={styles.headerElement}>prereveal link</th>
                  <th className={styles.headerElement}>contract address</th>


                  <th className={styles.headerElement}>Revealed</th>
                  <th className={styles.headerElement}>attributes</th>

                </tr>
                </thead>

                <tbody>
                  {
                    data.map((item) => (
                      <tr key={item.id} className={styles.itemElement}>
                        <td className={styles.itemElement}>{item.name.collectionName}</td>
                        <td className={styles.itemElement}>{item.name.Description}</td>

                        <td className={styles.itemElement}>{item.name.maxSupply}</td>
                        <td className={styles.itemElement}>{item.name.mintPrice}</td>
                        <td className={styles.itemElement}>{item.name.maxToMint}</td>
                        <td className={styles.itemElement}>{item.name.tokenName}</td>
                        <td className={styles.itemElement}>{item.name.tokenSymbol}</td>
                        
                        <td className={styles.itemElement}><Link href={item.name.prerevealImgUrl}> link </Link></td>

                        <td className={styles.itemElement}>
                          {  
                            item.name.contractAddress ? (
                              <>
                                <Link href={wrapContractAddressWithScanner(item.name.contractAddress)}  target="_blank" rel="noopener noreferrer"> contract </Link>
                              </>
                            ) : ("")           
                          } 
                        </td>

                        <td className={styles.itemElement}>{wrapReveal(item.name.Revealed)}</td>


                        <td className={styles.itemElement}>
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
        ) : (<>you haven't created a collection yet. <Link href="/create/uploadimages"> Get started now </Link></>)           
      } 
    </>
  );
}

export default Dashboard