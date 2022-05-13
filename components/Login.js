import styles from "../styles/Login.module.scss";
import Image from "next/image";
import icon from "../components/images/metamask.webp"; 
import {useMoralis} from "react-moralis";

function Login() {
    const {authenticate, authError, account} = useMoralis();     // add: web3 - read on it
    return (
        <div className={styles.login_container}>
            <div className={styles.login_card}>

                <Image src={icon} alt="" /> {/** width={50} height={50} */}

                <div className={styles.sign_in_container}>
                    <button onClick={authenticate}>Login with Moralis </button>
                    {
                        authError && (
                            <p className={styles.error}>
                                {authError.name}
                                {authError.message}
                            </p>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Login