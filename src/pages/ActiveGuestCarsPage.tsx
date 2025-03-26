import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, DocumentData, DocumentSnapshot, getDoc, onSnapshot } from "firebase/firestore";
import { Container, Typography, Paper, Grid, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
    // To add a photo field
    // {
    //     field: "photo",
    //     headerName: "Photo",
    //     width: 100,
    //     renderCell: (params) => (
    //     params.value ? (
    //         <Avatar src={params.value} variant="rounded" sx={{ width: 60, height: 40 }} />
    //     ) : (
    //         <Typography variant="body2">No Image</Typography>
    //     )
    //     ),
    //     sortable: false,
    //     filterable: false,
    // },
    { field: "licensePlate", headerName: "License Plate", width: 150 },
    { field: "ownerName", headerName: "Owner Name", width: 180 },
    { field: "carColour", headerName: "Colour", width: 100 },
    { field: "carMake", headerName: "Make", width: 100 },
    { field: "carType", headerName: "Type", width: 100 },
    { field: "entryDateFormatted", headerName: "Entry Date", width: 130 },
    { field: "accountName", headerName: "Account", width: 200 },
];

const ActiveGuestCarsPage: React.FC = () => {
    const [guestCars, setGuestCars] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "guestCars"), async (snapshot) => {
            const carData = await Promise.all(
                snapshot.docs.map(async (docSnapshot) => {
                    const car = docSnapshot.data();
                    let accountName = "No Account";
                    let carMake = "Unknown";
                    let carType = "Unknown";
                    let carColour = "Unknown";
                    let licensePlate = "Unknown";
                    let ownerName = "Unknown";
                    let entryDateFormatted = "Unknown";
        
                    if (car.account) {
                        try {
                            const accountDoc = await getDoc(car.account);
                            if (accountDoc.exists()) {
                                const accountData = accountDoc.data();
                                accountName = `${accountData.fName || ""} ${accountData.lName || ""}`.trim();
                            }
                        } catch (error) {
                            console.error("Error fetching account:", error);
                        }
                    }
        
                    if (car.carRef) {
                        try {
                            const carDoc = await getDoc(car.carRef);
                            if (carDoc.exists()) {
                                const carInfo = carDoc.data();
                                licensePlate = `${carInfo.licensePlate}`;
                                carMake = `${carInfo.make}`;
                                carType = `${carInfo.type}`;
                                carColour = `${carInfo.colour}`;
                                ownerName = `${carInfo.ownerName}`;
                            }
                        } catch (error) {
                            console.error("Error fetching car:", error);
                        }
                    }
        
                    if (car.entryDate) {
                        const entryDateObject = car.entryDate.toDate ? car.entryDate.toDate() : new Date(car.entryDate);
                        entryDateFormatted = entryDateObject.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
                    }
        
                    return {
                        id: docSnapshot.id,
                        ...car,
                        accountName,
                        licensePlate,
                        carMake,
                        carType,
                        carColour,
                        ownerName,
                        entryDateFormatted, 
                    };
                })
            );
        
            setGuestCars(carData);
        });
        
    
        return () => unsubscribe();
      }, []);
    

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Active Guest Parked Cars
            </Typography>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => navigate("/add-car")}>
                Add New Car
            </Button>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12}>
                    <Paper sx={{ padding: 2 }}>
                        <div style={{ height: 400, width: "100%" }}>
                            <DataGrid
                                rows={guestCars}
                                columns={columns}
                                pageSize={5}
                                onRowClick={(params) => {
                                    // Convert Firestore Timestamp to ISO string if necessary
                                    const carData = {
                                        ...params.row,
                                        entryTime: params.row.entryTime?.toDate?.().toISOString() || params.row.entryTime,
                                        account: params.row.account?.id || null, // Convert Firestore document reference to just the ID
                                    };

                                    navigate(`/car-details/${params.row.id}`, { state: carData });
                                }}
                            />

                        </div>
                    </Paper>
                </Grid>
            </Grid>

        </Container>
    );
};

export default ActiveGuestCarsPage;
