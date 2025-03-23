import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDoc, onSnapshot } from "firebase/firestore";
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
    { field: "colour", headerName: "Colour", width: 100 },
    { field: "make", headerName: "Make", width: 100 },
    { field: "type", headerName: "Type", width: 100 },
    { field: "entryTime", headerName: "Entry Time", width: 120 },
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
    
              // Check if the account field exists and is a Firestore document reference
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
    
              return {
                id: docSnapshot.id,
                ...car,
                accountName, // ✅ Add the account's full name
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
