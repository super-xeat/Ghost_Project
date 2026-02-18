import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useAuth } from "../context/authcontext";
import type { UserType } from "../context/authcontext";
import { Link } from "react-router-dom";


export default function Profile() {

    const {user} = useAuth()
    const [liste, setliste] = useState<UserType[]>([])

    async function Profile_fetch(id: number)  {
        if (!user) {
            console.log('user inconnu dans le composant profile')
            return
        }
        try {
            const response = await fetch(`http://localhost:8000/api/auth/profile/${id}/`, {
                method: 'GET',
                credentials: 'include'
            })

            const data = await response.json()
            console.log('data :', data)
            setliste(data.liste_amis)
        
        } catch(error) {
            console.error('erreur dans le composant profile', error)
        }
    }

    const supprimer = async( id2: number) => {
        if (!user?.id) return
        try {
            const response = await fetch(`http://localhost:8000/api/chat/supprimer_ami/${user.id}/${id2}/`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (response.ok) {
                Profile_fetch(user.id)
                console.log('ami supprimé de la liste')
            }
        } catch(error) {
            console.log('error', error)
        }
    }

    useEffect(()=> {
        if (user && user.id) {
            Profile_fetch(user.id)
        }        
    }, [user?.id])

    return(
        <Box sx={{
            backgroundColor: '#959090',
            minHeight: '100vh',
            pt: 0.1
            }}>
            <Box sx={{
                mt: { xs: 15, sm: 20, md: 25 },
                ml: { xs: 2, sm: 8, md: 35 },               
            }}>
                <Typography>Bienvenu : {user?.username}</Typography>
                <Typography>Liste-amis :</Typography>
                <Box>
                    {liste && liste.map((char, index)=> (
                        <li key={index}>
                            <Button onClick={()=>supprimer(char.id)}>supprimer</Button>
                            <Link to={`/chatroom/${char.id}`}>
                            discuter avec {char.username}
                            </Link>
                        </li>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}