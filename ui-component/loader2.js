import styles from '../styles/Loader.module.css'
export default function Loader({ msg }) {

    return (

        <div className={styles.loader}>
            <div className={styles.snippet} data-title=".dotfalling">
                <div className={styles.stage}>
                    <div className={styles.dotfalling}></div>
                </div>
            </div>

            <p className={styles.loaderMsg}>{msg}</p>
        </div>

    )
}