import Login from "../components/Login";
import { useMoralis } from "react-moralis";
import Header from "../components/Header";
import CreateHeader from "../components/CreateHeader";
import CreateContainer from "../components/CreateContainer";
import SwitchNetworkButton from '../components/SwitchNetworkButton_4';

export default function Create() {
  const {isAuthenticated, logout} = useMoralis();
  return (

    <>
         
      <Header />
      {
        isAuthenticated ? (
            <>
                <CreateHeader />

                <CreateContainer> 
                  <SwitchNetworkButton/>
                </CreateContainer> 



            </>
        ) : (
          <Login />
        )
      }
    </>
  )
}
