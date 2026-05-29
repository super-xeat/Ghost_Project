import { useState, useEffect } from "react";
import useToken from "../context/hook-refresh";
import { Box, Typography, ListItem, List } from "@mui/material";
import { useAuth } from "../context/authcontext";
import { Link } from "react-router-dom";


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

    useEffect(()=> {
        Recup_conversation()
    }, [user_id])

    if (loading) return <p>chargement ...</p>

    return(
        <Box sx={{
            backgroundColor: '#3c3b3bec',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            
        }}>
            <Typography variant="h5" sx={{
                    color: 'orange',
                    mt:20
            }}>Discussion en cours :</Typography>
            <Box sx={{
                backgroundColor: '#181818',
                width: '100%'
            }}>              
                <Box>                   
                    {liste ? ( 
                        liste.map((discussion)=> (
                    <List>
                        
                        <ListItem key={discussion.id}>  
                            <Link to={`/chatroom1/discussion/${discussion.id}`} onClick={()=>setactiveChatId(discussion.id)}>
                                <Typography sx={{
                                    textDecoration: 'none',
                                    color: 'orange'
                                }}>continuer la discussion avec {discussion?.user}</Typography>
                            </Link>
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

