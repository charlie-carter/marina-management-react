import React, { useState } from "react";
import { Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Box, Button, Divider, ListItemButton } from "@mui/material";
import GasCharges from "../pages/GasCharges";
import ActiveGuestCarsPage from "../pages/ActiveGuestCarsPage.tsx";
import AccountsPage from "../pages/AccountsPage.tsx";
import {useNavigate} from "react-router-dom";
import ParkingArchive from "./ParkingArchive.tsx";


const menuItems = [
    { label: "Actively Parked Cars", key: "parkedCars", component: <ActiveGuestCarsPage /> },
    { label: "Recent Gas Charges", key: "gasCharges", component: <GasCharges /> },
    { label: "All Accounts", key: "accounts", component: <AccountsPage /> },
    { label: "Parking Archive", key: "archive", component: <ParkingArchive /> },

];

const Dashboard: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState(menuItems[0].key);
    const navigate = useNavigate();

    const handleSignOut = () => {
        console.log("Signing out...");
        navigate("/login");

    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Drawer variant="permanent" sx={{ width: 280, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 280, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", p: 2 } }}>
                <Box>
                    <Toolbar>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>Dashboard</Typography>
                    </Toolbar>
                    <Divider />
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.key}>
                                <ListItemButton onClick={() => setSelectedPage(item.key)} sx={{
                                    "&:hover": { backgroundColor: "#f0f0f0" },
                                    backgroundColor: selectedPage === item.key ? "#d0e7ff" : "transparent",
                                    borderRadius: 2
                                }}>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>

                        ))}
                    </List>
                </Box>
                <Box sx={{ p: 2 }}>
                    <Button variant="contained" color="primary" fullWidth onClick={handleSignOut}>Sign Out</Button>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {menuItems.find((item) => item.key === selectedPage)?.component}
            </Box>
        </Box>
    );
};

export default Dashboard;
