import Authenticate from '../../components/Authenticate';
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import PrerevealImage_ from "../../components/PrerevealImage";

export default function Uploadimages() {
  return (
    <>
      <Authenticate>
        <CreateHeader />

        <CreateContainer> 
          <PrerevealImage_ />
        </CreateContainer>
      </Authenticate>
    </>
  )
}