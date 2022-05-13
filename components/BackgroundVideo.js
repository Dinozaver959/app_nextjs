import React, { useRef }  from 'react';
import styles from '../styles/CreateContainer.module.scss';
import ActivityDetector from 'react-activity-detector';

import { useMediaQuery } from '@material-ui/core';
import { createTheme  } from '@mui/material/styles';


function BackgroundVideo() {

    const theme = createTheme({
        breakpoints: {
        values: {
            xs: 0,
            xxs: 450,
            sm: 600,
            sm2: 660,
            smd: 740,
            md: 900,
            lg: 1200,
            xl: 1536,
            xxl: 1921,
        },
        },
    });
    const is_sm2_up = useMediaQuery(theme.breakpoints.up('sm2'));
    const is_xxl_up = useMediaQuery(theme.breakpoints.up('xxl'));

    const refVideo = useRef(null);

    const onActive = () => {
        refVideo.current.play();
    }

    return (
        <> 
            {is_xxl_up ? (
                <>
                    <ActivityDetector enabled={true} onActive={onActive}/>

                    <video ref={refVideo} className={styles.background_video} autoPlay loop muted playsInline poster="/Background/background_4k_frame0.jpg">
                        <source src="/Background/background_4k_video.mp4" type="video/mp4" />
                    </video>
                </>
            ) : (
                <>
                    {is_sm2_up ? (      // add also similar for screens larger than 1920x1080 - we will show a different background
                        <>
                            <ActivityDetector enabled={true} onActive={onActive}/>

                            <video ref={refVideo} className={styles.background_video} autoPlay loop muted playsInline poster="/Background/background_frame0.jpg">
                                <source src="/Background/background_video.mp4" type="video/mp4" />
                            </video>
                        </>
                    ) : (
                        <></>
                    ) }
                </> 
            )}
            
        </>
    );
}

export default BackgroundVideo;