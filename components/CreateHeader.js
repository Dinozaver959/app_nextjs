import React from 'react'
import Link from "next/link";
import styles from "../styles/CreateHeader.module.css";

const style = {
    outerContainer: `grid items-center justify-items-center h-40 bg-[#333333]`,
    wrapper: `bg-[#04111d] w-screen px-[1.2rem] py-[0.8rem] flex items-center`,
    logoContainer: `flex items-center cursor-pointer`,
    logoText: ` ml-[0.8rem] text-white font-semibold text-2xl`,
    searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#4c505c]`,
    searchIcon: `text-[#8a939b] mx-3 font-bold text-lg`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
    headerItems: ` flex items-center justify-end h-20`,
    headerItem: `text-white px-4 font-bold text-[#c8cacd] hover:text-white cursor-pointer`,
    headerIcon: `text-[#8a939b] text-3xl font-black px-4 hover:text-white cursor-pointer`,
}

function CreateHeader() {
  return (
    <div> 
        <div className={styles.wrapper}>
            <div className={styles.headerItems}> 

                <Link href="/create/dashboard" passHref> 
                    <div className={styles.headerItem}>
                        Dashboard
                    </div>
                </Link>

                {/** 
                <Link href="/create/_old_uploadimages_combo" passHref> 
                    <div className={styles.headerItem}>
                        Upload Images
                    </div>
                </Link>
                */}

                <Link href="/create/startCollection" passHref> 
                    <div className={styles.headerItem}>
                        Create
                    </div>
                </Link>

                <Link href="/create/description" passHref> 
                    <div className={styles.headerItem}>
                        Description
                    </div>
                </Link>

                <Link href="/create/prerevealImage" passHref> 
                    <div className={styles.headerItem}>
                        Prereveal Image
                    </div>
                </Link>

                <Link href="/create/uploadImages" passHref> 
                    <div className={styles.headerItem}>
                        Images  {/** Upload Images */}
                    </div>
                </Link>



                {/* <Link href="/api/api-getCollectionNames">  */}
                <Link href="/create/uploadmetadata" passHref> 
                    <div className={styles.headerItem}>
                        MetaData  {/** Upload MetaData */}
                    </div>
                </Link>

                <Link href="/create/configureSmartContract" passHref> 
                    <div className={styles.headerItem}>
                        Configure  {/** Configure smart contract */}
                    </div>
                </Link>

                <Link href="/create/deploy" passHref> 
                    <div className={styles.headerItem}>
                        Deploy
                    </div>
                </Link>

                <Link href="/create/interact" passHref> 
                    <div className={styles.headerItem}>
                        Interact
                    </div>
                </Link>
            </div>         
        </div>
    </div>
  )
}

export default CreateHeader