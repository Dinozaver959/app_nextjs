import Login from "../../components/Login";
import { useMoralis } from "react-moralis";
import Header from "../../components/Header";
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import Interact_ from "../../components/Interact";

export default function Interact() {
  const {isAuthenticated, logout} = useMoralis();
  return (

    <>
        
      <Header />
      {
        isAuthenticated ? (
            <>
                <CreateHeader />

                <CreateContainer> 
                  <Interact_ />
                </CreateContainer>


            </>
        ) : (
          <Login />
        )
      }
    </>
  )
}
