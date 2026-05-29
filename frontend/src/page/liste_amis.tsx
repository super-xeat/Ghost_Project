import { useState, useEffect } from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { useAuth } from "../context/authcontext";



export default function Liste_ami() {

    const {user} = useAuth()
    const [listeAmis, setlisteAmis] = useState<string[]>([])
    const user_id = user?.id 


    useEffect(()=> {
        async function Liste_amis() {

            if (!user_id) return <Typography>Liste amis vide</Typography>

            try {
                let response = await fetch(`http://localhost:8000/api/user/profile/${user_id}`, {
                    method: 'GET',
                    credentials: 'include'
                })

                if (response.ok) {
                    const data = await response.json()
                    setlisteAmis(data)
                }
            } catch(error) {
                console.error('error pas de liste')
            }
        }
        Liste_amis()
        
    }, [user_id])

    return(
        <Box>
            <Typography>Liste_amis</Typography>
            <List>
                {listeAmis.map((amis, index)=> 
                    <ListItem key={index}>
                        {amis}
                    </ListItem>
                )}
            </List>
        </Box>
    )
}