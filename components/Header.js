import React from 'react'
import Link from "next/link";
import Image from "next/image";
import {AiOutlineSearch} from "react-icons/ai";
import {FaDiscord, FaTwitter} from "react-icons/fa"
import logo from "../components/images/Moralis-Favicon.svg";
import { useMoralis } from 'react-moralis';

import SwitchNetworkButton from '../components/SwitchNetworkButton_4';

const style = {
    wrapper: `bg-[#04111d] w-screen px-[1.2rem] py-[0.8rem] flex `,
    logoContainer: `flex items-center cursor-pointer`,
    logoText: ` ml-[0.8rem] text-white font-semibold text-2xl`,
    searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#4c505c]`,
    searchIcon: `text-[#8a939b] mx-3 font-bold text-lg`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
    headerItems: ` flex items-center justify-center mr-0 ml-auto`,
    headerItem: `text-white px-4 font-bold text-[#c8cacd] hover:text-white cursor-pointer`,
    headerIcon: `text-[#8a939b] text-3xl font-black px-4 hover:text-white cursor-pointer`,
}


function Header() {
    const {isAuthenticated, logout, authenticate} = useMoralis(); 
  return (
    <div className={style.wrapper}>

        <Link href="/">
        
            <div className={style.logoContainer}>
                {/*<Image src={logo} height={50} width={50} alt="" /> */}
                <div className={style.logoText}>EasyLaunchNFT</div>
            </div>
        
        </Link >

{/*    
        <div className={style.searchBar}>
            <div className={style.searchIcon}>
                <AiOutlineSearch />
            </div> 
            <input
                className={style.searchInput}
                placeholder="Search items, collections, and acccounts"
            />
        </div>
*/}

        <div className={style.headerItems}>
            <Link href="/UpcomingCollections">
                <div className={style.headerItem}> Upcoming Collections </div>
            </Link >
            <Link href="/create/dashboard"> 
                <div className={style.headerItem}> Create </div>
            </Link>
            <div className={style.headerIcon}><FaDiscord/></div>
            <div className={style.headerIcon}><FaTwitter/></div>

            <SwitchNetworkButton/>

            {
                isAuthenticated && (
                    <button onClick={logout}>
                        <div className={style.headerItem}>
                            Disconnect
                        </div>
                    </button>
                )
            }
            { 
                !isAuthenticated && (
                    <button onClick={authenticate}>
                        <div className={style.headerItem}>
                            Connect
                        </div>
                    </button>
                )            
            }
        </div>

    </div>
  )
}

export default Header