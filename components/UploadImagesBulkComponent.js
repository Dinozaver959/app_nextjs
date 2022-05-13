import React from 'react';
import {FileUpload} from 'primereact/fileupload';

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";


// two different approaches to style fileUploadComponent - 
// 1. with .scss file - need the extra wrapper - also problem with bg color of btn dont know why
// 2. with styled-jsx/css - css.resolve (contained completely within this file)
// import styles from "../styles/UploadImageBulkComponent.module.scss";
import css from 'styled-jsx/css';

class UploadImagesBulk extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          isDisabled: false
        }
    }

    enableComponents() {
        this.setState({
          isDisabled: false
        });
    }
    
    render() { 

        const collectionName = this.props.collectionName;
        const UserAccount = this.props.UserAccount;  
        const disabled = this.props.disabled; 
        const name = this.props.name;
        const multiple = this.props.multiple;
        const url = this.props.url;
        const accept = this.props.accept;
        const nextLinkID = this.props.nextLinkID;
        var accept_ForTest = accept;
        if(accept_ForTest == "image/*") accept_ForTest = "jpg,jpeg,png,gif";
        const maxFileSize = this.props.maxFileSize;
        
    
        const onBeforeUpload = (event) => {
            event.formData.append("UserAccount", UserAccount)
            event.formData.append("CollectionName", collectionName)

            
            // "jpg,jpeg,png,gif"     // accept="image/*"
        }

        const onSelect = (event) => {

            // hide previous error messages
            ClearWrongFileTypeError();

            for (let i = 0; i < event.files.length; i++){

                //console.log(event.files[0].name)
                //console.log("accept: " + accept);
                if (! accept_ForTest.includes(event.files[0].name.split(".").at(-1)))
                {
                    // give a message + 
                    WrongFileTypeError();

                    // remove file from selection
                    this.upload.clear();
                }
            }
        }

        function WrongFileTypeError(){
            document.getElementById('submitFeedback').style.display = 'inline';
            document.getElementById('submitFeedback').innerText = 'Wrong file type, allowed extensions: ' + accept;
        }

        function ClearWrongFileTypeError(){
            document.getElementById('submitFeedback').style.display = 'none';
        }


        const onUpload = (event) => {
            document.getElementById('submitFeedback').style.display = 'inline';
            document.getElementById('submitFeedback').innerText = 'File(s) uploaded';

            // move to the next tab
            //window.location.replace(nextLink);
            if(nextLinkID){
                document.getElementById(nextLinkID).click();
            }
        }


        const {className, styles} = css.resolve`
 
            .p-fileupload > :global(.p-fileupload-buttonbar) {
                background-color: #343a3f;
                border-style: solid;
                border-color: #ffffff;
            }

            .p-fileupload  :global(.p-button) {
                background-color: #1868b7;
                border-style: solid;
                border-color: #ffffff;

            }
            .p-fileupload  :global(.p-button):hover {
                background-color: #095095;
                border-style: solid;
                border-color: #ffffff;
            }

            .p-fileupload > :global(.p-fileupload-content) {
                background-color: #343a3f;
                border-style: solid;
                border-color: #ffffff;
                color: #ffffff;
            }
        `;



        return (
            <>
                {/*  antoher way of doing it - all within this file
                <div className={styles.fileUploadWrapper}> 
                  </div>
                */}

                <styles>{styles}</styles>
                
                {/*
                <FileUpload className={className} onBeforeUpload={onBeforeUpload} onUpload={onUpload} disabled={disabled} name="demo[]" url={url} accept="image/*" multiple maxFileSize="6500000000" />     
                */}

                {
                    (multiple) ? 
                        <FileUpload className={className} ref={(el) => this.upload = el} onBeforeUpload={onBeforeUpload} onSelect={onSelect} onUpload={onUpload} disabled={disabled} name={name} multiple url={url} accept={accept} maxFileSize={maxFileSize} />     
                    :   
                        <FileUpload className={className} ref={(el) => this.upload = el} onBeforeUpload={onBeforeUpload} onSelect={onSelect} onUpload={onUpload} disabled={disabled} name={name} url={url} accept={accept} maxFileSize={maxFileSize} />     
                }

                <p id="submitFeedback" hidden></p>
               
            </>
        );
    }
}

export default UploadImagesBulk

