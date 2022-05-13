import Authenticate from '../../components/Authenticate';
import CreateHeader from "../../components/CreateHeader";
import CreateContainer from "../../components/CreateContainer";
import AddSmartContractAddress_ from "../../components/AddSmartContractAddress";

export default function Uploadimages() {
  return (
    <>
      <Authenticate>
        <CreateHeader />

        <CreateContainer> 
          <AddSmartContractAddress_ />
        </CreateContainer>
      </Authenticate>
    </>
  )
}