import Login from "../components/Login";
import { useMoralis } from "react-moralis";
import Header from "../components/Header";

export default function Test() {
  const {isAuthenticated, logout} = useMoralis();
  return (
    <div>

        <Header />


      {
        isAuthenticated ? (
          <p> 
            
            you are logged in at the Test page
            
            <button onClick={logout}>sign Out</button>
            
          </p>
        ) : (
          <Login />
        )
      }

       

    </div>
  )
}
