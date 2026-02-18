import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../context/authcontext";
import type { UserType } from "../context/authcontext";


export interface DemandeAmi {
    id: number
    user: UserType       
    destinataire: UserType
    accept: boolean
}

export default function Demande_Amis() {
    console.log('composant_ami')
    const [liste, setliste] = useState<DemandeAmi[]>([])
    const {user} = useAuth()
    const user_id = user?.id 
    

    const Liste_ami = async(user_id: number) => {
        if (!user_id) return
        try {
            const response = await fetch(`http://localhost:8000/api/chat/liste_demande/${user_id}/`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json()
            console.log('data :',data)
            setliste(data)
            console.log('liste :', liste)
        } catch(error) {
            console.error()
        }
    }

    useEffect(()=> {
        if (user && user.id) {
            Liste_ami(user.id)
        } else {
            console.log('en attente de user')
        }
    }, [user])

    const Valider_supprimer = async(choix: boolean, item_id: number) => {
        if (!user_id) return
        try {
            const response = await fetch(`http://localhost:8000/api/chat/accept/${user_id}/${item_id}/${String(choix)}/`, {
                method: 'PUT',
                headers: {'content-type': 'application/json'},
                credentials: 'include'
            })
            if (response.status === 200) {
                alert('action effectué')
                Liste_ami(user_id)
            }

        } catch(error) {
            console.error('error :', error)
        }
    }

    return(
        <Box sx={{ p: 2 }}>
            <h3 style={{ marginBottom: '1rem' }}>Demandes d'amis reçues</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {liste && liste.length > 0 ? (
                    liste.map((demande) => (
                        <li key={demande.id}>
                            <form>
                                <p>{demande.user.username} veut etre votre ami</p>
                                <button onClick={()=>Valider_supprimer(true, demande.user.id)}>accepter</button>
                                <button onClick={()=>Valider_supprimer(false, demande.user.id)}>refuser</button>
                            </form>
                        </li>
                    ))
                ) : (
                    <p>Aucune demande en attente.</p>
                )}
            </ul>
        </Box>
    )
}