import type { DemandeAmi } from "./demande_ami_liste";
import { Box } from "@mui/material";
import { useAuth } from "../context/authcontext";

interface DemandeItemProps {
    item: DemandeAmi;
    onrefresh: () => void;
}

export default function Demande_item({item, onrefresh}: DemandeItemProps) {

    const {user} = useAuth()

    const user_id = user?.id
    const item_id = item.id

    const Valider_supprimer = async(choix: boolean) => {
        if (!user_id) return
        try {
            const response = await fetch(`http://localhost:8000/api/chat/accept/${user_id}/${item_id}/${String(choix)}/`, {
                method: 'PUT',
                headers: {'content-type': 'application/json'},
                credentials: 'include'
            })
            if (response.status === 200) {
                alert('action effectué')
                onrefresh()
            }

        } catch(error) {
            console.error('error :', error)
        }
    }

    
    return(
        <Box>
            <form>
                <p>{item.user.username} veut etre votre ami</p>
                <button onClick={()=>Valider_supprimer(true)}>accepter</button>
                <button onClick={()=>Valider_supprimer(false)}>refuser</button>
            </form>
        </Box>
    )
}