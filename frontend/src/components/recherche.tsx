import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";


export default function Recherche() {

    const [search, setsearch] = useState<string>('')

    const Envoyer_demande = (e: React.FormEvent) => {
        
        e.preventDefault()
        const socket = new WebSocket('ws://localhost:8000/ws/chat/')
  
        socket.onopen = () => {
            const payload = {
                action: "demande_ami",
                destinataire_id: parseInt(search)
            } 
            socket.send(JSON.stringify(payload))
        
            alert("Demande envoyée !");
        }
        socket.onerror = (err) => console.error('error socket', err)
    }

    return(
        <Box>
            <Box sx={{ p: 2 }}>
                <form onSubmit={Envoyer_demande}>
                    <TextField 
                        label="ID de l'ami"
                        variant="outlined"
                        value={search} 
                        onChange={(e) => setsearch(e.target.value)}
                    />
                    <Button type="submit" variant="contained" sx={{ ml: 2 }}>
                        Ajouter
                    </Button>
                </form>
            </Box>
        </Box>
    )

}

