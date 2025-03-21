import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Container, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
    { field: "fName", headerName: "First Name", width: 150 },
    { field: "lName", headerName: "Last Name", width: 150 },
    { field: "phone", headerName: "Phone Number", width: 120 },
    { field: "email", headerName: "Email", width: 180 },
    { field: "address", headerName: "Address", width: 180 },
];

const AccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccounts = async () => {
            const querySnapshot = await getDocs(collection(db, "accounts"));
            const accountData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setAccounts(accountData);
        };
        fetchAccounts();
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                All Accounts
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate("/add-account")}>
                Add New Account
            </Button>
            <div style={{ height: 400, width: "100%", marginTop: 20 }}>
                <DataGrid
                    rows={accounts}
                    columns={columns}
                    pageSize={5}
                    onRowClick={(params) => navigate(`/account-view/${params.id}`)}

                />
            </div>
        </Container>
    );
};

export default AccountsPage;
