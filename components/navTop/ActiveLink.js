import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

function CorePath (path){
    return path.split("/")[1];
}

const ActiveLink = ({ href, children }) => {
    const router = useRouter()

    let className = children.props.className || ''
    if (router.pathname === href 
    || CorePath(router.pathname) === CorePath(href))    // this part ensures that we get subpaths under create
    {      
        //className = `${className} text-blue-500`      // decent option - colors text in blue

        className = `${className} border-b-2 border-blue-500`
    }

    return <Link href={href}>{React.cloneElement(children, { className })}</Link>
}

export default ActiveLink


export const ActiveLinkCreate = ({ href, children }) => {
    const router = useRouter()

    let className = children.props.className || ''
    if (router.pathname === href)    // this part ensures that we get subpaths under create
    {      
        //className = `${className} text-blue-500`      // decent option - colors text in blue

        className = `${className} border-b-2 border-white-500`
    }

    return <Link href={href}>{React.cloneElement(children, { className })}</Link>
}