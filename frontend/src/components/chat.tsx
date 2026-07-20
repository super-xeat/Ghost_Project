import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authcontext";
import { Box, TextField, Button, List, ListItem, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

interface Mode {
    mode: 'discussion' | 'profile' | 'groupe'
}

interface User {
    username: string
}

interface HistoryMessage {
    sender: User
    texte: string
}

export default function ChatRoom({ mode }: Mode) {
    const { user, sendmessage, message, setmessage, setactiveChatId } = useAuth();
    const [input, setinput] = useState('')
    const [liste, setliste] = useState<HistoryMessage[]>([])
    
    const { id } = useParams<{ id: string }>()   // id de la discussion
    const currentDiscussionId = id ? parseInt(id, 10) : null;

    const Recup_message = async (discussionId: number) => {
        try {
            const response = await fetch(`http://localhost:8000/api/chat/discussion/${discussionId}/`, { 
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {  
                const data = await response.json();
                setliste(data);
            }
        } catch (error) {
            console.error('Erreur de fetch historique :', error);
        }
    };
    
    useEffect(() => {
        if (currentDiscussionId) {
            setactiveChatId(currentDiscussionId);
            sendmessage({
                action: 'join_discussion', 
                discussion_id: currentDiscussionId
            });  
            Recup_message(currentDiscussionId);  
        }
        return () => {
            setactiveChatId(undefined);
            setmessage([]); 
        };
    }, [id]); 

    const handlesubmit = (e: React.FormEvent) => {       
        e.preventDefault();
        if (!input.trim() || !currentDiscussionId) return;

        sendmessage({
            action: 'message',
            discussion_id: currentDiscussionId,
            texte: input 
        });
        setinput('');
    };  

    const messagesTempsReelFiltres = message.filter(
        (msg) => msg.discussion_id === currentDiscussionId
    );

    return (
        <Box sx={{
            backgroundColor: '#4b4b4bed',
            display: 'flex',
            flexDirection: 'column',
            mt: '10vh',
            minHeight: '80vh',
            width: '100%',
            pb: 10 // Espace pour ne pas cacher les messages derrière le formulaire fixe
        }}>
            
            <List sx={{ color: 'orange' }}>
                {liste && liste.map((char, index) => (
                    <ListItem key={`hist-${index}`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Box sx={{
                            marginLeft: char.sender.username === user?.username ? '50%' : '0%',
                            backgroundColor: '#1f1f1f',
                            p: 2,
                            borderRadius: 5,
                            border: '1px solid #fa9600',
                            minWidth: '40%'
                        }}>
                            <Typography sx={{ fontWeight: 'bold' }}>{char.sender.username}</Typography>                   
                            <Typography>{char.texte}</Typography>                  
                        </Box>
                    </ListItem>    
                ))}
            </List>

            
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <List sx={{ color: 'orange', width: '100%' }}>
                    {messagesTempsReelFiltres.map((char, index) => (
                        <ListItem key={`ws-${index}`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        
                            <Box sx={{
                                marginLeft: char.sender_name === user?.username ? '50%' : '0%',
                                backgroundColor: '#1f1f1f',
                                p: 2,
                                borderRadius: 5,
                                border: '1px solid #fa9600',
                                minWidth: '40%'
                            }}>
                                <Typography sx={{ fontWeight: 'bold' }}>{char.sender_name}</Typography>                   
                                <Typography>{char.texte}</Typography>                  
                            </Box>
                        </ListItem>    
                    ))}
                </List>
            </Box> 

            
            <Box component="form" onSubmit={handlesubmit} sx={{
                p: 2, 
                gap: 1,
                borderTop: '1px solid #999',
                position: 'fixed',
                bottom: 150,
                display: 'flex',
                backgroundColor: '#333131',
                width: '100%',
                justifyContent: 'center',
                zIndex: 10
            }}>
                <TextField
                    onChange={(e) => setinput(e.target.value)}
                    value={input}
                    sx={{
                        backgroundColor: 'gray',
                        borderRadius: '20px',
                        '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                        width: '50%',
                    }}
                />
                <Button type="submit" variant="contained" sx={{
                    backgroundColor: '#676666',
                    color: 'orange',
                    '&:hover': { backgroundColor: '#444' }
                }}>
                    envoyer
                </Button>
            </Box>
        </Box>
    );
}