import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


export default function RadioButton({ title = "default", size = "24", placement = "right", color = "black" }) {
    return (
        <React.Fragment>


            <RadioGroup name="use-radio-group" defaultValue="first">
                <FormControlLabel value="first" label="First" control={<Radio />} />
                <FormControlLabel value="second" label="Second" control={<Radio />} />
            </RadioGroup>


            {/* 
            <Tooltip title={title} placement={placement}>
                <IconButton size="small">
                    <IconContext.Provider value={{  size: size, color: color }} >
                        <AiOutlineInfoCircle />  
                    </IconContext.Provider>
                </IconButton>
            </Tooltip>
            */}


        </React.Fragment>
    );
}

