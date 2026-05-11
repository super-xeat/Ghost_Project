import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";


interface Recuperation {
    id1: number
    id2: number
    name: string
}

export default function Recup_conv({id1, name, id2}: Recuperation) {

    const [trouver, settrouver] = useState(false)
    const [discussionID, setdiscussionID] = useState('')

    // trouver discussion_id avec id de l'user
    async function Recup_conv(id1: number, id2: number) {
        
        try {
            const response = await fetch(`http://localhost:8000/api/chat/trouver_discussion/${id1}/${id2}/`, {
                method: 'GET',
                credentials: 'include'
            })
    
            if (response.status === 200) {
                const data = await response.json()
                console.log('data :', data)
                settrouver(true)
                setdiscussionID(data.id)
            }
        } catch(error) {
            console.error('error', error)
        }
    }

    useEffect(()=> {
        Recup_conv(id1, id2)
        settrouver(false)
        setdiscussionID('')
    }, [id2, id1])

    console.log('trouver :', trouver)
    
    return(
        <Box>
            {trouver ? (
                <Link to={`/chatroom1/discussion/${discussionID}`}>
                    continuer conversation avec {name}
                </Link>
            ) : (
                <Link to={`/chatroom1/profile/${id2}`}>
                    commencer conversation avec {name}
                </Link>
            )}
        </Box>
    )
}