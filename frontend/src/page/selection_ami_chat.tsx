import { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, Button } from "@mui/material";
import { useAuth } from "../context/authcontext";
import type { UserType } from "../context/authcontext";
import { useNavigate } from "react-router-dom";


export default function Liste_ami() {

    const [liste, setliste] = useState<UserType[]>([]) 
    const [ajoutID, setajoutID] = useState<number[]>([])
    const [discussion_id, setdiscussion_id] = useState<number>()
    const navigate = useNavigate()

    const {user} = useAuth()

    async function liste_amis(id: number) {
        try {
            const response = await fetch(`http://localhost:8000/api/chat/liste_amis/${id}/`, {
                method: 'GET',
                credentials: 'include'
            })
            if (response.status === 200) {
                const data = await response.json()
                console.log('liste_ami :', data)
                setliste(data)
            } else {
                console.log('requete erreur')
            }
        } catch(error) {
            console.error('erreur', error)
        }
    }

    async function creer_groupe(ajoutID: number[]) {
        try {
            // mauvais ... mettre la liste dans un body JSON.stringfy
            console.log('ajoutid :', ajoutID)
            const response = await fetch(`http://localhost:8000/api/chat/creer_groupe/`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(ajoutID)
            })

            if (response.status === 200) {
                alert('nouveau groupe créer')
                const data = await response.json()
                setdiscussion_id(data)               
            } 
            if (response.status === 404) {
                const data = await response.json()
                console.error('error', data.error)
                alert(data.error)
                
            }

        } catch(error) {
            console.error('erreur de fetch')
        }
    }

    // ajout des Id dans la liste
    const handleAjoutID = (id: number) => {
        const myID = user?.id
        if (!ajoutID.includes(myID)) {
            ajoutID.push(myID)
        } 
        if (!ajoutID.includes(id)) {
            setajoutID([...ajoutID, id])
        }
        
    }

    // rediriger vers chatroom1 pour nouvelle discussion groupé
    const handleChat = (ajoutID) => {
        creer_groupe(ajoutID)
        setajoutID([])
        navigate(`/chatroom1/groupe/${discussion_id}`)
    }

    useEffect(()=> {
        if (user && user.id) {
            liste_amis(user.id)
        }
    }, [])

    return(
        <Box sx={{
            backgroundColor: '#7f7e7e',
            height: '100vh',           
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
            color: 'orange'
        }}>
            <Typography variant="h3" sx={{
                mt: 15,
                fontSize: '2rem',
                pt: 10,
                p: 3
            }}>Sélectionner des amis pour créer une nouvelle discussion</Typography>

            <hr />
            
            <List>
                {liste.map((char, index)=> (
                    <ListItem key={index}>
                        <Button onClick={()=>handleAjoutID(char.id)}>
                            <Typography variant="h5" sx={{
                                color: 'orange'
                            }}
                            >{char.username}</Typography>
                        </Button>
                    </ListItem>
                ))}
            </List>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                {ajoutID.length > 0 && (
                    <Button onClick={()=>handleChat(ajoutID)} 
                    sx={{
                        border: '2px solid #000',                       
                    }}>
                        <Typography variant="h6" sx={{
                            color: 'black',   
                        }}>
                            créer une nouvelle discussion
                        </Typography>
                    </Button>
                )}
            </Box>
        </Box>
    )
}