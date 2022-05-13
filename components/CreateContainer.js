import React from 'react'
import styles from "../styles/CreateContainer.module.scss"

function CreateContainer({ children }) {
  return (
    <div className={styles.Container}>      
      {/* 
      <div className={styles.ContainerInner}>
      */}

      {children}

      {/* 
      </div>
      */} 
    </div>

    /*
      <main className={styles.Container}>       
        {children}
      </main>
    */
  )
}

export default CreateContainer