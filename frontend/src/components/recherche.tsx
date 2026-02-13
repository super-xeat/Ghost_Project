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

