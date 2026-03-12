import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authcontext";
import { Box, TextField, Button, List, ListItem, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";


interface Mode {
    mode: 'discussion' | 'profile' | 'groupe'
}

interface User {
    username: string
}

interface Message {
    sender: User
    texte: string
}

export default function ChatRoom({mode}: Mode) {

    const {user, sendmessage, message } = useAuth()
    const [input, setinput] = useState('')

    const [liste, setliste] = useState<Message[]>([])
    const {id} = useParams<{id: string}>()
    
    
    const Recup_message = async(id: number) => {
        try {
            const response = await fetch(`http://localhost:8000/api/chat/discussion/${id}/`, {
                method: 'GET',
                credentials: 'include'
            })

            if(response.ok) {
                const data = await response.json()
                console.log('data_msg :', data)
                setliste(data)
            }
        } catch(error) {
            console.error('error de fetch :', error)
        }
    }
    
    useEffect(()=> {
        if (id && mode === 'discussion' || id &&  mode === 'groupe') {
            Recup_message(parseInt(id))
        }
        // mode groupe aussi
        
    }, [])

    
    const handlesubmit = (e: React.FormEvent) => {
        if (mode === 'groupe') {
            e.preventDefault()
            const discussion_id = id ? parseInt(id, 10) : null;

            if (discussion_id) {
                sendmessage({
                action: 'groupe',
                // on passe id de la discussion car le groupe est deja créer
                discussion_id: discussion_id,
                texte: input
            })
            }
            setinput('')
        } else {
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
    }  

    
    
    return (
        <Box sx={{
            backgroundColor: '#4b4b4bed',
            display: 'flex',
            flexDirection: 'column',
            mt: '10vh',
            justifyContent: {xs: 'space-between'},
            width: '100%'
        }}>
            <List sx={{
                color:'orange'
            }}>
                {liste && liste.map((char, index)=> (
                    <ListItem key={index} 
                    sx={{ 
                        flexDirection: 'column', 
                        alignItems: 'flex-start'
                       
                    }}>
                        
                            {char.sender.username && char.sender.username === user?.username ? (
                                <Box sx={{
                                    marginLeft: '50%',
                                    backgroundColor: '#1f1f1f',
                                    paddingRight: 15,
                                    paddingLeft: 2,
                                    paddingTop: 1,
                                    paddingBottom: 3,
                                    borderRadius: 5,
                                    border: '1px solid #fa9600'
                                }}>
                                    <Typography sx={{ fontWeight: 'bold' }}>{user.username}</Typography>                   
                                    <Typography>{char.texte}</Typography>                  
                                </Box>
                            ) : (
                                <Box sx={{
                                    backgroundColor: '#1f1f1f',
                                    paddingRight: 15,
                                    paddingLeft: 2,
                                    paddingTop: 1,
                                    paddingBottom: 3,
                                    borderRadius: 5,
                                    border: '1px solid #fa9600'
                                }}>
                                    <Typography sx={{ fontWeight: 'bold' }}>{char.sender.username}</Typography>                   
                                    <Typography>{char.texte}</Typography>                  
                                </Box>
                            )}
                    </ListItem>    
                ))}
            </List>
            <Box sx={{
                display: 'flex',
                alignItems: {xs: 'center'},    
                justifyContent: {md: 'center'},   
            }}>
                <List>
                    {message.map((char, index) => (
                    <ListItem key={index} 
                    sx={{ 
                        flexDirection: 'column', 
                        alignItems: 'flex-start' 
                    }}>
                        
                            {char.sender_name && user?.username ? (
                                <Box sx={{
                                    marginLeft: '50%'
                                }}>
                                    <Typography sx={{ fontWeight: 'bold' }}>{user.username}</Typography>                   
                                    <Typography>{char.texte}</Typography>                  
                                </Box>
                            ) : (
                                <Box>
                                    <Typography sx={{ fontWeight: 'bold' }}>{char.sender_name}</Typography>                   
                                    <Typography>{char.texte}</Typography>                  
                                </Box>
                            )}
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
                    marginBottom: 2,
                    position: 'fixed',
                    display: 'flex',
                    backgroundColor: '#333131',
                    width: '100%',
                    mt: '90%',
                    justifyContent: 'center'
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