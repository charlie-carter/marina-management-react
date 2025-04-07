import React, {useEffect, useState} from "react";
import {db} from "../firebaseConfig";
import {collection, getDoc, onSnapshot} from "firebase/firestore";
import {Container, Typography, Paper} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

const columns: GridColDef[] = [
    {field: "licensePlate", headerName: "License Plate", width: 150},
    {field: "ownerName", headerName: "Owner Name", width: 180},
    {field: "carColour", headerName: "Colour", width: 100},
    {field: "carMake", headerName: "Make", width: 100},
    {field: "carType", headerName: "Type", width: 100},
    {field: "entryDateFormatted", headerName: "Entry Date", width: 130},
    {field: "exitDateFormatted", headerName: "Exit Date", width: 130},
    {field: "accountName", headerName: "Account", width: 200},
];

const ParkingArchive: React.FC = () => {
    const [guestCars, setGuestCars] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "guestCars"), async (snapshot) => {
            const carData = await Promise.all(
                snapshot.docs.map(async (docSnapshot) => {
                    const car = docSnapshot.data();

                    if (car.active === true) return null;

                    let accountName = "No Account";
                    let carMake = "Unknown";
                    let carType = "Unknown";
                    let carColour = "Unknown";
                    let licensePlate = "Unknown";
                    let ownerName = "Unknown";
                    let entryDateFormatted = "Unknown";
                    let exitDateFormatted = "Unknown";

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
                        entryDateFormatted = entryDateObject.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        });
                    }

                    if (car.exitDate) {
                        const exitDateObject = car.exitDate.toDate ? car.exitDate.toDate() : new Date(car.exitDate);
                        exitDateFormatted = exitDateObject.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        });
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
                        exitDateFormatted
                    };
                })
            );

            setGuestCars(carData.filter(car => car !== null));
        });


        return () => unsubscribe();
    }, []);


    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Guest Parking Archive
            </Typography>

                    <Paper sx={{padding: 2}}>
                        <div style={{height: 400, width: "100%"}}>
                            <DataGrid
                                rows={guestCars}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 20,
                                        },
                                    },
                                }}
                                pageSizeOptions={[20]}
                                disableRowSelectionOnClick
                            />

                        </div>
                    </Paper>

        </Container>
    );
};

export default ParkingArchive;
