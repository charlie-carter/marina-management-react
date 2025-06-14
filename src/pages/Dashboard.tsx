/*
  Copyright © 2025 Charlie Carter
  All rights reserved.

  This file is part of DockDesk.
  Unauthorized copying, modification, or distribution of this software,
  via any medium, is strictly prohibited.

  For licensing inquiries, contact: csc115@outlook.com
*/

import React, { useState } from "react";
import { Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Box, Button, Divider, ListItemButton } from "@mui/material";
import {signOut, getAuth} from "firebase/auth";
import ActiveGuestCarsPage from "../pages/ActiveGuestCarsPage.tsx";
import AccountsPage from "../pages/AccountsPage.tsx";
import {useNavigate} from "react-router-dom";
import ParkingArchive from "./ParkingArchive.tsx";
import ChargesView from "./ChargesView.tsx";
import OverstayedCars from "./OverstayedCars.tsx";
import payneLogo from "../assets/payne-logo.png";


const menuItems = [
    { label: "Actively Parked Cars", key: "parkedCars", component: <ActiveGuestCarsPage /> },
    { label: "To Charge Out", key: "charges", component: <ChargesView /> },
    { label: "Overstayed Cars", key: "overstayed", component: <OverstayedCars /> },
    { label: "All Accounts", key: "accounts", component: <AccountsPage /> },
    { label: "Parking Archive", key: "archive", component: <ParkingArchive /> },


];

const Dashboard: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState(menuItems[0].key);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSignOut = () => {
        console.log("Signing out...");
        navigate("/login");
        signOut(auth);

    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Drawer variant="permanent" sx={{ width: 280, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 280, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", p: 2 } }}>
                <Box>
                    <img src={payneLogo} width="100%" alt="Logo"/>
                    <Toolbar>
                        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", flexGrow: 1 }}>DockDesk</Typography>
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
                    <Divider sx={{marginTop: 2, marginBottom: 1.5}}/>
                    <Typography>© Numana Software 2025</Typography>
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
