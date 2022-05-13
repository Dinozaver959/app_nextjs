import Authenticate from '../components/Authenticate';
import CreateContainer from "../components/CreateContainer";
import Dashboard_ from "../components/Dashboard";

export default function Dashboard() {
  return (
    <>
        <Authenticate>
          <CreateContainer> 
            <Dashboard_ />
          </CreateContainer>
        </Authenticate>
    </>
  )
}