/*
  Copyright © 2025 Charlie Carter
  All rights reserved.

  This file is part of DockDesk.
  Unauthorized copying, modification, or distribution of this software,
  via any medium, is strictly prohibited.

  For licensing inquiries, contact: csc115@outlook.com
*/

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {db} from "../firebaseConfig";
import {collection, addDoc, doc, setDoc, query, where, getDocs, Timestamp} from "firebase/firestore";
import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    FormControlLabel, Checkbox
} from "@mui/material";
import dayjs from 'dayjs';
import {commonCarMakes} from "../assets/CarBrands";
import {DesktopDatePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import { MuiTelInput } from 'mui-tel-input'
import {Today} from "@mui/icons-material";
import {AccountStructure, CarStructure} from "../types.ts";

const carColours = ["Black", "White", "Silver", "Grey", "Blue", "Red", "Green", "Yellow", "Beige"];
const carTypes = ["Sedan", "SUV", "Truck", "Minivan", "Van"];

const AddGuestCar: React.FC = () => {
    const [licensePlate, setLicensePlate] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerContact, setOwnerContact] = useState("");
    const [selectedMake, setSelectedMake] = useState("");
    const [selectedType, setSelectedModel] = useState("");
    const [selectedColour, setSelectedColour] = useState("");
    const [accounts, setAccounts] = useState<AccountStructure[]>([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [entryDate, setEntryDate] = useState(dayjs());
    const [exitDate, setExitDate] = useState<dayjs.Dayjs | null>(null);
    const [onAccount, setOnAccount] = useState(false);
    const [prepaid, setPrepaid] = useState(false);
    const [daysPaid, setDaysPaid] = useState("");
    const [notes, setNotes] = useState("");
    const [lastAccount, setLastAccount] = useState("");


    const navigate = useNavigate();
    const carMakes = commonCarMakes;

    useEffect(() => {
        const fetchAccounts = async () => {
            const querySnapshot = await getDocs(collection(db, "accounts"));
            const accountData: AccountStructure[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<AccountStructure, "id">),
            }));
            setAccounts(accountData);
        };

        fetchAccounts();
    }, []);

    useEffect(() => {
        if (!selectedAccount) {
            setOnAccount(false);
        }
    }, [selectedAccount]);


    const handleLicensePlateChange = async (plate: string) => {
        setLicensePlate(plate);

        if (plate.length > 3) { // Simple check to avoid unnecessary queries
            const carQuery = query(collection(db, "cars"), where("licensePlate", "==", plate));
            const querySnapshot = await getDocs(carQuery);

            if (!querySnapshot.empty) {
                const carData = querySnapshot.docs[0].data();
                setOwnerName(carData.ownerName);
                setSelectedMake(carData.make);
                setSelectedModel(carData.type);
                setSelectedColour(carData.colour);
                setOwnerContact(carData.contactInfo);
                setNotes(carData.notes);
                setLastAccount(carData.lastKnownAccount.id);

            } else {
                setOwnerName("");
                setSelectedMake("");
                setSelectedModel("");
                setSelectedColour("");
                setOwnerContact("");
                setLastAccount("");
                setNotes("");
            }
        }
    };



    const handleAddCar = async () => {
        try {
            let carRef;
            let existingCarData = null;

            // Check if car exists in "cars" collection
            const carQuery = query(collection(db, "cars"), where("licensePlate", "==", licensePlate));
            const querySnapshot = await getDocs(carQuery);

            if (!querySnapshot.empty) {

                // Car exists, use its reference
                const existingCarDoc = querySnapshot.docs[0];
                carRef = doc(db, "cars", existingCarDoc.id);
                existingCarData = existingCarDoc.data(); // Store existing car data
            } else {
                // Car doesn't exist, create new document
                const newCarRef = doc(collection(db, "cars"));
                await setDoc(newCarRef, {
                    licensePlate,
                    ownerName,
                    make: selectedMake,
                    type: selectedType,
                    colour: selectedColour,
                    contactInfo: ownerContact,
                    notes: notes,
                    lastKnownAccount: selectedAccount
                });
                carRef = newCarRef;
            }

            // If car exists, update its notes & lastKnownAccount if needed
            const updatedFields: Partial<CarStructure> = {};

            if (existingCarData) {
                if (existingCarData.notes !== notes) {
                    updatedFields.notes = notes;
                }

                if (
                    selectedAccount &&
                    existingCarData.lastKnownAccount?.id !== selectedAccount
                ) {
                    updatedFields.lastKnownAccount = doc(db, "accounts", selectedAccount);
                }

                if (Object.keys(updatedFields).length > 0) {
                    await setDoc(carRef, updatedFields, { merge: true });
                }
            }


            const paymentInfo = {
                method: prepaid ? 'prepaid' : onAccount && selectedAccount ? 'account' : 'unpaid',
                daysPaidFor: prepaid? daysPaid: 0,
                chargedDate: prepaid? Today.toString() : null,

            }


            const guestCarData = {
                carRef,
                account: selectedAccount ? doc(db, "accounts", selectedAccount) : null,
                entryDate: Timestamp.fromDate(entryDate.toDate()),
                exitDate: exitDate ? Timestamp.fromDate(exitDate.toDate()) : null,
                daysStayed: 1,
                paymentInfo: paymentInfo,
                status: "active"
            };

            await addDoc(collection(db, "guestCars"), guestCarData);

            navigate("/dashboard");
        } catch (error) {
            console.error("Error adding car:", error);
        }
    };

    return (
        <Container>
            <Paper sx={{p: 3, mt: 3}}>
                <Typography variant="h5" gutterBottom>
                    Add New Guest Car
                </Typography>
                <TextField
                    label="License Plate"
                    fullWidth
                    margin="normal"
                    value={licensePlate}
                    onChange={(e) => handleLicensePlateChange(e.target.value.toUpperCase())}
                />

                <Box>
                    <TextField
                        label="Owner Name"
                        sx={{width: '50%'}}
                        margin="normal"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                    />

                    <MuiTelInput
                        label="Owner Contact"
                        defaultCountry='CA'
                        sx={{width: '49%', ml: '10px'}}
                        margin="normal"
                        value={ownerContact}
                        onChange={(value) => {setOwnerContact(value)}}
                    />

                </Box>


                {/* Select Car Make */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Make</InputLabel>
                    <Select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)}>
                        {carMakes.map((make) => (
                            <MenuItem key={make} value={make}>
                                {make}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Select Car Model */}
                <FormControl fullWidth margin="normal" disabled={!selectedMake}>
                    <InputLabel>Type</InputLabel>
                    <Select value={selectedType} onChange={(e) => setSelectedModel(e.target.value)}>
                        {carTypes.map((model) => (
                            <MenuItem key={model} value={model}>
                                {model}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Select Car Color */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Colour</InputLabel>
                    <Select value={selectedColour} onChange={(e) => setSelectedColour(e.target.value)}>
                        {carColours.map((colour) => (
                            <MenuItem key={colour} value={colour}>
                                {colour}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Additional Notes"
                    sx={{width: '100%'}}
                    margin="normal"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                {/* Select Account */}

                <FormControl fullWidth margin="normal">
                    <InputLabel>Account (Optional)</InputLabel>
                    <Select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
                        <MenuItem value="">No Account</MenuItem>
                        {accounts.map((data) => (
                            <MenuItem key={data.id} value={data.id}>
                                {data.fName} {data.lName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography>Last known account: {lastAccount ? lastAccount : "Unknown"}</Typography>

                {/* Date Pickers */}
                <Box sx={{display: "flex", gap: 2, mt: 2}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date Arrived"
                            value={entryDate}
                            onChange={(date) => setEntryDate(date || dayjs())}

                        />
                        <DesktopDatePicker
                            label="Expected Departure"
                            value={exitDate}
                            onChange={(date) => setExitDate(date)}
                        />
                    </LocalizationProvider>

                    <FormControlLabel
                        control={
                            <Checkbox
                                size='large'
                                checked={prepaid}
                                onChange={(e) => {setPrepaid(e.target.checked)}}
                                color='info'
                            />
                        }
                        label="Prepaid?"
                    />
                    {prepaid?
                        <TextField
                            label="Days Paid For"
                            onChange={(e) => {setDaysPaid(e.target.value)}}
                            type='number'
                        /> : <FormControlLabel
                        control={
                            <Checkbox
                                size='large'
                                checked={selectedAccount !== "" ? onAccount : false}
                                onChange={(e) => {setOnAccount(e.target.checked)}}
                                disabled={!selectedAccount}
                                color='info'
                            />}
                        label="On Account?"
                    />}

                </Box>

                <Box >
                    <Button variant="contained" color="primary" sx={{mt: 2, mr: 1}} onClick={handleAddCar}>
                        Save Car
                    </Button>

                    <Button variant="outlined" color="primary" sx={{mt: 2, ml: 1}} onClick={() => {navigate(`/dashboard`)}}>
                        Cancel
                    </Button>

                </Box>

            </Paper>
        </Container>
    );
};

export default AddGuestCar;
