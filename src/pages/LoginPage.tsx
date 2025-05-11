import React, { useState } from 'react';
import {
    Container, TextField, Button, Typography, Box, Select, MenuItem,
    createTheme, ThemeProvider
} from '@mui/material';
import payneLogo from "../assets/payne-logo.png";
import beaconLogo from "../assets/beacon-logo.png";
import desmasdonsLogo from "../assets/desmasdons-logo.png";
import '@fontsource/roboto';
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [marina, setMarina] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const logos = [payneLogo, desmasdonsLogo, beaconLogo];
    const logoColour = ["#3272B4", "#223867", "#222674"];

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, username, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError("Invalid username or password.");
            console.error("Login error:", err.message);
        }
    };

    const lightTheme = createTheme({
        palette: {
            mode: "light",
            background: { default: "#f4f7fa", paper: "#ffffff" },
            text: { primary: "#000000" },
        },
    });

    return (
        <ThemeProvider theme={lightTheme}>
            <Container sx={{ width: '40vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box
                    sx={{
                        backgroundColor: '#fff',
                        padding: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img src={logos[marina]} width="40%" alt="Logo" />

                    <Typography variant="h3" gutterBottom padding="20px" sx={{ fontWeight: "bold", color: logoColour[marina] }}>
                        Welcome
                    </Typography>

                    <form onSubmit={handleLogin} style={{ width: "80%" }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Select value={marina} onChange={(e) => setMarina(e.target.value as number)} fullWidth>
                                <MenuItem value={0}>Payne Marine</MenuItem>
                                <MenuItem value={1}>Desmasdon's Boat Works</MenuItem>
                                <MenuItem value={2}>Beacon Marine</MenuItem>
                            </Select>
                        </Box>

                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && (
                            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{
                                mt: 2,
                                borderRadius: '10px',
                                backgroundColor: logoColour[marina],
                                '&:hover': { backgroundColor: '#015da9' },
                            }}
                        >
                            Login
                        </Button>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default LoginPage;
