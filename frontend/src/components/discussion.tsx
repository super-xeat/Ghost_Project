import { useState, useEffect } from "react"
import { Box, List, ListItem } from "@mui/material"
import { useAuth } from "../context/authcontext"
import type { Message } from "../context/authcontext"


export default function Discussion() {

    const {user} = useAuth()
    const [liste, setliste] = useState<Message[]>([])

    const user_id = user?.id

    const Discussion = async(user_id: number) => {
      
        try {
            const response = await fetch(`http://localhost/api/chat/discussion/${user_id}/`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json()
            setliste(data)

        } catch(error) {
            console.log('error', error)
        }
    }

    useEffect(()=> {
        if (user && user_id) {
            Discussion(user_id)
        }
    }, [])

    return(
        <Box>
            <List>
                {liste && liste.map((char, index)=> (
                    <ListItem key={index}>
                        {char.sender_name} : {char.texte}
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}