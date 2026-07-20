import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useAuth } from "../context/authcontext";
import SearchIcon from '@mui/icons-material/Search';



export default function Recherche() {

    const {sendmessage, user} = useAuth()
    const [name, setname] = useState<string>('')
    const [iduser, setiduser] = useState<number | null>(null)

    async function trouver_id(name: string) {
        
        const nameUser = name.toLocaleLowerCase().trim()
        try {
            const response = await fetch(`http://localhost:8000/api/chat/${nameUser}/`, {
                method: 'GET',
                credentials: 'include'
            })

            if (response.status === 200) {
                const data = await response.json()
                setiduser(data.id)
            }

            if (response.status === 404) {
                alert('aucun utilisateur ne correspond a ce nom')
            }

        } catch(error) {
            console.error('erreur :', error)
        }
    }
    
    function Envoyer_demande(e: React.FormEvent) {
        e.preventDefault()
        if (!user) return 
        trouver_id(name)
        
        const destinataire_id = iduser 

        if (destinataire_id) {
            sendmessage({
            action: "demande_ami",
            destinataire_id: destinataire_id
        })
        }
    }

    return(
        <Box>
            <Box sx={{ 
                p: 0
                }}>
                <Box onSubmit={Envoyer_demande} component="form" sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <TextField 
                        size="small"
                        sx={{
                            backgroundColor: '#4a4a4a47',
                            border: '2px solid orange',
                            borderRadius: '15px',
                            width: '100%',
                        
                        }}
                        value={name} 
                        onChange={(e) => setname(e.target.value)}
                    />
                    <Button type="submit" sx={{
                        color: 'orange',
                        p: 0
                    }}>
                        <SearchIcon/>
                    </Button>
                </Box>
            </Box>
        </Box>
    )

}

