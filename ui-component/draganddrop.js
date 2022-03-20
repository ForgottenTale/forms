import { useDropzone } from 'react-dropzone'
import { useState} from 'react';
import styles from '../styles/draganddrop.module.css'
import { getIn } from 'formik';


export default function DragandDrop({ setFiles, files, accept, label, name,errors }) {

    const [limit, setLimit] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: accept,
        onDrop: (acceptedFiles) => {
            console.log(acceptedFiles)
            Object.assign(acceptedFiles[0], {
                URL: URL.createObjectURL(acceptedFiles[0]),
                mimeType:acceptedFiles[0].type
            })
            setFiles(name, acceptedFiles[0])
            setLimit(true)
        },
    })
   



    return (
        <div className={styles.draganddrop} style={isDragActive ? { outline: "1px blue solid" } : null}>
     
            <p className={styles.label}> {label}</p>
            <div {...getRootProps()} className={styles.draganddropContainer}>
                <input {...getInputProps()} />
        
               {limit? <p>{files[name].name}</p>:<p>Drop files here</p>}
                <div className="draganddrop_button">
                    <p>Select file</p>
                </div>
                
            </div>
            <p className={styles.errorMsg}>{getIn(errors, name) !== undefined ? getIn(errors, name) : ""}</p>
        </div>
    )
}
