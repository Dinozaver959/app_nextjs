import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme, useMediaQuery } from '@material-ui/core';
import logo2_white_thick_B88_stick from '../../public/Logo/Logo_svg/logo2_white_thick_B88_stick.svg';


const style = {
    logoContainer: `flex items-center cursor-pointer`,
    logoText: ` ml-[0.8rem] mr-[0.6rem] font-semibold text-2xl`
}

function LoginButton() {
    
    const theme = useTheme();
    const is_md_up = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <>
            <Link href="/" passHref>        
                <div className={style.logoContainer}>
                    { is_md_up ? (

                        <>
                            <div className={style.logoText}>EasyLaunchNFT</div>  
                            <Image src={logo2_white_thick_B88_stick} alt="" width="42" height="32"></Image>
                        </>
                    ) : (

                        <> 
                            {/**  
                            <Icon sx={{ backgroundColor: "blue", color: "rgba(230, 255, 110, 0.9)", fill: "yellow" }} fill={'red'} ><Image src={logoIcon} alt=""></Image> </Icon>
                            */}
                            
                            <Image src={logo2_white_thick_B88_stick} alt="" width="42" height="32"></Image>
                        </>
                    )}
                </div>        
            </Link >
        </> 
    )
}

export default LoginButton
