import { useState, useEffect } from "react";
import useToken from "../context/hook-refresh";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../context/authcontext";


interface discussion {
    name: string
    id: number
}

export default function Messagerie() {

    const {refresh} = useToken()
    const {user} = useAuth()
    const [liste, setliste] = useState<discussion[]>([])
    const [loading, setLoading] = useState(false)

    const user_id = user?.id


    

    async function Recup_conversation() {
        if (!user_id) return

        try {
            let response = await fetch(`http://localhost:8000/chat/liste_discussion/${user_id}`, {
                method: 'GET',
                headers: {'content-type': 'application/json'},
                credentials:'include'
            })

            if (response.status === 401) {
                refresh()
                const isrefresh = await refresh()

                if (isrefresh) {
                    response = await fetch(`http://localhost:8000/chat/liste_discussion/${user_id}`, {
                    method: 'GET',
                    headers: {'content-type': 'application/json'},
                    credentials:'include'
                    })
                }
            }
            if (response.ok) {
                const data = await response.json()
                setliste(data)
            }
        } catch(error) {
            console.log('error :', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=> {
        Recup_conversation()
    }, [user_id])

    if (loading) return <p>chargement ...</p>

    return(
        <Box>
            <Typography></Typography>
            {liste ? (
                liste.map((char, index)=> (
                    <li key={index}>
                        {char.name}
                        {char.id}
                    </li>
                ))
            ) : (
                <Typography>
                    pas de conversation en cours
                </Typography>
            )}
        </Box>
    )
}

