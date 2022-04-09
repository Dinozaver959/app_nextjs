import Login from "../../components/Login";
import { useMoralis } from "react-moralis";
import Header from "../../components/Header";
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import StartCollection_ from "../../components/StartCollection";

export default function Uploadimages() {
  const {isAuthenticated, logout} = useMoralis();
  return (

    <>
        
      <Header />
      {
        isAuthenticated ? (
            <>
                <CreateHeader />

                <CreateContainer> 
                  <StartCollection_ />
                </CreateContainer>

            </>
        ) : (
          <Login />
        )
      }
    </>
  )
}
