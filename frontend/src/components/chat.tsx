import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authcontext";
import { Box, TextField, Button, List, ListItem, Typography } from "@mui/material";
import { useParams } from "react-router-dom";


interface Mode {
    mode: 'discussion' | 'profile'
}

export default function ChatRoom({mode}: Mode) {

    const {user, sendmessage, message } = useAuth()
    const [input, setinput] = useState('')
    const [liste, setliste] = useState([])
    const {id} = useParams<{id: string}>()
    
    console.log('id :', id)
    

    const Recup_message = async(id: number) => {
        try {
            const response = await fetch(`http://localhost:8000/api/chat/discussion/${id}/`, {
                method: 'GET',
                credentials: 'include'
            })

            if(response.ok) {
                const data = await response.json()
                console.log('data_msg :', data)
                setliste(data.msg_discussion)
            }
        } catch(error) {
            console.error('error de fetch :', error)
        }
    }
    
    useEffect(()=> {
        if (id && mode === 'discussion') {
            Recup_message(parseInt(id))
        }
    }, [])

    const handlesubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const destinataire_id = id ? parseInt(id, 10) : null;
    
        if (destinataire_id) {
            sendmessage({
            action: 'message',
            destinataire_id: destinataire_id,
            texte: input
        })
        }
        setinput('')
    }  

    
    return (
        <Box sx={{
            backgroundColor: '#999595ed',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: {xs: 'space-between'},
            height: '100vh'
        }}>
            <List>
                {liste && liste.map((char, index)=> (
                    <ListItem key={index}>
                        {char}
                    </ListItem>
                ))}
            </List>
            <Box sx={{
                display: 'flex',
                alignItems: {xs: 'center'},    
                justifyContent: {md: 'center'},   
                height: '40%',
                marginTop: 20
            }}>
                <List>
                    {message.map((char, index) => (
                    <ListItem key={index} 
                    sx={{ 
                        flexDirection: 'column', 
                        alignItems: 'flex-start' 
                    }}>
                        <Typography sx={{ fontWeight: 'bold' }}>
                            {char.sender_name || user?.username}
                        </Typography>
                        <Typography>{char.texte}</Typography>
                    </ListItem>
                    ))}
                </List>
            </Box>
            <Box
                component="form"
                onSubmit={handlesubmit}
                sx={{
                    p: 2, 
                    gap: 1,
                    borderTop: '1px solid #999',
                    display: 'flex',
                    justifyContent: {xs: 'center', md: 'flex-end'},
                    marginBottom: 2,

                }}
                >
                <TextField
                    onChange={(e) => setinput(e.target.value)}
                    value={input}
                    sx={{
                        backgroundColor: 'gray',
                        borderRadius: '20px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                        },
                        width: '50%',
                        
                    }}
                />
                <Button 
                    type="submit" 
                    variant="contained"
                    sx={{
                    backgroundColor: '#676666',
                    color: 'orange',
                    '&:hover': { backgroundColor: '#444' }
                    }}
                >
                    envoyer
                </Button>
            </Box>
        </Box>
    );
}