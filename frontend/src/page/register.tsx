import { useState } from "react";
import type { FormEvent } from 'react';
import { TextField, Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload'


export default function Register() {
    const [email, setmail] = useState('')
    const [username, setusername] = useState('')
    const [password, setpassword] = useState('')
    const [confirmpassword, setconfirmpassword] = useState('')
    const [file, setfile] = useState<File | null>(null)

    const register = async() => {
        const formdata = new FormData()
        
        formdata.append('email', email)
        formdata.append('username', username)
        formdata.append('password', password)
        formdata.append('password_confirmation', confirmpassword)
        if (file) {
            formdata.append('avatar', file)
        }
        const response = await fetch('http://localhost:8000/auth/register/', {
            method: 'POST',
            body: formdata
        })
        if (response.ok) {
            alert('regardez vos mail')
            console.log('user créé')
        }
    }

    const handleimage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setfile(e.target.files[0])
        }
    }

    function handlesubmit(e: FormEvent) {
        e.preventDefault()
        register()
        setmail('')
        setusername('')
        setpassword('')
        setconfirmpassword('')
        setfile(null)
    }
    return(
        <Box
            component="form"
            onSubmit={handlesubmit}
        >
            <Typography>Inscription</Typography>
            <TextField label="email" type="email" value={email} onChange={(e) => setmail(e.target.value)}/>
            <TextField label="nom utilisateur" type="text" value={username} onChange={(e) => setusername(e.target.value)}/>
            <TextField label="password" type="password" value={password} onChange={(e) => setpassword(e.target.value)}/>
            <TextField label="confirmpassword" type="password" value={confirmpassword} onChange={(e) => setconfirmpassword(e.target.value)}/>

            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Choisir un avatar
                <input type="file" hidden accept="image/*" onChange={handleimage}/>
            </Button>

            {file && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Fichier sélectionné : {file.name}
                </Typography>
            )}
            <Button type="submit">envoyer</Button>
        </Box>
       )
}