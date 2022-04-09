import Login from "../../components/Login";
import { useMoralis } from "react-moralis";
import Header from "../../components/Header";
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import Dashboard_ from "../../components/Dashboard";

export default function Dashboard() {
  const {isAuthenticated, logout} = useMoralis();
  return (

    <>
        
      <Header />
      {
        isAuthenticated ? (
            <>
              <CreateHeader />

              <CreateContainer> 
                <Dashboard_ />
              </CreateContainer>

            </>
        ) : (
          <Login />
        )
      }
    </>
  )
}
