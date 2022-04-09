import Login from "../../components/Login";
import { useMoralis } from "react-moralis";
import Header from "../../components/Header";
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import UploadMetadata_ from "../../components/UploadMetadata";

export default function Uploadmetadata() {
  const {isAuthenticated, logout} = useMoralis();
  return (

    <>
         
      <Header />
      
 
      {
        isAuthenticated ? (

            <>
                <CreateHeader />

                <CreateContainer> 
                  <UploadMetadata_ />
                </CreateContainer>

            </>
        ) : (
          <Login />
        )
      }

       

    </>
  )
}
