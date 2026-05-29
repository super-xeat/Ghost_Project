import { useState, useEffect } from "react"
import { Box, List, ListItem } from "@mui/material"
import { useAuth } from "../context/authcontext"
import type { Message } from "../context/authcontext"
import useToken from "../context/hook-refresh"
import getcookie from "../context/csrf"



export default function Discussion() {

    const {user} = useAuth()
    const {refresh} = useToken()

    const [liste, setliste] = useState<Message[]>([])

    const user_id = user?.id

    const Discussion = async(user_id: number) => {
        const csrf = getcookie('csrftoken')
        console.log('csrf :', csrf)
        try {
            let response = await fetch(`http://localhost:8000/api/chat/discussion/${user_id}/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': csrf || '',
                }
            })
            if (response.ok) {
                const data = await response.json()
                setliste(data)
            }
            if (response.status === 401) {
                const token = await refresh()
                console.log('token refresh')
                if (token) {
                    response = await fetch(`http://localhost:8000/api/chat/discussion/${user_id}/`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                        'X-CSRFToken': csrf || '',
                    }
                    })
                    if (response.ok) {
                        const data = await response.json()
                        setliste(data)
                    }
                }
            }

        } catch(error) {
            console.log('error', error)
        }
    }

    useEffect(()=> {
        if (user && user_id) {
            Discussion(user_id)
        }
    }, [user])

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