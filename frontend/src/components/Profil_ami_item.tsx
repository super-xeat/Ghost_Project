import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import {styled, Badge, Avatar, Stack, Button } from "@mui/material";


const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))


interface Ami {
    id: number
    username : string | undefined
    statut : 'en ligne' | 'hors ligne'
    avatar?: string | undefined
}

interface Recuperation {
    id1?: number | undefined
    ami: Ami
    name?: string | undefined
    mode: 'profil' | 'liste_ami'
}

export default function Recup_conv({id1, name, ami, mode}: Recuperation) {
    console.log('ami :', ami)

    const [trouver, settrouver] = useState(false)
    const [discussionID, setdiscussionID] = useState('')

    console.log('mode :', mode)
    // trouver discussion_id avec id de l'user
    async function Recup_conv(id1: number, id2: number) {
        
        try {
            const response = await fetch(`http://localhost:8000/api/chat/trouver_discussion/${id1}/${id2}/`, {
                method: 'GET',
                credentials: 'include'
            })
    
            if (response.status === 200) {
                const data = await response.json()
                settrouver(true) 
                setdiscussionID(data.id)
                console.log('discussion trouvé')
            }

            if (response.status === 404) {
                const data = await response.json()
                settrouver(false)
                setdiscussionID(data.id)
                console.log('discussion pas trouvé')
            }

        } catch(error) {
            console.error('error', error)
        }
    }

    useEffect(()=> {
        Recup_conv(id1, ami?.id)
        settrouver(false)
        setdiscussionID('')
    }, [ami?.id, id1])

    console.log('trouver :', trouver)
    
    return(
        <Box>
            {mode === 'profil' && (trouver ? (
                <Link to={`/chatroom1/discussion/${discussionID}`}>  
                    <Typography color="orange">continuer conversation avec {name}</Typography>
                </Link>
            ) : (
                <Link to={`/chatroom1/profile/${discussionID}`}> 
                    <Typography color="orange">commencer conversation avec {name}</Typography>
                </Link>
            ))}  

            {mode === 'liste_ami' && trouver && (
                <Link to={`/chatroom1/discussion/${discussionID}`}>
                    <Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                  
                            {ami?.statut === 'en ligne' ? (
                                <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                                    <Avatar 
                                        src={ami?.avatar || undefined} 
                                        sx={{ bgcolor: ami?.avatar ? 'transparent' : stringToColor(ami.username) }}
                                    >
                                        {ami?.username.substring(0, 2).toUpperCase()} 
                                    </Avatar>
                                </StyledBadge>
                            ) : (
                        
                                <Avatar 
                                    src={ami?.avatar || undefined} 
                                    sx={{ bgcolor: ami?.avatar ? 'transparent' : '#555' }} 
                                >
                                    {ami?.username.substring(0, 2).toUpperCase()}
                                </Avatar>
                            )}

                            <Typography sx={{ color: 'white', fontSize: '20px' }}>{ami?.username}</Typography>
                        </Box>
                    </Button>
                </Link>               
                )}
        </Box>
    )
}