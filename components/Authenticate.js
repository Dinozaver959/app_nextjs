import Login from "./Login";
import { useMoralis } from "react-moralis";

const Layout = ({children}) => {
    const {isAuthenticated} = useMoralis();
    return (
        <> 
            {
                isAuthenticated ? (
                    <>
                        {children} 

                    </>
                ) : (
                    <Login />
                )
                }
        </>
    );
}

export default Layout;