import Authenticate from '../../components/Authenticate';
import CreateContainer from "../../components/CreateContainer";
import UploadAllowListAddresses_ from "../../components/UploadAllowListAddresses";

export default function Uploadmetadata() {
  return (
    <>
      <Authenticate>
        <CreateContainer> 
          <UploadAllowListAddresses_ />
        </CreateContainer>
      </Authenticate>
    </>
  )
}