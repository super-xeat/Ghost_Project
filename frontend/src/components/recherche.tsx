import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useAuth } from "../context/authcontext";


export default function Recherche() {

    const {sendmessage, user} = useAuth()
    const [search, setsearch] = useState<string>('')
    
      
    function Envoyer_demande(e: React.FormEvent) {
        e.preventDefault()
        if (!user) return 

        const destinataire_id = search ? parseInt(search, 10) : null

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
                p: 3
                }}>
                <form onSubmit={Envoyer_demande}>
                    <TextField 
                    size="small"
                        sx={{
                            backgroundColor: '#f6c582e9',
                            border: '2px solid #565555e6',
                            borderRadius: '15px'
                        }}
                        value={search} 
                        onChange={(e) => setsearch(e.target.value)}
                    />
                    
                </form>
            </Box>
        </Box>
    )

}

