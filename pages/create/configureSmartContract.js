import Login from "../../components/Login";
import { useMoralis } from "react-moralis";
import Header from "../../components/Header";
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import ConfigureSmartContract_ from "../../components/ConfigureSmartContract";

export default function configureSmartContract() {
  const {isAuthenticated, logout} = useMoralis();
  return (

    <>
        
      <Header />
      {
        isAuthenticated ? (
            <>
                <CreateHeader />

                <CreateContainer> 
                  <ConfigureSmartContract_ />
                </CreateContainer>

            </>
        ) : (
          <Login />
        )
      }
    </>
  )
}