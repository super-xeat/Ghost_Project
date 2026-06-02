import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useAuth } from "../context/authcontext";
import SearchIcon from '@mui/icons-material/Search';


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
                        value={search} 
                        onChange={(e) => setsearch(e.target.value)}
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

