import React from 'react'
import styles from "../styles/CreateHeader.module.scss";
import { useMediaQuery } from '@material-ui/core';
import { createTheme } from '@mui/material/styles';
import {ActiveLinkCreate} from './navTop/ActiveLink'


function CreateHeader() {

    const theme = createTheme({
        breakpoints: {
          values: {
            xs: 0,
            xxs: 450,
            sm: 600,
            sm2: 670,
            smd: 740,
            md: 900,
            lg: 1200,
            xl: 1536,
          },
        },
      });


    const is_smd_up = useMediaQuery(theme.breakpoints.up('sm2'));


    return (
        <> 
        
            {is_smd_up ? (    
                <> 
                    <div className={styles.wrapper}>
                        <nav className={styles.headerItems}> 

                            {/* 
                            <Link href="/create/dashboard" passHref> 
                                <div className={styles.headerItem}>
                                    Dashboard
                                </div>
                            </Link>
                            */}

                            <ActiveLinkCreate href="/create/startCollection" passHref> 
                                <div className={styles.headerItem} id="startCollectionLink">
                                    Start
                                </div>
                            </ActiveLinkCreate>

                            <ActiveLinkCreate href="/create/description" passHref> 
                                <div className={styles.headerItem} id="descriptionLink">
                                    Description
                                </div>
                            </ActiveLinkCreate>

                            <ActiveLinkCreate href="/create/prerevealImage" passHref> 
                                <div className={styles.headerItem} id="prerevealImageLink">
                                    Prereveal Image
                                </div>
                            </ActiveLinkCreate>

                            <ActiveLinkCreate href="/create/uploadImages" passHref> 
                                <div className={styles.headerItem} id="uploadImagesLink">
                                    Images  {/** Upload Images */}
                                </div>
                            </ActiveLinkCreate>

                            {/* <Link href="/api/api-getCollectionNames">  */}
                            <ActiveLinkCreate href="/create/uploadmetadata" passHref> 
                                <div className={styles.headerItem} id="uploadmetadataLink">
                                    MetaData  {/** Upload MetaData */}
                                </div>
                            </ActiveLinkCreate>

                            <ActiveLinkCreate href="/create/configureSmartContract" passHref> 
                                <div className={styles.headerItem} id="configureSmartContractLink">
                                    Configure  {/** Configure smart contract */}
                                </div>
                            </ActiveLinkCreate>

                            <ActiveLinkCreate href="/create/deploy" passHref> 
                                <div className={styles.headerItem} id="deployLink">
                                    Deploy
                                </div>
                            </ActiveLinkCreate>

                            {/* 
                            <Link href="/create/interact" passHref> 
                                <div className={styles.headerItem}>
                                    Interact
                                </div>
                            </Link>
                            */}
                        </nav>         
                    </div>
                </>
            ) : ( 
                <> 
                    <div className={styles.wrapper}>
                        <nav className={styles.headerItems}> 

                            {/* 
                            <Link href="/create/dashboard" passHref> 
                                <div className={styles.headerItem}>
                                    Dashboard
                                </div>
                            </Link>
                            */}

                            <ActiveLinkCreate href="/create/startCollection" passHref> 
                                <div className={styles.headerItem} id="startCollectionLink">
                                    Start
                                </div>
                            </ActiveLinkCreate>

                            <ActiveLinkCreate href="/create/description" passHref> 
                                <div className={styles.headerItem} id="descriptionLink">
                                    Description
                                </div>
                            </ActiveLinkCreate>

                            <ActiveLinkCreate href="/create/prerevealImage" passHref> 
                                <div className={styles.headerItem} id="prerevealImageLink">
                                    Prereveal Image
                                </div>
                            </ActiveLinkCreate>
                        </nav> 


                    {/* 
                    </div>



                    <div className={styles.wrapper}>
                    */}


                        <nav className={styles.headerItems}> 
                            <ActiveLinkCreate href="/create/uploadImages" passHref> 
                                <div className={styles.headerItem} id="uploadImagesLink">
                                    Images  {/** Upload Images */}
                                </div>
                            </ActiveLinkCreate>

                            {/* <Link href="/api/api-getCollectionNames">  */}
                            <ActiveLinkCreate href="/create/uploadmetadata" passHref> 
                                <div className={styles.headerItem} id="uploadmetadataLink">
                                    MetaData  {/** Upload MetaData */}
                                </div>
                            </ActiveLinkCreate>

                            <ActiveLinkCreate href="/create/configureSmartContract" passHref> 
                                <div className={styles.headerItem} id="configureSmartContractLink">
                                    Configure  {/** Configure smart contract */}
                                </div>
                            </ActiveLinkCreate>

                            <ActiveLinkCreate href="/create/deploy" passHref> 
                                <div className={styles.headerItem} id="deployLink">
                                    Deploy
                                </div>
                            </ActiveLinkCreate>

                            {/* 
                            <Link href="/create/interact" passHref> 
                                <div className={styles.headerItem}>
                                    Interact
                                </div>
                            </Link>
                            */}
                        </nav>         
                    </div>
                </>
            )}
        </>
    )
}

export default CreateHeader