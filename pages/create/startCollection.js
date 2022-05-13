import Authenticate from '../../components/Authenticate';
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import StartCollection_ from "../../components/StartCollection";

export default function Uploadimages() {
  return (
    <>
      <Authenticate>
        <CreateHeader />

        <CreateContainer> 
          <StartCollection_ />
        </CreateContainer>
      </Authenticate>
    </>
  )
}