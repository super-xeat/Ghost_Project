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
            height: '100vh'
        }}>
            <Typography variant="h3" sx={{
                mt: 10
            }}>Sélectionner pour créer une nouvelle discussion</Typography>
            <List>
                {liste.map((char, index)=> (
                    <ListItem key={index}>
                        <Button onClick={()=>handleAjoutID(char.id)}>
                            <Typography variant="h5" sx={{
                                color: 'black'
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