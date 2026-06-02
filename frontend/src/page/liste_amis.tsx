import { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, Button } from "@mui/material";
import { useAuth } from "../context/authcontext";
import type { UserType } from "../context/authcontext";


export default function Liste_ami() {
 
    const {user} = useAuth()
    const [listeAmis, setlisteAmis] = useState<UserType[]>([])
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
            backgroundColor: 'gray',
            height: '100vh',
            pt: 15,
            pl: 5
        }}>

            <Typography color="orange">Liste_amis :</Typography>
            <List>
                {listeAmis.map((amis, index)=> 
                    <ListItem key={index} sx={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Button onClick={()=>supprimer(amis.id)}>supprimer</Button>

                        <Typography>{amis?.username}</Typography>
                        <br />
                        <Typography>Status: {amis.isAuth}</Typography>
                    </ListItem>
                )}
            </List>
        </Box>
    )
}