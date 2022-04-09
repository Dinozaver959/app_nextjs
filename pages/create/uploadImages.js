import Login from "../../components/Login";
import { useMoralis } from "react-moralis";
import Header from "../../components/Header";
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import UploadImages_ from "../../components/UploadImages";

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
                  <UploadImages_ />
                </CreateContainer>

            </>
        ) : (
          <Login />
        )
      }
    </>
  )
}
