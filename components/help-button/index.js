import * as React from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { IconContext } from "react-icons";

export default function HelpButton({ title = "default", size = "24", placement = "right", color = "black" }) {
    return (
        <React.Fragment>
            <Tooltip title={title} placement={placement}>
                <IconButton size="small">
                    <IconContext.Provider value={{  size: size, color: color }} >
                        <AiOutlineInfoCircle />  
                    </IconContext.Provider>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}

