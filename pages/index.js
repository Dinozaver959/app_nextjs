import Login from "../components/Login";
import { useMoralis } from "react-moralis";
import Header from "../components/Header";
import Hero from "../components/Hero";
//import Head from "next/head";

export default function Home() {
  const {isAuthenticated, logout} = useMoralis();
  return (

    <>

        
      <Header />

      <Hero />
      
      <p> 
        
      </p>
        

    </>
  )
}
