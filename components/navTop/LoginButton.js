import React from 'react';
import { useTheme, useMediaQuery } from '@material-ui/core';
import {AiOutlineWallet} from "react-icons/ai";
import {useMoralis} from "react-moralis";

const style = {
    headerItem: `px-2 py-2 cursor-pointer`,
    headerIcon: `text-2xl px-2 py-2 cursor-pointer`,
}

function Logo() {

    const {isAuthenticated, logout, authenticate} = useMoralis();      // add: web3 - read on it
    
    const theme = useTheme();
    const is_md_up = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <>
            { is_md_up ? ( //smaller              
                <div className={style.headerItem} onClick={isAuthenticated ? logout : authenticate}>
                    {isAuthenticated ? <>Disconnect</> : <>Connect</>}
                </div>
            ) : (   // bigger
                <div className={style.headerIcon} onClick={isAuthenticated ? logout : authenticate}>
                    <AiOutlineWallet />
                </div>
            )}
        </> 
    )
}

export default Logo