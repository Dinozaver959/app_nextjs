import '../styles/globals.scss';
import Layout from '../components/Layout';
import {MoralisProvider} from "react-moralis";

import Head from 'next/head'

function MyApp({ Component, pageProps }) {

  return <MoralisProvider 
          appId="mCUbGlwPmuitdPxm5K3mtjhoGL1ENmyMIgffO5U7" 
          serverUrl="https://p2r5bzcvt2aq.usemoralis.com:2053/server">

            <Head>
              {/* <link rel="shortcut icon" href="/favicon.ico" /> 
              <link rel="shortcut icon" href="/public/Logo/Logo_svg/Logo2_white_thick_B88_stick.svg" />
              
              <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
              <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
              <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
              <link rel="manifest" href="/site.webmanifest"/>
              <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
              */}
            </Head>
            <Layout> 
              <Component {...pageProps} />
            </Layout>
        </MoralisProvider>
}

export default MyApp
