import { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, Button } from "@mui/material";
import { useAuth } from "../context/authcontext";
import type { Statut_ami } from "../context/authcontext";


export default function Liste_ami() {
 
    const {user} = useAuth()

    const [listeAmis, setlisteAmis] = useState<Statut_ami[]>([])
    
    const [supp, setsupp] = useState<Statut_ami | null>(null)

    const user_id = user?.id 
    

    useEffect(()=> {
        async function Liste_amis() {
            if (!user_id) return <Typography>Liste amis vide</Typography>
            try {
                let response = await fetch(`http://localhost:8000/api/auth/profile/${user_id}/`, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (response.ok) {
                    const data = await response.json()
                    console.log('data :', data)
                    setlisteAmis(data.liste_amis)
                }
            } catch(error) {
                console.error('error pas de liste')
            }
        }
        Liste_amis()       
    }, [user_id])
    
    
    const supprimer = async( id2: number) => {
        if (!user?.id) return

    
            try {
                const response = await fetch(`http://localhost:8000/api/chat/supprimer_ami/${user.id}/${id2}/`, {
                    method: 'DELETE',
                    credentials: 'include'
                })
                if (response.ok) {
                    console.log('ami supprimé de la liste')
                }
            } catch(error) {
                console.log('error', error)
        }
    }

    
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
            minHeight: '100vh',
            height: '100vh',
            pt: 15,
        
            
        }}>

            <Box sx={{
                    backgroundColor: '#0e0e0ed2',
                    color: 'white',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '10px',
                    border: '2px solid #fa560aec',
                    borderLeft: 'none',
                    borderRight: 'none'
                }}>
                <Typography sx={{
                    fontSize: '25px',
                    
                }}>Liste amis : </Typography>
            </Box>

            
            <List>
                {listeAmis?.map((amis, index)=> 
                    <ListItem key={index} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                       
                    }}> {supp?.id === amis.id && (
                            <Box sx={{ backgroundColor: 'rgba(250, 86, 10, 0.1)', p: 2, borderRadius: '8px', mb: 2, border: '1px solid #fa560aec' }}>
                                <Typography sx={{ color: 'white' }}>
                                    Êtes-vous sûr de vouloir supprimer {amis?.username} de votre liste d'amis ?
                                </Typography>
                                <Button sx={{ color: '#fa560aec' }} onClick={() => supprimer(amis.id)}>YES</Button>
                                <Button sx={{ color: 'white' }} onClick={() => setsupp(null)}>NO</Button>
                            </Box>
                        )}

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                            
                        }}>
                            
                            <Typography sx={{
                                color: 'white',
                                fontSize: '20px'
                            }}>{amis?.username}</Typography>
                            <br />
                            <Typography sx={{
                                color: 'white',
                                fontSize: '20px',
                                marginLeft: '2rem'
                            }}>{amis?.statut}</Typography>

                            <Button onClick={()=> setsupp(amis)}>supprimer</Button>
                        </Box>
                    </ListItem>
                )}
            </List>
        </Box>
    )
}