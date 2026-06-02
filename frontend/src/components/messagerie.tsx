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

    async function Retirer_Ami_Conv(discussionId: number | undefined, user_id: number) {

        if (!discussionId || !user_id) return <Typography>erreur d'id</Typography>

        try {
            const response = await fetch(`http://localhost:8000/api/chat/retirer_discussion/${discussionId}/${user_id}/`, {
                method: 'PUT',
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
            color: '#e0e0e0',
            p: 4,
            textAlign: 'center',

            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%'
        }}>
            <Typography variant="h5" 
            sx={{
                    color: 'orange',
                    mt:15
            }}>Discussion en cours :</Typography>

            <Box sx={{
                width: '100%',
                marginTop: 5
            }}>              
                <Box>                   
                    {liste ? ( 
                        liste.map((discussion)=> (
                    <List sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        
                        <ListItem key={discussion.id} sx={{
                            border: '1px solid white',
                            pr: 0,
                            display: 'flex',
                            justifyContent: 'space-between',
                            backgroundColor: '#000000cc',
                            borderRadius: '10px'
                        }}>  
                            <Link to={`/chatroom1/discussion/${discussion.id}`} onClick={()=>setactiveChatId(discussion.id)}>
                                <Typography sx={{
                                    textDecoration: 'none',
                                    color: 'orange'
                                }}>continuer la discussion avec {discussion?.user}</Typography>
                            </Link>
                            <Button onClick={()=>Retirer_Ami_Conv(discussion.id, user_id)} sx={{
                                color: 'orange',
                                pr: 0
                            }}>
                                <DeleteOutlinedIcon/>
                            </Button>
                        </ListItem>
                    </List>
                    ))                          
                ) : (
                    <Typography>
                        pas de conversation en cours
                    </Typography>
                )}
                </Box> 
            </Box>
        </Box>
    )
}

