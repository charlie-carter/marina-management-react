/*
  Copyright © 2025 Charlie Carter
  All rights reserved.

  This file is part of DockDesk.
  Unauthorized copying, modification, or distribution of this software,
  via any medium, is strictly prohibited.

  For licensing inquiries, contact: csc115@outlook.com
*/

import React, {useEffect, useState} from "react";
import {db} from "../firebaseConfig";
import {collection, getDoc, onSnapshot, query, where} from "firebase/firestore";
import {Container, Typography, Paper} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {AccountStructure, CarStructure, OverstayedCarsStructure} from "../types.ts";
import {useNavigate} from "react-router-dom";

const columns: GridColDef[] = [
    {field: "licensePlate", headerName: "License Plate", width: 150},
    {field: "ownerName", headerName: "Owner Name", width: 180},
    {field: "carColour", headerName: "Colour", width: 100},
    {field: "carMake", headerName: "Make", width: 100},
    {field: "carType", headerName: "Type", width: 100},
    {field: "exitDateFormatted", headerName: "Expected Exit Date", width: 130},
    {field: "daysPaid", headerName: "Days Paid", width: 130},
    {field: "daysStayed", headerName: "Days Stayed", width: 130},
    {field: "status", headerName: "Here/Departed?", width: 130},
    {field: "accountName", headerName: "Account", width: 200},
];

const OverstayedCars: React.FC = () => {
    const [guestCars, setGuestCars] = useState<OverstayedCarsStructure[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const guestCarsQuery = query(
            collection(db, "guestCars"),
            where("paymentInfo.method", "==", "prepaid")
        );

        const unsubscribe = onSnapshot(guestCarsQuery, async (snapshot) => {
            const rawCarData = await Promise.all(
                snapshot.docs.map(async (docSnapshot) => {
                    const car = docSnapshot.data();

                    const daysStayed = car.daysStayed || 0;
                    const daysPaid = car.paymentInfo?.daysPaidFor || 0;

                    if (daysStayed <= daysPaid) return null;

                    let accountName = "No Account";
                    let carMake = "Unknown";
                    let licensePlate = "Unknown";
                    let ownerName = "Unknown";
                    let carType = car.carType || "Unknown";
                    let exitDateFormatted = "Unknown";

                    if (car.account) {
                        try {
                            const accountDoc = await getDoc(car.account);
                            if (accountDoc.exists()) {
                                const accountData: AccountStructure = accountDoc.data() as AccountStructure;
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
                                const carInfo: CarStructure = carDoc.data() as CarStructure;
                                licensePlate = carInfo.licensePlate || "Unknown";
                                carMake = carInfo.make || "Unknown";
                                ownerName = carInfo.ownerName || "Unknown";
                                carType = carInfo.type || "Unknown";
                            }
                        } catch (error) {
                            console.error("Error fetching car:", error);
                        }
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
                        car,
                        accountName,
                        ownerName,
                        licensePlate,
                        carMake,
                        carType,
                        daysStayed,
                        daysPaid,
                        status: car.status === "active" ? "Still Parked" : "Departed",
                        exitDateFormatted,
                    } satisfies OverstayedCarsStructure;
                })
            );

            const cleaned = rawCarData.filter((c): c is OverstayedCarsStructure => c !== null);
            setGuestCars(cleaned);
        });

        return () => unsubscribe();
    }, []);


    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Overstayed Cars
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
                        onRowClick={(params) => {
                            navigate(`/car-details/${params.row.id}`, { state: { parkingId: params.row.id } });
                        }}

                    />

                </div>
            </Paper>

        </Container>
    );
};

export default OverstayedCars;
