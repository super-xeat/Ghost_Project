import React, { useState } from "react";
import { ChangeEvent } from "react";
import { FormEvent } from "react";

interface StyleConfig {
    fontsize: number,
    color: string,
    isbold: boolean
}

export default function Defi() {

    const [style, setstyle] = useState<StyleConfig>({
        fontsize: 0,
        color: "",
        isbold: false
    })

    function handlechange(e: React.ChangeEvent<HTMLInputElement>) {
        const newcolor = e.target.value as StyleConfig['color']
        setstyle({...style, color: newcolor})
    }

    function handlechange2(e: React.ChangeEvent<HTMLInputElement>) {
        const newfont = Number(e.target.value) as StyleConfig['fontsize']
        setstyle({...style, fontsize: newfont})
    }
    

    return(
        <div>
            
            <input value={style.color} onChange={handlechange}/>
            <input value={style.fontsize} onChange={handlechange2}/>
        
            <p style={{ 
                color: style.color, 
                fontSize: `${style.fontsize}px`, // Ne pas oublier le "px" !
                fontWeight: style.isbold ? "bold" : "normal" 
            }}>il etait une fois</p>
        </div>
    )
}