import React from 'react';
import {FileUpload} from 'primereact/fileupload';

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"

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

        const url_ = "https://easylaunchnft.com/serverUploadImages/bulkCollection"

        return (
            <>
                <FileUpload onBeforeUpload={onBeforeUpload} onUpload={onUpload} disabled={disabled} name="demo[]" url={url_} accept="image/*" multiple maxFileSize="6500000000" />     

                <p id="submitFeedback" hidden></p>
            </>
        );
    }
}

export default UploadImagesBulk

