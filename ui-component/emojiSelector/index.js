import styles from './styles.module.css';

export default function EmojiSelector({onClick,errors,value}){

    return(
    <div className={styles.EmojiSelector}>
        <p>
            How did you feel about the event ?
        </p>
        <div className={styles.emojiContainer}>

              <div onClick={()=>onClick("Excellent")} className={styles.emoji}>
                <div style={{width:"100%"}}>
                <input type="checkbox" defaultChecked={value==="Excellent"?true:false}/>
                </div>
                <img src="./in-love.png"/>
                <p>Excellent</p>
              </div>

              <div onClick={()=>onClick("Good")} className={styles.emoji}>
                <div style={{width:"100%"}}>
                <input type="checkbox" defaultChecked={value==="Good"?true:false}/>
                </div>
                <img src="./smiling.png"/>
                <p>Good</p>
              </div>

              <div onClick={()=>onClick("Fair")} className={styles.emoji}>
                <div style={{width:"100%"}}>
                <input type="checkbox" defaultChecked={value==="Fair"?true:false}/>
                </div>
                <img src="./smile.png"/>
                <p>Fair</p>
              </div>

              <div onClick={()=>onClick("Poor")} className={styles.emoji}>
                <div style={{width:"100%"}}>
                <input type="checkbox" defaultChecked={value==="Poor"?true:false}/>
                </div>
                <img src="./confused.png"/>
                <p>Poor</p>
              </div>

        </div>
<p style={{color:"red",fontSize:"12px"}}>{errors}</p>
    </div>
    )

}