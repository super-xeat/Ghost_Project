import { useState, useEffect } from "react";
import useToken from "../context/hook-refresh";
import { Box, Typography, ListItem, List, Button } from "@mui/material";
import { useAuth } from "../context/authcontext";
import { Link } from "react-router-dom";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';


interface discussion {
    id: number
    user: number
}

export default function Messagerie() {

    const {refresh} = useToken()
    const {user, activeChatId, setactiveChatId} = useAuth()
    const [liste, setliste] = useState<discussion[]>([])
    const [loading, setLoading] = useState(false)

    const user_id = user?.id

    async function Recup_conversation() {
        if (!user_id) return

        try {
            let response = await fetch(`http://localhost:8000/api/chat/liste_discussion/${user_id}/`, {
                method: 'GET',
                headers: {'content-type': 'application/json'},
                credentials:'include'
            })

            if (response.status === 401) {
                refresh()
                const isrefresh = await refresh()

                if (isrefresh) {
                    response = await fetch(`http://localhost:8000/api/chat/liste_discussion/${user_id}/`, {
                    method: 'GET',
                    headers: {'content-type': 'application/json'},
                    credentials:'include'
                    })
                }
            }
            if (response.ok) {
                const data = await response.json()
                console.log('data messagerie :', data)
                setliste(data)
            }
        } catch(error) {
            console.log('error :', error)
        } finally {
            setLoading(false)
        }
    }

    async function Retirer_Ami_Conv(discussionId: number | undefined) {

        if (!discussionId) return <Typography>erreur d'id</Typography>

        try {
            const response = await fetch(`http://localhost:8000/api/chat/retirer_discussion/${discussionId}/`, {
                method: 'DELETE',
                credentials: 'include'
            })

            const result = await response.json()

            if (response.ok) {
                alert('vous avez supprimé la conv')
                console.log('supprimé de la conv', result)
            } 
            
        } catch(error) {
            console.error('error', error)
        }
    }

    useEffect(()=> {
        Recup_conversation()
    }, [user_id])

    if (loading) return <p>chargement ...</p>

    return (
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
        color: '#e0e0e0',
        p: { xs: 2, sm: 4 }, 
        textAlign: 'center',

        minHeight: '100vh', 
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box'
    }}>
        <Typography variant="h5" 
            sx={{
                color: 'orange',
                fontWeight: 'bold',
                mt: { xs: 4, md: 2 }, 
                mb: 3
            }}
        >
            Discussion en cours :
        </Typography>

        <Box sx={{
            width: '100%',
            maxWidth: '600px', 
        }}>              
            {liste && liste.length > 0 ? ( 
                <List sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2,
                    width: '100%',
                    p: 0 
                }}>
                    {liste.map((discussion) => (
                        <ListItem 
                            key={discussion.id} 
                            sx={{
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: '#000000cc',
                                borderRadius: '10px',
                                p: 2, 
                                gap: 2
                            }}
                        >  
                            
                            <Link 
                                to={`/chatroom1/discussion/${discussion.id}`} 
                                onClick={() => setactiveChatId(discussion.id)}
                                style={{ textDecoration: 'none', flex: 1, minWidth: 0 }}
                            >
                                <Typography sx={{
                                    color: 'orange',
                                    textAlign: 'left',
                                    fontSize: { xs: '14px', sm: '16px' },
                                     
                                }}>
                                    continuer avec {discussion?.user}
                                </Typography>
                            </Link>

                            <Button 
                                onClick={() => Retirer_Ami_Conv(discussion.id)} 
                                sx={{
                                    color: 'orange',
                                    minWidth: 'auto',
                                    p: 1
                                }}
                            >
                                <DeleteOutlinedIcon/>
                            </Button>
                        </ListItem>
                    ))}  
                </List>                          
            ) : (
                <Typography sx={{ opacity: 0.7, mt: 4 }}>
                    Pas de conversation en cours
                </Typography>
            )}
        </Box> 
    </Box>
);
}

