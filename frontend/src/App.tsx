import './App.css';
import { useEffect, useRef, useState } from 'react';
import type { ChatMessage, User } from './types';
import AppToolbar from './components/Toolbar/Toolbar.tsx';
import {
    Container,
    CssBaseline,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Box,
    Grid,
    TextField,
    Button
} from '@mui/material';
import { Route, Routes } from 'react-router-dom';

const App = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeUsers, setActiveUsers] = useState<User[]>([]);

    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat');

        ws.current.onclose = () => console.log('WebSocket closed');

        ws.current.onmessage = (event) => {
            const decodedMessage = JSON.parse(event.data);

            if (decodedMessage.type === 'NEW_MESSAGE') {
                setMessages(prev => [decodedMessage.payload, ...prev]);
            } else if (decodedMessage.type === 'USER_LIST') {
                setActiveUsers(decodedMessage.payload);
            } else if (decodedMessage.type === 'MESSAGE_HISTORY') {
                setMessages([...decodedMessage.payload].reverse());
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);


    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ws.current || !messageInput.trim()) return;

        ws.current.send(
            JSON.stringify({
                type: 'SEND_MESSAGE',
                payload: messageInput
            })
        );

        setMessageInput('');
    };

    const setUsername = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ws.current || !usernameInput.trim()) return;

        ws.current.send(
            JSON.stringify({
                type: 'SET_USERNAME',
                payload: usernameInput
            })
        );

        setIsLoggedIn(true);
    };

    let chat = (
        <Grid container spacing={2} sx={{ height: '80vh' }}>
            <Grid size={3}>
                <Paper elevation={3} sx={{ height: '100%', p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Online Users
                    </Typography>
                    <List>
                        {activeUsers.map((user, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={user.username} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>

            <Grid size={9}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Paper elevation={3} sx={{ flexGrow: 1, p: 2, mb: 2, overflow: 'auto' }}>
                        {messages.map((message, index) => (
                            <Box key={index} mb={1}>
                                <Typography variant="body1">
                                    <b>{message.username}:</b> {message.text}
                                </Typography>
                            </Box>
                        ))}
                    </Paper>
                    <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type a message"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ ml: 2 }}
                            disabled={!messageInput.trim()}
                        >
                            Send
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );

    if (!isLoggedIn) {
        chat = (
            <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom align="center">
                        Enter Chat
                    </Typography>
                    <Box component="form" onSubmit={setUsername}>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={!usernameInput.trim()}
                        >
                            Join Chat
                        </Button>
                    </Box>
                </Paper>
            </Box>
        );
    }

    return (
        <>
            <CssBaseline />
            <header>
                <AppToolbar />
            </header>
            <main>
                <Container maxWidth="xl" sx={{ mt: 4 }}>
                    <Routes>
                        <Route path="/" element={chat} />
                        <Route path="*" element={<Typography variant="h4">Not found page</Typography>} />
                    </Routes>
                </Container>
            </main>
        </>
    );
};

export default App;
