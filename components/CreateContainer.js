import React from 'react'
import styles from "../styles/CreateContainer.module.css"

function CreateContainer({ children }) {
  return (
    <div className={styles.Container}>       
        {children}
    </div>
  )
}

export default CreateContainer