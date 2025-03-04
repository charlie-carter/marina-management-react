import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Select, MenuItem, createTheme, ThemeProvider } from '@mui/material';
import payneLogo from "../assets/payne-logo.png";
import beaconLogo from "../assets/beacon-logo.png";
import desmasdonsLogo from "../assets/desmasdons-logo.png";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [marina, setMarina] = useState<number>(0);

    const logos = [payneLogo, desmasdonsLogo, beaconLogo];
    const logoColour = ["#3272B4", "#223867", "#222674"];

    const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log("Logging in with", username, password);
    };

    const lightTheme = createTheme({
        palette: {
            mode: "light", // Force light mode
            background: {
                default: "#f4f7fa", // Light gray background
                paper: "#ffffff", // White background for the login box
            },
            text: {
                primary: "#000000", // Ensure text stays black
            },
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
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img src={logos[marina]} width="40%" alt="Logo" />

                    <Typography
                        variant="h3"
                        gutterBottom
                        padding="20px"
                        sx={{
                            fontWeight: "bold",
                            color: logoColour[marina],
                        }}
                    >
                        Welcome
                    </Typography>

                    <form onSubmit={handleLogin} style={{ width: "80%" }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                            <Select
                                labelId="marina-select"
                                id="marina-select"
                                value={marina}
                                onChange={(event) => setMarina(event.target.value as number)}
                            >
                                <MenuItem value={0}>Payne Marine</MenuItem>
                                <MenuItem value={1}>Desmasdon's Boat Works</MenuItem>
                                <MenuItem value={2}>Beacon Marine</MenuItem>
                            </Select>

                        </Box>


                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            type="username"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                        />

                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{
                                mt: 2,
                                borderRadius: '10px',
                                backgroundColor: logoColour[marina],
                                '&:hover': {
                                    backgroundColor: '#015da9',
                                },
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
