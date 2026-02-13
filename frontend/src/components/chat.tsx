import React, { useState } from "react";
import { useAuth } from "../context/authcontext";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";


export default function ChatRoom() {

    const {user, sendmessage, message } = useAuth()
    const [input, setinput] = useState('')
    const {id} = useParams<{id: string}>()

    
    const handlesubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const destinataire_id = id ? parseInt(id, 10) : null;
    
        if (destinataire_id) {
            sendmessage({
            action: 'message',
            destinataire_id: destinataire_id,
            texte: input
        })
        }
        setinput('')
    }
    
    return(
        <Box>
            <ul>
                {message.map((char, index)=> (
                <li key={index}>
                    {char.sender_name} : {char.texte}
                </li>
            ))}
            </ul>
            <form onSubmit={handlesubmit}>
                <input onChange={(e)=>setinput(e.target.value)} value={input}/>
                <button type="submit">envoyer</button>
            </form>
        </Box>
    )
}