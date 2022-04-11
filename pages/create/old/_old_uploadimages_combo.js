import Login from "../../../components/Login";
import { useMoralis } from "react-moralis";
import Header from "../../../components/Header";
import CreateHeader from "../../../components/CreateHeader";
import CreateContainer from "../../../components/CreateContainer";
import _old_UploadImages_ from "../../../components/old/_old_UploadImages_combo";

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
                  <_old_UploadImages_ />
                </CreateContainer>

            </>
        ) : (
          <Login />
        )
      }
    </>
  )
}
