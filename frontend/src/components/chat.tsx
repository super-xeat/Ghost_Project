import React, { useState } from "react";
import { useAuth } from "../context/authcontext";
import { Box, TextField, Button, List, ListItem, Typography } from "@mui/material";
import { useParams } from "react-router-dom";



export default function ChatRoom() {

    const {user, sendmessage, message } = useAuth()
    const [input, setinput] = useState('')
    const {id} = useParams<{id: string}>()

    
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