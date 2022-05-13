import Authenticate from '../../components/Authenticate';
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import ConfigureSmartContract_ from "../../components/ConfigureSmartContract";

export default function ConfigureSmartContract() {
  return (
    <>
        <Authenticate>
          <CreateHeader />

          <CreateContainer> 
            <ConfigureSmartContract_ />
          </CreateContainer>
        </Authenticate>
    </>
  )
}