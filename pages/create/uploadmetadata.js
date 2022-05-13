import Authenticate from '../../components/Authenticate';
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import UploadMetadata_ from "../../components/UploadMetadata";

export default function Uploadmetadata() {
  return (
    <>
      <Authenticate>
        <CreateHeader />

        <CreateContainer> 
          <UploadMetadata_ />
        </CreateContainer>
      </Authenticate>
    </>
  )
}