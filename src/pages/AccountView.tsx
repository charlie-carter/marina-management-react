import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { Box, Grid, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { Account } from "../models/Account";
import { Charge } from "../models/charges/Charge";
import { Address } from "../models/Address";

const AccountView: React.FC = () => {
    const { id } = useParams(); // Get the account ID from the URL
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    const [charges, setCharges] = useState<Charge[]>([]);

    useEffect(() => {
        const fetchAccount = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "accounts", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // Create an Account instance
                    const account = new Account(
                        data.fName,
                        data.lName,
                        data.email || "",
                        data.address ? new Address(data.address) : null,
                        data.phone || ""
                    );

                    setAccount(account);

                    // Fetch charges if there are references
                    if (data.charges && Array.isArray(data.charges)) {
                        fetchCharges(data.charges);
                    }
                } else {
                    console.error("No such account found!");
                }
            } catch (error) {
                console.error("Error fetching account:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCharges = async (chargeRefs: DocumentData[]) => {
            const chargePromises = chargeRefs.map(async (ref) => {
                if (ref && ref.id) {
                    const chargeDoc = await getDoc(ref);
                    return chargeDoc.exists() ? new Charge(chargeDoc.data()) : null; // Create gas or parking based on type
                }
                return null;
            });

            const chargesData = (await Promise.all(chargePromises)).filter(Boolean) as Charge[];
            setCharges(chargesData);
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
                        <Typography>
                            Address: {account.address ? `${account.address.street}, ${account.address.city}, ${account.address.postalCode}` : "N/A"}
                        </Typography>
                        <Typography>Phone: {account.phone}</Typography>
                        <Typography>Email: {account.email}</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={8}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Recent Charges</Typography>
                        <List>
                            {charges.length > 0 ? (
                                charges.map((charge, index) => (
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
