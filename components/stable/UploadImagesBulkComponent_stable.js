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
    
        const onBeforeUpload = (event) => {
            event.formData.append("UserAccount", UserAccount)
            event.formData.append("CollectionName", collectionName)
        }

        const onUpload = (event) => {
            document.getElementById('submitFeedback').style.display = 'inline';
            document.getElementById('submitFeedback').innerText = 'Files uploaded'
        }

        const url = "https://easylaunchnft.com/serverUploadImages/bulkCollection"



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

                <FileUpload className={className} onBeforeUpload={onBeforeUpload} onUpload={onUpload} disabled={disabled} name="demo[]" url={url} accept="image/*" multiple maxFileSize="6500000000" />     


                <p id="submitFeedback" hidden></p>
               
            </>
        );
    }
}

export default UploadImagesBulk

