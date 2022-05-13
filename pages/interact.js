import Authenticate from '../components/Authenticate';
import CreateContainer from "../components/CreateContainer";
import Interact_ from "../components/Interact";

export default function Interact() {
  return (
    <>
      <Authenticate>
        <CreateContainer> 
          <Interact_ />
        </CreateContainer>
      </Authenticate>
    </>
  )
}