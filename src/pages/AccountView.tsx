import {
    Button, CircularProgress, Container, Divider, Grid,
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {AccountStructure, ChargeStructure} from "../types.ts";

const AccountView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [account, setAccount] = useState<AccountStructure>();
    const [charges, setCharges] = useState<ChargeStructure[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountRef = doc(db, "accounts", id!);
                const accountSnap = await getDoc(accountRef);

                if (accountSnap.exists()) {
                    const accountData = accountSnap.data() as AccountStructure;
                    setAccount(accountData);

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
                            const type: string = charge.type;

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
                                link,
                                type,
                                account: "This"
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
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Account Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                    {/* Left side: Name, Phone, Email */}
                    <Grid item xs={12} md={6}>
                        <Typography><strong>First Name:</strong> {account.fName}</Typography>
                        <Typography><strong>Last Name:</strong> {account.lName}</Typography>
                        <Typography><strong>Phone:</strong> {account.phone}</Typography>
                        <Typography><strong>Email:</strong> {account.email}</Typography>
                    </Grid>

                    {/* Right side: Address */}
                    <Grid item xs={12} md={6}>
                        <Typography><strong>Street:</strong> {account.address?.street}</Typography>
                        <Typography><strong>City:</strong> {account.address?.city}</Typography>
                        <Typography><strong>Province:</strong> {account.address?.province}</Typography>
                        <Typography><strong>Country:</strong> {account.address?.country}</Typography>
                        <Typography><strong>Postal Code:</strong> {account.address?.postalCode}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Account History
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table size="small">
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
                                    <TableCell>{charge.type === "GAS" ? `${charge.amount} Litres` : `${charge.amount} Days`}</TableCell>
                                    <TableCell>{charge.paidAt? charge.paidAt.toDate().toLocaleDateString() : "N/A"}</TableCell>
                                    <TableCell>{charge.paid ? "Paid" : "Unpaid"}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No account history found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button variant="outlined" size="large" onClick={() => navigate(-1)} sx={{ mt: 4 }}>
                Back
            </Button>
        </Container>
    );
};

export default AccountView;
