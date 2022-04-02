
/*

import fs from 'fs'
import path from 'path'
import Login from "../../components/Login";
import { useMoralis } from "react-moralis";
import Header from "../../components/Header";
import CreateHeader from "../../components/CreateHeader";

const createsDirectory = path.join(process.cwd(), 'pages', 'create')

export default function Create({ createData }) {
    const {isAuthenticated, logout} = useMoralis();
    return (

        <>        
        <Header />      
            {
                isAuthenticated ? (
                    <>
                        <CreateHeader />
                        <p> 

                            you are logged in at /create/UploadImages

                            <br/>
                            
                            <button onClick={logout}>sign Out</button>
                            
                        </p>
                    </>
                ) : (
                    <Login />
                )
            }
        </>
    )
}

export async function getStaticPaths() {
    // Return a list of possible value for create
    const fileNames = fs.readdirSync(createsDirectory);

    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       create: 'UploadImages'
    //     }
    //   },
    //   {
    //     params: {
    //       create: 'UploadMetadata'
    //     }
    //   }
    // ]
    return fileNames.map(fileName => {
        return {
            params: {
                create: fileName
            },
            fallback: false
        }
    })
}
  
 export async function getStaticProps({ params }) {
    // Fetch necessary data for the blog post using params.create
    const createData = getPostData(params.create)
  return {
    props: {
        createData
    }
  }
}

// put this in lib/create.js
//  export function getPostData(create) {}


*/

import React from 'react'

function _create() {
  return (
    <div>[_create]</div>
  )
}

export default _create