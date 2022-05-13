import Authenticate from '../../components/Authenticate';
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import Description_ from "../../components/Description";

export default function AddDescription() {
  return (
    <>
      <Authenticate>
        <CreateHeader />

        <CreateContainer> 
          <Description_ />
        </CreateContainer>
      </Authenticate>
    </>
  )
}