import { useState, useEffect } from "react";
import { Box, Typography, Button, ListItem, List } from "@mui/material";
import { useAuth } from "../context/authcontext";
import type { UserType } from "../context/authcontext";
import Recup_conv from "../components/Profil_ami_item";
import useToken from "../context/hook-refresh";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";


export default function Profile() {

    const {user} = useAuth()
    const [liste, setliste] = useState<UserType[]>([])
    const {refresh} = useToken()

    async function Profile_fetch(id: number)  {
        if (!user) {
            console.log('user inconnu dans le composant profile')
            return 
        }
        try {
            let response = await fetch(`http://localhost:8000/api/auth/profile/${id}/`, {
                method: 'GET',
                credentials: 'include'
            })

            if (response.status === 401) {
                const token = await refresh()
                if (token) {
                    response = await fetch(`http://localhost:8000/api/auth/profile/${id}/`, {
                        method: 'GET',
                        credentials: 'include'
                    })
                    const data = await response.json()
                    console.log('data :', data)
                    setliste(data.liste_amis)
                } else {
                    console.log('error')
                }
            } else {
                const data = await response.json()
                console.log('data :', data)
                setliste(data.liste_amis)
            }
        } catch(error) {
            console.error('erreur dans le composant profile', error)
        }
    }

    
    useEffect(()=> {
        if (user && user.id) {
            Profile_fetch(user.id)
        }        
    }, [user?.id])

    // attention le bouton supprimer supprime l'ami et non 
    // et non la discussion ... A déplacer dans le fichier
    // liste_ami.jsx

    return(
        <Box sx={{          
            background: 'linear-gradient(120deg, #000000 0%, #2e2e2e 40%, #010101 60%, #161616 100%)',
            backgroundSize: '200% 200%',
            animation: 'metalSweep 8s ease infinite',
            '@keyframes metalSweep': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
            },
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',   
            minHeight: '100vh',
            pt: 0.1,
            }}>
            <Box sx={{
                mt: { xs: 15, sm: 20, md: 25 },
                ml: { xs: 2, sm: 8, md: 35 },               
            }}>
                <Box sx={{
                    height: '35vh',
                    backgroundColor: '#4e4c4c20',
                    margin: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 4,
                    width: '100%'
                }}>
                    <Typography sx={{
                        color: 'orange',
                        fontSize: '30px'
                    }}>Bienvenu : {user?.username}</Typography>
                    <Stack direction="row" spacing={2}>
                        <Avatar alt="Remy Sharp" src={user.avatar} sx={{
                            width: '100px',
                            height: '100px'
                        }}/>                       
                    </Stack>
                </Box>
                <Typography color="orange">Liste-amis :</Typography>
                <List sx={{
                    listStyle: 'none',
                    color: 'orange'
                }}>
                    {liste && liste.map((char, index)=> (
                        
                        <ListItem key={index} sx={{
                            color: 'orange'
                        }}>                          
                            
                            <Recup_conv 
                            name={char?.username}
                            id1={user?.id}
                            id2={char?.id}/>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    )
}