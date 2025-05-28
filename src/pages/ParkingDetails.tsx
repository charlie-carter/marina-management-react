/*
  Copyright © 2025 Charlie Carter
  All rights reserved.

  This file is part of DockDesk.
  Unauthorized copying, modification, or distribution of this software,
  via any medium, is strictly prohibited.

  For licensing inquiries, contact: csc115@outlook.com
*/

import React, { useEffect, useState } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {
    Container,
    Typography,
    Paper,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent, DialogContentText, DialogActions, TextField
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {doc, DocumentReference, getDoc, updateDoc} from "firebase/firestore";
import { db } from "../firebaseConfig";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {CarStructure, GuestParkingStructure} from "../types.ts";

const ParkingDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const parkingId = location.state?.parkingId; // Extract correctly
    const [exitDate, setExitDate] = useState<dayjs.Dayjs>(dayjs());
    const [parking, setParking] = useState<GuestParkingStructure>({
        account: {} as DocumentReference,
        carRef: {} as DocumentReference,
        daysStayed: 0,
        entryDate: "",
        exitDate: "",
        paymentInfo: {
            method: "",
            daysPaidFor: 0,
            chargedDate: "",
        },
    });
    const [car, setCar] = useState<CarStructure>();
    const [openConfirmGone, setOpenConfirmGone] = useState(false);
    const [openMarkPaid, setOpenMarkPaid] = useState(false);
    const [numDaysPaid, setNumDaysPaid] = useState("");

    useEffect(() => {
        if (!parkingId) return;

        const fetchParkingData = async () => {
            try {
                const parkingRef = doc(db, "guestCars", parkingId);
                const parkingSnap = await getDoc(parkingRef);

                if (parkingSnap.exists()) {
                    const parkingData = parkingSnap.data() as GuestParkingStructure;
                    setParking(parkingData);

                    setExitDate(dayjs(parkingData.exitDate));


                    if (parkingData.carRef) {

                        const carDocReference = doc(db, "cars", parkingData.carRef.id); // Fix here
                        const carSnap = await getDoc(carDocReference);

                        if (carSnap.exists()) {
                            setCar(carSnap.data() as CarStructure);
                        }
                    }

                } else {
                    console.error("Parking document not found");
                }
            } catch (error) {
                console.error("Error fetching parking details:", error);
            }
        };


        fetchParkingData();
    }, [parkingId]);

    const handleAddDay = async () => {
        try {
            const parkingRef = doc(db, "guestCars", parkingId);
            const parkingSnap = await getDoc(parkingRef);

            if (parkingSnap.exists()) {
                const parkingData = parkingSnap.data();

                const updatedDaysStayed = (parkingData.daysStayed || 0) + 1;

                await updateDoc(parkingRef, {
                    daysStayed: updatedDaysStayed
                });

                setParking((prev) => ({
                    ...prev,
                    daysStayed: updatedDaysStayed,
                }));

            }
        } catch (error) {
            console.error("Error adding a day:", error);
        }
    };

    const handleRemoveDay = async () => {
        try {
            const parkingRef = doc(db, "guestCars", parkingId);
            const parkingSnap = await getDoc(parkingRef);

            if (parkingSnap.exists()) {
                const parkingData = parkingSnap.data();

                const updatedDaysStayed = parkingData.daysStayed  - 1;

                await updateDoc(parkingRef, {
                    daysStayed: updatedDaysStayed
                });

                setParking((prev: GuestParkingStructure) => ({
                    ...prev,
                    daysStayed: updatedDaysStayed,
                }));

            }
        } catch (error) {
            console.error("Error removing a day:", error);
        }
    };

    const handleMarkGone = async () => {
        try {
            const parkingRef = doc(db, "guestCars", parkingId);
            const parkingSnap = await getDoc(parkingRef);

            if (parkingSnap.exists()) {
                await updateDoc(parkingRef, {
                    status: "departed",
                    exitDate: exitDate.toISOString()
                });

            }

        } catch (error) {
            console.error("Error marking as gone", error);
        }
    }

    const handleOpenConfirmGone = () => {
        setOpenConfirmGone(true);
    };

    const handleCloseConfirmGone = () => {
        setOpenConfirmGone(false);
    };

    const handleConfirmMarkGone = () => {
        handleMarkGone();
        setOpenConfirmGone(false);
        navigate('/dashboard')
    };

    const handleMarkPaid = async () => {
        try {
            const parkingRef = doc(db, "guestCars", parkingId);
            const updatedPaymentInfo = {
                ...parking.paymentInfo,
                method: "prepaid",
                daysPaidFor: parseInt(numDaysPaid),
                chargedDate: new Date().toISOString(),
            };

            await updateDoc(parkingRef, {
                paymentInfo: updatedPaymentInfo
            });

            setParking((prev) => ({
                ...prev,
                paymentInfo: updatedPaymentInfo,
            }));
        } catch (error) {
            console.error("Error marking as paid", error);
        }
    };


    const handleOpenMarkPaid = () => {
        setOpenMarkPaid(true);
    };

    const handleCloseMarkPaid = () => {
        setOpenMarkPaid(false);
    };

    const handleConfirmMarkPaid = () => {
        handleMarkPaid();
        setOpenMarkPaid(false);
    };

    const paidDetails = () => {
        const method = parking.paymentInfo?.method;
        if (method === "prepaid") {
            return `Paid for ${parking.paymentInfo.daysPaidFor} days.`;
        } else if (method === "account") {
            return (
                <span>
                To be charged on account:{" "}
                    <Link to={`/account-view/${parking.account.id}`}>
                    {parking.account.id}
                </Link>
            </span>
            );
        } else {
            return "Unpaid";
        }
    };


    const paidWarning = () => {
        const method = parking.paymentInfo?.method;
        if (method === "account") {
            return `Warning! This parking is to be charged out to account: ${parking.account?.id}. Please ensure it has been charged before marking as gone.`;
        } else if (method === "prepaid") {
            return "Are you sure you want to mark this car as gone? This action cannot be undone.";
        } else {
            return "Warning! This parking has not been paid for yet! Are you sure you want to mark this car as gone?";
        }
    };


    const paidButton = () => {
        const method = parking.paymentInfo?.method;
        if (method !== "prepaid" && method !== "account") {
            return <Button variant="contained" onClick={handleOpenMarkPaid} sx={{ width: '90%', margin: 2 }}>Mark As Paid</Button>;
        } else if (method === "prepaid") {
            return <Button variant="contained" onClick={handleOpenMarkPaid} sx={{ width: '90%', margin: 2 }}>Update Days Paid</Button>;
        }
    };


    if (!car) {
        return (
            <Container>
                <Typography variant="h5">Loading car details...</Typography>
            </Container>
        );
    }



    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}>
                Car Details
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 4 }}>
                {/* Car Image */}
                <Paper sx={{ p: 3, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {car.photoUrl ? (
                        <img src={car.photoUrl} alt="Car" style={{ maxWidth: "100%", borderRadius: 8, maxHeight: "300px" }} />
                    ) : (
                        <Typography variant="body2">No image available</Typography>
                    )}
                </Paper>

                {/* Car Details */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold">Owner Information</Typography>
                    <Typography><strong>Owner:</strong> {car.ownerName}</Typography>
                    <Typography><strong>Phone:</strong> {car.contactInfo}</Typography>
                    <Typography><strong>License Plate:</strong> {car.licensePlate}</Typography>
                    <Typography><strong>Vehicle:</strong> {car.make} {car.type}</Typography>
                    <Typography><strong>Colour:</strong> {car.colour}</Typography>
                </Paper>

                {/* Parking Details */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold">Parking Information</Typography>
                    <Typography><strong>Days Parked:</strong> {parking.daysStayed}</Typography>
                    <Typography><strong>Date Arrived:</strong> {parking.entryDate}</Typography>
                    <Typography><strong>Date Leaving:</strong> {parking.exitDate ? parking.exitDate : "Unknown"}</Typography>

                    {/* Add/Remove Day Buttons */}
                    <Box sx={{ display: "flex", gap: 2, my: 2 }}>
                        <Button variant="contained" color="success" onClick={handleAddDay} startIcon={<AddIcon />}>
                            Add Day
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleRemoveDay}>
                            Remove Day
                        </Button>
                    </Box>

                    <Typography variant="h6" fontWeight="bold">Payment Status: {paidDetails()}</Typography>
                    {paidButton()}

                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleOpenConfirmGone}
                    >
                        Mark As Gone
                    </Button>
                </Paper>
            </Box>

            {/* Back Button */}
            <Button variant="contained" sx={{ mt: 4 }} onClick={() => navigate(-1)}>
                Back to List
            </Button>

            {/* Confirm Departure Dialog */}
            <Dialog open={openConfirmGone} onClose={handleCloseConfirmGone}>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogContent>
                    <DialogContentText>{paidWarning()}</DialogContentText>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
                        <DialogContentText><strong>Please confirm departure date:</strong></DialogContentText>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Departure"
                                value={exitDate}
                                onChange={(date) => setExitDate(date as dayjs.Dayjs)}
                            />
                        </LocalizationProvider>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmGone} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmMarkGone} color="error" variant="contained">Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Mark Paid Dialog */}
            <Dialog open={openMarkPaid} onClose={handleCloseMarkPaid}>
                <DialogTitle>Enter Days Paid For</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Days Paid For"
                        fullWidth
                        type="number"
                        onChange={(e) => setNumDaysPaid(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMarkPaid} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmMarkPaid} color="success" variant="contained">Confirm</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );

};

export default ParkingDetails;
