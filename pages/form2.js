
import styles from '../styles/Form.module.css';
import React, { useState } from 'react';

export default function form2() {

    const [count, setCount] = useState(0);

    return (

        <div className={styles.body}>
            <div className={styles.info}>
                <h3 className={styles.title}>WIE ILS 2022 - IEEE Kerala Section</h3>
                <p className={styles.sub}>REGISTRATION FORM</p>

            </div>
            <div className={styles.container}>
                <div className={styles.overflow}>

                    <div className={styles.inputs} style={{ transform: `translateX(${count * 1080 * -1}px)` }}>

                        <div className={styles.inputContainer}>
                            <p>1. Enter your Name</p>
                            <input className={styles.input} />
                        </div>
                        <div className={styles.inputContainer}>
                            <p>2. Enter your email</p>
                            <input className={styles.input} />
                        </div>
                        <div className={styles.inputContainer}>
                            <p>3. Enter your phone</p>
                            <input className={styles.input} />
                        </div>
                    </div>
                </div>

                <div className={styles.buttons} >
                    <div>
                        <button className={styles.button} onClick={() => {
                            if (count > 0) {
                                setCount(count - 1)
                            }
                        }}>Back</button>
                    </div>
                    <button className={styles.button} onClick={() => {
                        if (count < 2) {
                            setCount(count + 1)
                        }
                    }}>Next</button>
                </div>
            </div>
        </div>
    )

}