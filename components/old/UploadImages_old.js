import React from 'react'
import styles from "../styles/CreateContent.module.css";
import {useMoralis} from 'react-moralis'

function UploadImages() {
  const {account} = useMoralis();

  function SubmitForm(){
    //alert("ha");


    var form = document.querySelector('form');
    var formData = new FormData(form);
    //data.append('user', 'person');
    //data.append('pwd', 'password');
    //data.append('organization', 'place');
    //data.append('requiredkey', 'key');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/api-uploadImages', true);
    xhr.onload = function () {
        // do something to response
        console.log(this.responseText);
    };
    xhr.send(formData);


  }

  return (
    <> 

      <div> UploadImages</div>
      
      <form id="formToSubmit" method="post" encType="multipart/form-data">         {/** action="/api/api-uploadImages"  */}     

        Collection Name: <input name="CollectionName" id="CollectionName" type="text" defaultValue="SampleName" minLength="4" maxLength="24" ></input>
        <input hidden name="UserAccount" id="UserAccount" type="text" value={account}></input>
        <br></br>

        TEMP (delete later) - account: {account}
        <br></br>

        PreReveal image: <input name="uploadPreRevealImage" id="uploadPreRevealImage" type="file"></input>  
        <br></br>

        Collection&apos;s images: <input name="uploadMultipleImages" id="uploadMultipleImages" type="file" multiple="multiple"></input>      
        <br></br>

        Collection&apos;s description: <input name="CollectionDescription" id="CollectionDescription" type="text" width="200" height="80" defaultValue="Sample description" minLength="4" maxLength="240" ></input>
        <br></br>
        <br></br>

        <input className={styles.submitButton} type="submit" value="Submit" onClick={SubmitForm}></input>
      </form>

      <p id="warningCollectionWithThisNameAlreadyExist" hidden></p>
    </>
  )
}

export default UploadImages