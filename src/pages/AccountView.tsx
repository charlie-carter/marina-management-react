import React, { useEffect, useState } from "react";
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

const AccountView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [account, setAccount] = useState<any>(null);
    const [editableAccount, setEditableAccount] = useState<any>(null);
    const [cars, setCars] = useState<any[]>([]);
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

                    const guestCarsQuery = query(
                        collection(db, "guestCars"),
                        where("account", "==", accountRef)
                    );
                    const guestCarsSnap = await getDocs(guestCarsQuery);

                    const guestCarsData = await Promise.all(
                        guestCarsSnap.docs.map(async (docSnap) => {
                            const guestCar = docSnap.data();
                            const carRef = guestCar.carRef;
                            const carSnap = await getDoc(carRef);
                            return {
                                id: docSnap.id,
                                ...guestCar,
                                carDetails: carSnap.exists() ? carSnap.data() : {},
                            };
                        })
                    );

                    setCars(guestCarsData);
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
                Parking History
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table size="small">
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableRow>
                            <TableCell><strong>License Plate</strong></TableCell>
                            <TableCell><strong>Entry Date</strong></TableCell>
                            <TableCell><strong>Exit Date</strong></TableCell>
                            <TableCell><strong>Days Stayed</strong></TableCell>
                            <TableCell><strong>On Account?</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cars.length > 0 ? (
                            cars.map((car, index) => (
                                <TableRow key={car.id} sx={{ backgroundColor: index % 2 === 0 ? "#fafafa" : "white" }}>
                                    <TableCell>{car.carDetails.licensePlate || "Unknown"}</TableCell>
                                    <TableCell>{car.entryDate?.split("T")[0]}</TableCell>
                                    <TableCell>{car.exitDate ? car.exitDate.split("T")[0] : "N/A"}</TableCell>
                                    <TableCell>{car.daysStayed ?? "N/A"}</TableCell>
                                    <TableCell>{car.onAccount ? "Charged to Account" : "Not on Account"}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No parking history found.</TableCell>
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
