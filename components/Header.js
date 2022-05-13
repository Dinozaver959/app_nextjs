import Link from "next/link";
import {FaDiscord, FaTwitter} from "react-icons/fa"
import {MdMenu, MdClose} from "react-icons/md";
import LoginButton from './navTop/LoginButton';
import Logo from './navTop/Logo';
import SwitchThemeButton from './navTop/SwitchThemeButton';
import SwitchNetworkButton from './navTop/SwitchNetworkButton';

import  React, {useState} from 'react';
import { useTheme, useMediaQuery } from '@material-ui/core';

import styleMobileMenuOverLay from '../styles/MobileMenuOverlay.module.scss';

import ActiveLink from './navTop/ActiveLink'

/*
const style = {
    wrapper: `bg-[#04111d] w-screen px-[1.2rem] py-[0.8rem] flex `,
    logoContainer: `flex items-center cursor-pointer`,
    logoText: ` ml-[0.8rem] text-white font-semibold text-2xl`,
    searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#4c505c]`,
    searchIcon: `text-[#8a939b] mx-3 font-bold text-lg`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
    headerItems: ` flex items-center justify-center mr-0 ml-auto`,
    headerItem: `text-white px-4 py-2 font-bold text-[#c8cacd] hover:text-white cursor-pointer`,
    headerIcon: `text-[#8a939b] text-3xl font-black px-4 hover:text-white cursor-pointer`,
}
*/

const style = {
    outerWrapper: `sticky top-0 z-50`, // `fixed w-full z-10 top-0 left-0`,
    wrapper: `px-[0.6rem] py-[0.4rem] flex`,   // w-screen - was causing an issue where the nav bar was getting too long (width of the screen - NOT the browser window)
    logoContainer: `flex items-center cursor-pointer`,
    logoText: ` ml-[0.8rem] font-semibold text-2xl`,
    //searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center rounded-[0.8rem]`,
    //searchIcon: `mx-3 font-bold text-lg`,
    //searchInput: `h-[2.6rem] w-full border-0 outline-0 ring-0 px-2 pl-0`,
    headerItems: `flex items-center justify-center mr-0 ml-auto`,
    headerItem: `px-2 py-2 cursor-pointer`,
    headerIcon: `text-2xl px-2 py-2 cursor-pointer`,
    activeNav: "text-decoration-line: underline",
}


function Header() {

    const theme = useTheme();
    const is_sm_up = useMediaQuery(theme.breakpoints.up('sm'));
    //const is_sm_up = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    //const is_md_up = useMediaQuery(theme.breakpoints.up('md'));

    const [mobileMenuActive, setMobileMenuActive] = useState(false);

    function ShowMobileMenu() {
        
        console.log("stopped in ShowMobileMenu");
        console.log("mobileMenuActive: " + mobileMenuActive)

        if(!mobileMenuActive){  // show menu
            document.getElementById("myNav").style.width = "100%";
        } else {    // hide menu
            document.getElementById("myNav").style.width = "0%";
            setMobileMenuActive(!mobileMenuActive);
        }
    }

    return (
        <>
            {/*<div className={style.outerWrapper}>  */}
            <nav className={style.wrapper}>

                <Logo />

                <div className={style.headerItems}>    


                    {is_sm_up ? (    
                        <> 
                            {/*
                            <ActiveLink href="/UpcomingCollections" passHref >
                                <div className={style.headerItem}> 
                                    Upcoming 
                                </div>   
                            </ActiveLink>
                            */}
                            
                            
                            <ActiveLink href="/platformGuide" passHref >
                                <div className={style.headerItem}> 
                                    Guide 
                                </div>   
                            </ActiveLink>

                            <ActiveLink href="/dashboard" passHref >
                                <div className={style.headerItem}> 
                                    Dashboard 
                                </div>   
                            </ActiveLink>

                            <ActiveLink href="/create/startCollection" passHref >
                                <div className={style.headerItem}> 
                                    Create 
                                </div>   
                            </ActiveLink>                            

                            <ActiveLink href="/interact" passHref >
                                <div className={style.headerItem}> 
                                    Interact 
                                </div>   
                            </ActiveLink>

                            <div className={style.headerIcon}>
                                <FaDiscord/>
                            </div>

                            <div className={style.headerIcon}>
                                <Link href="https://twitter.com/EasyLaunchNFT" passHref> 
                                    <a target="_blank" rel="noopener noreferrer">
                                        <FaTwitter/>
                                    </a>  
                                </Link> 
                            </div>
                            
                            {/* 
                            <div className={style.headerIcon}>
                                <SwitchThemeButton/>
                            </div>
                            */}

                            <div className={style.headerIcon}>
                                <SwitchNetworkButton/>
                            </div>

                            <LoginButton />
                        </>
                    ) : ( 
                        <> 
                            <div className={style.headerIcon}><FaDiscord/></div>

                            <div className={style.headerIcon}>
                                <Link href="https://twitter.com/EasyLaunchNFT" passHref> 
                                    <a target="_blank" rel="noopener noreferrer">
                                        <FaTwitter/>
                                    </a>  
                                </Link> 
                            </div>
                            
                            {/* 
                            <div className={style.headerIcon}>
                                <SwitchThemeButton/>
                            </div>
                            */}
                            
                            <div className={style.headerIcon}>
                                <SwitchNetworkButton/>
                            </div>
                            
                            <LoginButton />
                            
                            <div className={style.headerIcon} onClick={function() { setMobileMenuActive(!mobileMenuActive); ShowMobileMenu(mobileMenuActive); }}>
                            { mobileMenuActive ? 
                                <MdMenu />  
                                :
                                <MdMenu />
                            }             {/*<MdClose />  */}
                            </div>
                        </>
                    )}
                </div>
            </nav>
            {/*</div>*/}

            <div id="myNav" className={styleMobileMenuOverLay.overlay}>
                <a className={styleMobileMenuOverLay.closebtn} onClick={() => ShowMobileMenu(mobileMenuActive)}>&times;</a> {/**/}
                <div className={styleMobileMenuOverLay.overlay_content}>

                    {/*
                    <Link href="/UpcomingCollections" passHref>
                        <div className={style.headerItem}> Upcoming </div>
                    </Link >
                    */}
                    <Link href="/platformGuide" passHref>
                        <div className={style.headerItem} onClick={() => ShowMobileMenu(mobileMenuActive)}> Guide </div>
                    </Link >
                    <Link href="/dashboard" passHref>
                        <div className={style.headerItem} onClick={() => ShowMobileMenu(mobileMenuActive)}> Dashboard </div>
                    </Link >
                    <Link href="/create/startCollection" passHref> 
                        <div className={style.headerItem} onClick={() => ShowMobileMenu(mobileMenuActive)}> Create </div>
                    </Link>   
                    <Link href="/interact" passHref>
                        <div className={style.headerItem} onClick={() => ShowMobileMenu(mobileMenuActive)}> Interact </div>
                    </Link >
                </div>
            </div>
        </>
    )
}

export default Header