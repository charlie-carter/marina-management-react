/*
  Copyright © 2025 Charlie Carter
  All rights reserved.

  This file is part of DockDesk.
  Unauthorized copying, modification, or distribution of this software,
  via any medium, is strictly prohibited.

  For licensing inquiries, contact: csc115@outlook.com
*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
    Container,
    Typography,
    Paper,
    Box,
    CircularProgress,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Grid,
    TextField,
} from "@mui/material";
import {AccountStructure, CarStructure, ChargeStructure} from "../types.ts";

const AccountView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [account, setAccount] = useState<AccountStructure>();
    const [editableAccount, setEditableAccount] = useState<AccountStructure>();
    const [charges, setCharges] = useState<ChargeStructure[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountRef = doc(db, "accounts", id!);
                const accountSnap = await getDoc(accountRef);

                if (accountSnap.exists()) {
                    const accountData = accountSnap.data();
                    setAccount(accountData);
                    setEditableAccount(accountData);

                    const chargeQuery = query(
                        collection(db, "charges"),
                        where("account", "==", accountRef)
                    );
                    const chargeSnap = await getDocs(chargeQuery);

                    const chargeData = await Promise.all(
                        chargeSnap.docs.map(async (docSnap) => {
                            const charge = docSnap.data();

                            const chargeDoc = await getDoc(charge.ref);
                            let amount: number = -99;
                            let link: string = "";
                            if (chargeDoc.exists()) {
                                if (charge.type === "GAS") {
                                    const data = chargeDoc.data() as { amount: number};
                                    amount = data.amount;
                                    link = `/gas-details/${docSnap.id}`
                                } else if (charge.type === "PARKING") {
                                    const data = chargeDoc.data() as { daysStayed: number};
                                    amount = data.daysStayed;
                                    link = `/car-details/${docSnap.id}`
                                }

                            }

                            return {
                                id: docSnap.id,
                                ...charge,
                                amount,
                                link

                            };
                        })
                    );

                    setCharges(chargeData);
                }
            } catch (error) {
                console.error("Error fetching account:", error);
            }

            setLoading(false);
        };

        fetchData();
    }, [id]);

    const handleFieldChange = (field: string, value: any) => {
        setEditableAccount((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddressChange = (field: string, value: any) => {
        setEditableAccount((prev: any) => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: value,
            },
        }));
    };

    const handleSave = async () => {
        if (!editableAccount || !id) return;
        setSaving(true);

        try {
            const accountRef = doc(db, "accounts", id);
            await updateDoc(accountRef, editableAccount);
            setAccount(editableAccount);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating account:", err);
        }

        setSaving(false);
    };

    const handleCancel = () => {
        setEditableAccount(account);
        setIsEditing(false);
    };

    const isChanged = JSON.stringify(account) !== JSON.stringify(editableAccount);

    if (loading) {
        return (
            <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!account) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography variant="h6" color="error">
                    Account not found.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold">Account Details</Typography>
                    {!isEditing && (
                        <Button variant="outlined" onClick={() => setIsEditing(true)}>
                            Edit
                        </Button>
                    )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                    {/* Left side: Name, Phone, Email */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {isEditing ? (
                                    <TextField
                                        label="First Name"
                                        value={editableAccount.fName || ""}
                                        onChange={(e) => handleFieldChange("fName", e.target.value)}
                                        fullWidth
                                    />
                                ) : (
                                    <Typography><strong>First Name:</strong> {account.fName}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                {isEditing ? (
                                    <TextField
                                        label="Last Name"
                                        value={editableAccount.lName || ""}
                                        onChange={(e) => handleFieldChange("lName", e.target.value)}
                                        fullWidth
                                    />
                                ) : (
                                    <Typography><strong>Last Name:</strong> {account.lName}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                {isEditing ? (
                                    <TextField
                                        label="Phone"
                                        value={editableAccount.phone || ""}
                                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                                        fullWidth
                                    />
                                ) : (
                                    <Typography><strong>Phone:</strong> {account.phone}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                {isEditing ? (
                                    <TextField
                                        label="Email"
                                        value={editableAccount.email || ""}
                                        onChange={(e) => handleFieldChange("email", e.target.value)}
                                        fullWidth
                                    />
                                ) : (
                                    <Typography><strong>Email:</strong> {account.email}</Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Right side: Address */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            {["street", "city", "province", "country", "postalCode"].map((field) => (
                                <Grid item xs={12} key={field}>
                                    {isEditing ? (
                                        <TextField
                                            label={field[0].toUpperCase() + field.slice(1)}
                                            value={editableAccount.address?.[field] || ""}
                                            onChange={(e) => handleAddressChange(field, e.target.value)}
                                            fullWidth
                                        />
                                    ) : (
                                        <Typography>
                                            <strong>{field[0].toUpperCase() + field.slice(1)}:</strong> {account.address?.[field]}
                                        </Typography>
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>


                <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                    {isEditing && (
                        <>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                disabled={!isChanged || saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button variant="text" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </>
                    )}
                </Box>
            </Paper>

            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Account History
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table size="small" onClick={navigate()}>
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableRow>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Amount</strong></TableCell>
                            <TableCell><strong>Date Paid</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {charges.length > 0 ? (
                            charges.map((charge, index) => (
                                <TableRow key={charge.id} sx={{ backgroundColor: charge.paid ? index % 2 === 0 ? "#fafafa" : "white" : "red" }}>
                                    <TableCell>{charge.type || "Unknown"}</TableCell>
                                    <TableCell>{charge.type === "GAS" ? charge.amount + " Litres" : charge.amount + " Days"}</TableCell>
                                    <TableCell>{charge.paidAt ? charge.paidAt: "N/A"}</TableCell>
                                    <TableCell>{charge.paid ? "Paid" : "Unpaid"}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No account history found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button variant="outlined" size='large' onClick={() => navigate(-1)} sx={{marginTop: 4}}>
                Back
            </Button>
        </Container>
    );
};

export default AccountView;
