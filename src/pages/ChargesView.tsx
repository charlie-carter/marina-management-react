/*
  Copyright © 2025 Charlie Carter
  All rights reserved.

  This file is part of DockDesk.
  Unauthorized copying, modification, or distribution of this software,
  via any medium, is strictly prohibited.

  For licensing inquiries, contact: csc115@outlook.com
*/

import React, { useEffect, useState } from "react";
import {Button, Container, Paper, Typography} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {collection, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import { db } from "../firebaseConfig.ts";
import {AccountStructure, ChargeStructure} from "../types.ts";

const ChargesView: React.FC = () => {
    const columns: GridColDef[] = [
        { field: "type", headerName: "Type", width: 150 },
        { field: "amount", headerName: "Amount", width: 120 },
        { field: "account", headerName: "Account", width: 280 },
        { field: "done",
            headerName: "Done?",
            width: 180,
            renderCell: params => <Button variant="contained" color="success" onClick={() => handleChargeDone(params.row.id)}>Charged Out</Button>},
    ];

    const [charges, setCharges] = useState<ChargeStructure[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "charges"), async (snapshot) => {
            const chargeData = await Promise.all(
                snapshot.docs.map(async (docSnapshot) => {
                    const charge = docSnapshot.data();

                    if (charge.paid === true) return null;

                    const type = charge.type;
                    let amount = 0;
                    let account = "unknown";

                    if (charge.account) {
                        try {
                            const accountDoc = await getDoc(charge.account);
                            if (accountDoc.exists()) {
                                const accountData: AccountStructure = accountDoc.data() as AccountStructure;
                                account = `${accountData.fName || ""} ${accountData.lName || ""}`.trim();
                            }
                        } catch (error) {
                            console.error("Error fetching account:", error);
                        }
                    }

                    if (charge.ref) {
                        try {
                            if (type === "GAS") {
                                const chargeDoc = await getDoc(charge.ref);
                                if (chargeDoc.exists()) {
                                    const data = chargeDoc.data() as { amount: number};
                                    amount = data.amount;
                                }
                            } else if (type === "PARKING") {
                                const chargeDoc = await getDoc(charge.ref);
                                if (chargeDoc.exists()) {
                                    const data = chargeDoc.data() as { daysStayed: number};
                                    amount = data.daysStayed;
                                }
                            }

                        } catch (error) {
                            console.error("Error fetching amount:", error);
                        }
                    }

                    return {
                        id: docSnapshot.id,
                        type,
                        amount,
                        account,
                    };
                })
            );

            setCharges(chargeData);
        });

        return () => unsubscribe();
    }, []);

    const handleChargeDone = async (id: string) => {
        try {
            const chargeRef = doc(db, "charges", id);
            await updateDoc(chargeRef, {paid: true, paidAt: new Date().toLocaleString()});

        } catch (e) {
            console.error("Cannot mark as paid", e);
        }

    }

    return (
        <Container>
            <Typography variant="h4">To Charge on Account</Typography>
            <Paper sx={{ padding: 2 }}>
                <DataGrid columns={columns}
                          rows={charges}
                          initialState={{
                              pagination: {
                                  paginationModel: {
                                      pageSize: 20,
                                  },
                              },
                          }}
                          pageSizeOptions={[20]}
                />
            </Paper>
        </Container>
    );
};

export default ChargesView;
