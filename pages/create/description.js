import Login from "../../components/Login";
import { useMoralis } from "react-moralis";
import Header from "../../components/Header";
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import Description_ from "../../components/Description";

export default function AddDescription() {
  const {isAuthenticated, logout} = useMoralis();
  return (

    <>
        
      <Header />
      {
        isAuthenticated ? (
            <>
                <CreateHeader />

                <CreateContainer> 
                  <Description_ />
                </CreateContainer>

            </>
        ) : (
          <Login />
        )
      }
    </>
  )
}
