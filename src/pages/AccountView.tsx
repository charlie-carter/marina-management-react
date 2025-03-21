import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Box, Grid, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { Account } from "../models/Account";  // Import the Account class
import { Charge } from "../models/charges/Charge";  // Import Charge class
import { Address } from "../models/Address";  // Import Address class

const AccountView: React.FC = () => {
    const { id } = useParams(); // Get the account ID from the URL
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccount = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "accounts", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // Transform Firestore data into an Account instance
                    const account = new Account(
                        data.fName,
                        data.lName,
                        data.email || "",
                        data.address ? new Address(data.address) : null,
                        data.phone || ""
                    );

                    // Add charges to account
                    // if (data.charges && Array.isArray(data.charges)) {
                    //     data.charges.forEach((chargeData: any) => {
                    //         const charge = new Charge(chargeData.amount, chargeData.description);
                    //         account.addCharge(charge);
                    //     });
                    // }

                    setAccount(account);
                } else {
                    console.error("No such account found!");
                }
            } catch (error) {
                console.error("Error fetching account:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAccount();
    }, [id]);

    if (loading) return <Typography>Loading account details...</Typography>;
    if (!account) return <Typography>No account found.</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Customer Account: {account.name}
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Customer Information</Typography>
                        <Typography>Address: {account.address ? `${account.address.street}, ${account.address.city}, ${account.address.postalCode}` : "N/A"}</Typography>
                        <Typography>Phone: {account.phone}</Typography>
                        <Typography>Email: {account.email}</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={8}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Recent Charges</Typography>
                        <List>
                            {account.charges.length > 0 ? (
                                account.charges.map((charge, index) => (
                                    <ListItem key={index} button onClick={() => console.log("Navigate to charge details")}>
                                        <ListItemText primary={`$${charge.amount}`} secondary={charge.description} />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No recent charges.</Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AccountView;
