import Authenticate from '../../components/Authenticate';
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import UploadImages_ from "../../components/UploadImages";

export default function Uploadimages() {
  return (
    <>
      <Authenticate>
        <CreateHeader />

        <CreateContainer> 
          <UploadImages_ />
        </CreateContainer>
      </Authenticate>
    </>
  )
}