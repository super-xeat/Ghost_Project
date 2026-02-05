import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/authcontext";


interface Message {
    user: string,
    message: string
}

export default function ChatRoom() {

    const {user} = useAuth()
    const [messages, setmessages] = useState<Message[]>([])
    const [input, setinput] = useState('')

    const socketRef = useRef<WebSocket | null>(null)

    useEffect(()=> {
        const socket = new WebSocket('ws://localhost:8000/ws/chat/')
        socket.onopen = () => {
            console.log('connecté au websocket')
        }
        socketRef.current = socket

        socket.onmessage = (e) => {
            const data: Message = JSON.parse(e.data)
            setmessages((prev)=> [...prev, data])
        }
        socket.onerror = (err) => console.error("Erreur Socket:", err)
        return () => {
            socket.close();
            }
    }, [])

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault()

        if (input.trim() !== "" && user) {
            const payload = {
                message: input,
                user: user.name
            }
            socketRef.current?.send(JSON.stringify(payload))
            setinput('')
        }
    }

    return(
        <div>
            {messages.map((char, index)=> (
                <li key={index}>
                    {char.user} : {char.message}
                </li>
            ))}
            <form onSubmit={sendMessage}>
                <input onChange={(e)=>setinput(e.target.value)} value={input}/>
            </form>
        </div>
    )
}