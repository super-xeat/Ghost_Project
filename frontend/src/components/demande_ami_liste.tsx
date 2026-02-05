import { useState } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../context/authcontext";

interface Demande {
    demande: string
}
interface Liste {
    liste: Demande
}

export default function Demande_Amis() {

    const [liste, setliste] = useState<Liste[]>([])
    const {user} = useAuth()
    
    const user_id = user?.id

    const Liste_ami = async() => {
        if (!user_id) return
        try {
            const response = await fetch(`http://localhost:8000/chat/liste_demande/${user_id}`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json()
            setliste(data)
        } catch(error) {
            console.error()
        }
    }
    return(
        <Box>
            {liste && liste.map((char, index)=>(
                <li key={index}>
                    {char}
                </li>
            ))}
        </Box>
    )
}