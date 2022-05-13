import React from 'react';
import Link from 'next/link'

import CreateContainer from "../components/CreateContainer";
import styles from '../styles/CreateContainer.module.scss';

const style = {
    wrapper: `relative`,
    container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s250')] before:bg-cover before:bg-center before:opacity-30 before:blur`,
    
    contentWrapper: `flex relative justify-center flex-wrap items-center`,
    copyContainer: `w-1/2 md:w-1/3`, // `w-1/3`,
    title: `relative text-[36px] font-semibold`,
    description: `text-[#8a939b] container-[400px] text-xl mt-[0.8rem] mb-[2.5rem]`,
    ctaContainer: `flex`,
    accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
    button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
  }

function Hero() {
  return (

    <> 

        <CreateContainer>
            <div className={styles.contentWrapper}>
                <div className={style.copyContainer}>
                    <div> 
                    
                        <div className={style.title}>
                            Instant smart contract that you control
                        </div>

                        <div className={style.description}>
                            Be in control of your collection<br></br>
                            No more waiting for developers<br></br>
                            100% Free to deploy your collection
                        </div> 

                        <div className={style.description}>
                            EasyLaunchNFT empowers eveyone to launch their own NFT collection
                            with only a few clicks.      
                        </div>
            
                        <div className={style.ctaContainer}>
                            <Link href="/create/startCollection" passHref>
                                <button className={style.accentedButton}>Start now</button>
                            </Link>
                        </div>
                    </div>
                    
                </div>
            </div>
        </CreateContainer>

    {/*     
        <CreateContainer>

            <div className={styles.contentWrapper}>
                <div className={style.copyContainer}>

                </div>
            </div>


        </CreateContainer>
   */}     

    
    </>
  )
}

export default Hero