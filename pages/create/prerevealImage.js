import Login from "../../components/Login";
import { useMoralis } from "react-moralis";
import Header from "../../components/Header";
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import PrerevealImage_ from "../../components/PrerevealImage";

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
                  <PrerevealImage_ />
                </CreateContainer>

            </>
        ) : (
          <Login />
        )
      }
    </>
  )
}
