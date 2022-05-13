import Authenticate from '../../components/Authenticate';
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import Deploy_ from "../../components/Deploy";

export default function Deploy() {
  return (
    <>
      <Authenticate>
        <CreateHeader />

        <CreateContainer> 
          <Deploy_ />
        </CreateContainer>
      </Authenticate>
    </>
  )
}