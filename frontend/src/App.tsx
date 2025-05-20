import './App.css'
import {useEffect, useRef, useState} from "react";
import type {ChatMessage, IncomingMessage} from "./types";
import AppToolbar from "./components/Toolbar/Toolbar.tsx";
import {Container, CssBaseline, Typography} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import Login from "./features/Users/Login.tsx";

const App = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat');

        ws.current.onclose = () => console.log('ws closed');

        ws.current.onmessage = (event) => {
            const decodedMessage = JSON.parse(event.data) as IncomingMessage;

            if(decodedMessage.type === "NEW_MESSAGE"){
                setMessages(prevState => [decodedMessage.payload, ...prevState]);
            }
        };

        return () => {
            if(ws.current) {
                ws.current.close();
            }
        }
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if(!ws.current) return;

        ws.current.send(JSON.stringify({
            type: "SEND_MESSAGE",
            payload: messageInput,
        }));
    };

    const setUsername = (e: React.FormEvent) => {
        e.preventDefault();

        if(!ws.current) return;

        ws.current.send(JSON.stringify({
            type: "SET_USERNAME",
            payload: usernameInput,
        }));

        setIsLoggedIn(true);
    };

    let chat = (
        <>
            {messages.map((message, index) => (
                <div key={index}>
                    <b>{message.username}: {message.text}</b>
                </div>
            ))}
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    name='messageText'
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </>
    )

    if(!isLoggedIn){
        chat = (
            <form onSubmit={setUsername}>
                <input
                    type="text"
                    name="username"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        )
    }

  return (
    <>
        <CssBaseline/>
        <header>
            <AppToolbar/>
        </header>
        <main>
            <Container maxWidth="xl">
                <Routes>
                    <Route path="/" element={chat}/>
                    <Route path="/login" element={<Login/>}/>

                    <Route path="*" element={<Typography variant="h4">Not found page</Typography>}/>
                </Routes>
            </Container>
        </main>
    </>
  )
};

export default App
