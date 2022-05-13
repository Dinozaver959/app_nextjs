import  React from 'react';
import Link from "next/link";
import Image from 'next/image';
import {FaDiscord, FaTwitter} from "react-icons/fa"
import styles from '../styles/Footer.module.scss';
import logo2_white_thick_B88_stick from '../public/Logo/Logo_svg/logo2_white_thick_B88_stick.svg';


const style = {
    wrapper: `w-screen px-[0.6rem] py-[0.4rem] flex `,
    logoContainer: `flex items-center cursor-pointer`,
    logoText: ` ml-[0.8rem] font-semibold text-2xl`,
    searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center rounded-[0.8rem]`,
    searchIcon: `mx-3 font-bold text-lg`,
    searchInput: `h-[2.6rem] w-full border-0 outline-0 ring-0 px-2 pl-0`,
    headerItems: ` flex items-center justify-center mr-0 ml-auto`,
    headerItem: `px-2 py-2 cursor-pointer`,
    headerIcon: `text-2xl px-2 py-2 cursor-pointer`,
    activeNav: "text-decoration-line: underline",
}


function Footer() {

    return (
        <>
            <footer>
                <div className={styles.footerContainer}>
                    <div className={styles.footerContainerUpper}>
                        

                        <div className={styles.footerContainerUpperLeft}>

                            {/* 
                            <IconContext.Provider
                            value={{  size: '24px' }}
                            >
                                <IoLogoWordpress />
                            </IconContext.Provider>
                            */}

                            <Image src={logo2_white_thick_B88_stick} alt="" width="42" height="32"></Image>

                        </div>

                        <div className={styles.footerContainerUpperRight}>
                            
                            
                            <div className={style.headerIcon}><FaDiscord/></div>

                            <div className={style.headerIcon}>
                                <Link href="https://twitter.com/EasyLaunchNFT" passHref> 
                                    <a target="_blank" rel="noopener noreferrer">
                                        <FaTwitter/>
                                    </a>  
                                </Link> 
                            </div>

                        </div>

                    </div>

                    <div className={styles.footerContainerLower}>
                        Copyright © 2022 EasyLaunchNFT. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer