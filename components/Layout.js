import Header from "./Header";
import Footer from "./Footer";
import BackgroundVideo from "./BackgroundVideo";
import styles from '../styles/CreateContainer.module.scss';

const Layout = ({children}) => {
    
    return (
        <> 
            <Header />

            <BackgroundVideo/>

            {/*<div className={styles.topSpacer}></div>*/}
            <main>
                {children}       
            </main>
            <Footer />    
        </>
    );
}

export default Layout;