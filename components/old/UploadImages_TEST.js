import React, {Component } from 'react';
import axios from 'axios';

class UploadImageForm extends Component {

  state = {
    collectionName : null,
    selectedFile : null,
    multiFiles : null
  }

  CollectionNameSet = event => {
      this.setState({
      collectionName : event.target.value   
    })

  }

  fileSelectedHandler = event => {
    this.setState({
      selectedFile : event.target.files[0]   
    })
  }

  multiFileSelectedHandler = event => {
    this.setState({
      multiFiles: event.target.files
    })
  }

  fileUploadHandler = () => {

    const fd = new FormData();
    fd.append('CollectionName', this.state.collectionName);
    fd.append('uploadPreRevealImage', this.state.selectedFile, this.state.selectedFile.name);
    // --------------------------------


    //this.state.multiFiles.forEach(file => {
    //  formData.append("uploadMultipleImages", file, file.name)
    //})

    fd.append('uploadMultipleImages', this.state.multiFiles)


    // --------------------------------
    axios.post('https://easylaunchnft.com/api/api-uploadImages', fd)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log('error: ' + error)
      })
      ;
  }


  render() {
    return (
      <>
        <div> UploadImages</div>
  
        CollectionName: <input type="text" onChange={this.CollectionNameSet}></input>
        <input type="file" onChange={this.fileSelectedHandler}></input>
        <input type="file" onChange={this.multiFileSelectedHandler} multiple="multiple"></input> 

        <button onClick={this.fileUploadHandler}>Upload</button>

        


        {/*
        <form id="formToSubmit" method="post" action="/api/api-uploadImages" encType="multipart/form-data"  onSubmit={handleSubmit(onSubmit)}>              

          <br></br>
          CollectionName: <input name="CollectionName" id="CollectionName" type="text" defaultValue="Sample Collection Name" minLength="4" maxLength="24" ></input>
          <br></br>

          PreReveal image: <input name="uploadPreRevealImage" id="uploadPreRevealImage" type="file"></input>  
          <br></br>

          Collection's images: <input name="uploadMultipleImages" id="uploadMultipleImages" type="file" multiple="multiple"></input>      
          <br></br>
          <br></br>

          <input id="CreateImagesSubmitButton" className={styles.submitButton} type="submit" value="Submit"></input>
        </form>
        */}
      </>
    )
  }
}

export default UploadImageForm