import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../context/authcontext";
import type { UserType } from "../context/authcontext";
import { Link } from "react-router-dom";


export default function Profile() {

    const {user} = useAuth()
    const [liste, setliste] = useState<UserType[]>([])


    async function Profile_fetch(id: Number)  {
        if (!user) {
            console.log('user inconnu dans le composant profile')
            return
        }
        try {
            const response = await fetch(`http://localhost:8000/api/auth/profile/${id}`, {
                method: 'GET',
                credentials: 'include'
            })

            const data = await response.json()
            setliste(data)
        } catch(error) {
            console.error('erreur dans le composant profile', error)
        }
    }

    useEffect(()=> {
        if (user) {
            Profile_fetch(user.id)
        }
        
    }, [user])

    return(
        <Box>
            <Typography>{user?.name}</Typography>
            <Typography>Liste-amis</Typography>
            <Box>
                {liste && liste.map((char, index)=> (
                    <li key={index}>
                        <Link to={`/chatroom/${char.id}`}>
                        discuter avec {char.name}
                        </Link>
                    </li>
                ))}
            </Box>
        </Box>
    )
}