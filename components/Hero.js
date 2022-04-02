import React from 'react';
import Link from 'next/link'
import Image from "next/image";
import cardImage from "../components/images/card-image.png";
import jollyIcon from "../components/images/jolly-icon.png";

const style = {
    wrapper: `relative`,
    container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s250')] before:bg-cover before:bg-center before:opacity-30 before:blur`,
    contentWrapper: `flex h-screen relative justify-center flex-wrap items-center`,
    copyContainer: `w-1/2`,
    title: `relative text-white text-[46px] font-semibold`,
    description: `text-[#8a939b] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
    ctaContainer: `flex`,
    accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
    button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
  }

function Hero() {
  return (
    <div className={style.wrapper}>
        <div className={style.container}>
            <div className={style.contentWrapper}>
                <div className={style.copyContainer}>
                    <div> 
                       
                        <div className={style.title}>
                            Create extraordinary NFTs with ease
                        </div>
                    
                        <div className={style.description}>
                            EasyLaunchNFT empowers eveyone to launch their own NFT collection with only a few clicks.
                        </div>
                        
                        <div className={style.ctaContainer}>
                            <Link href="/UpcomingCollections">
                                <button className={style.accentedButton}>Explore</button>
                            </Link>
                            <Link href="/create">
                                <button className={style.button}>Create</button>
                            </Link>
                        </div>
                    </div>

                    { /*
                    <div className={style.cardContainer}>
                        <img 
                            className="rounded-t-lg"
                            src={cardImage}
                            alt=""
                        />
                   

                        <div className={style.infoContainer}>
                            <img 
                                className="h-[2.5rem] rounded-full"
                                src={jollyIcon}
                                alt=""

                            />

                            <div className={style.author}>
                                <div className={style.name}>Jolly</div>
                                <a>hola-kanola</a>
                            </div>

                        </div>
                    </div>
                    */}


                    {/*
                    <div className={style.cardContainer}>
                        <img
                        className="rounded-t-lg"
                        src="https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s550"
                        alt=""
                        />
                        <div className={style.infoContainer}>
                            <img
                                className="h-[2.25rem] rounded-full"
                                src="https://lh3.googleusercontent.com/qQj55gGIWmT1EnMmGQBNUpIaj0qTyg4YZSQ2ymJVvwr_mXXjuFiHJG9d3MRgj5DVgyLa69u8Tq9ijSm_stsph8YmIJlJQ1e7n6xj=s64"
                                alt=""
                                width="auto"
                                max-height="100%"
                            />
                            <div className={style.author}>
                                <div className={style.name}>Jolly</div>
                                <a
                                className="text-[#1868b7]"
                                href="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/2324922113504035910649522729980423429926362207300810036887725141691069366277"
                                >
                                hola-kanola
                                </a>
                            </div>
                        </div>
                    </div>
                    */}


                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero