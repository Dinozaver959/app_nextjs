import { useEffect, useState } from 'react';
import {FiSun} from "react-icons/fi"
import { IconContext } from "react-icons";


export default function SwitchThemeButton() {

    const [darkTheme, setDarkTheme] = useState(undefined);

    const handleToggle = (event) => {
        
        // disable toggle
        // setDarkTheme(!darkTheme);
    };

    useEffect(() => {

        // after first click
        if (darkTheme !== undefined) {

            // console.log("darkTheme is defined: " + darkTheme)

            if (darkTheme) {
                // Set value of  darkmode to dark
                document.documentElement.removeAttribute('data-theme');
                window.localStorage.setItem('theme', 'dark');
            } else {
                // Set value of  darkmode to light
               document.documentElement.setAttribute('data-theme', 'light');
                window.localStorage.setItem('theme', 'light');
            }
        }
        // first round (on a page)
        else {      

            // check localStorage if data-theme is defined -> then use the variable saved
            const persistedPreferenceMode = window.localStorage.getItem('theme');
            const hasPersistedPreference = typeof persistedPreferenceMode === 'string';
        
            if (hasPersistedPreference) {
              (persistedPreferenceMode == 'dark') ? setDarkTheme(true) : setDarkTheme(false);

              //console.log("darkTheme just SET: " + darkTheme)
            }
            else {
                const root = window.document.documentElement;
                const initialColorValue = root.style.getPropertyValue(
                    '--initial-color-mode'
                );
                // Set initial darkmode to light
                setDarkTheme(initialColorValue === 'dark');
            }   
        }
    }, [darkTheme]);

    /*
    useEffect(() => {
        const root = window.document.documentElement;
        const initialColorValue = root.style.getPropertyValue(
            '--initial-color-mode'
        );
        // Set initial darkmode to light
        setDarkTheme(initialColorValue === 'dark');
    }, []);
    */

  return (
    <>
        <div>
            {darkTheme !== undefined && (
                <>
                    <div onClick={handleToggle}>  
                        <IconContext.Provider
                            value={{ color: ( darkTheme ? 'white' : 'black'), size: '24px' }}
                        >
                            <FiSun/>
                        </IconContext.Provider>
                    </div>
                </>
            )}
        </div> 
    </>
  )
}
