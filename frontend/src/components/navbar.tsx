import { Link } from "react-router-dom";
import { useState } from "react";
import Recherche from "./recherche";
import { Box } from "@mui/material";
import { useAuth } from "../context/authcontext";


export default function Navbar() {

    const {user} = useAuth()
    const [cache, setcache] = useState(true)
    return(
        <Box>
            {user ? (<p>{user.name} : {user.Etat}</p>) : (<p>aucun user en ligne</p>)}
            <Link to={'/demande_amis'}>liste de demande</Link>
            {cache ? (
                <button onClick={()=>setcache(!cache)}>rechercher</button>
            ) : (
                <Recherche/>
            )}
        </Box>
    )
}