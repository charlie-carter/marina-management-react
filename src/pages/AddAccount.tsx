import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {collection, addDoc, doc, setDoc, getDoc} from "firebase/firestore";
import { db } from "../firebaseConfig"; // Ensure this is your Firebase config
import { TextField, Button, Container, Typography, Paper, Box } from "@mui/material";
import {MuiTelInput} from "mui-tel-input";

const AddAccount = () => {
    const navigate = useNavigate();

    // State for form fields
    const [formData, setFormData] = useState({
        fName: "",
        lName: "",
        phone: "",
        email: "",
        street: "",
        city: "",
        province: "",
        country: "",
        postalCode: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        const { fName, lName, phone, email, street, city, province, country, postalCode } = formData;

        if (!fName || !lName || !phone) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        try {
            const baseId = (fName + lName).toLowerCase().replace(/\s+/g, "");
            let uniqueId = baseId;
            let counter = 1;

            // Check for uniqueness
            while (true) {
                const docRef = doc(db, "accounts", uniqueId);
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) break;
                uniqueId = `${baseId}${counter}`;
                counter++;
            }

            // Save document
            await setDoc(doc(db, "accounts", uniqueId), {
                fName,
                lName,
                phone,
                email,
                address: {
                    street,
                    city,
                    province,
                    country,
                    postalCode,
                },
            });

            navigate("/dashboard");
        } catch (err) {
            setError("Error adding account. Please try again.");
            console.error("Firebase Error:", err);
        }

        setLoading(false);
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
                    Add New Account
                </Typography>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Box sx={{ display: "grid", gap: 2 }}>
                    <TextField label="First Name" name="fName" value={formData.fName} onChange={handleChange} required />
                    <TextField label="Last Name" name="lName" value={formData.lName} onChange={handleChange} required />
                    <MuiTelInput
                        label="Phone"
                        name="phone"
                        defaultCountry="CA"
                        value={formData.phone}
                        onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                        required
                    />
                    <TextField label="Email" name="email" value={formData.email} onChange={handleChange}  type="email" />
                    <TextField label="Street Address" name="street" value={formData.street} onChange={handleChange}  />
                    <TextField label="City" name="city" value={formData.city} onChange={handleChange}  />
                    <TextField label="Province" name="province" value={formData.province} onChange={handleChange}  />
                    <TextField label="Country" name="country" value={formData.country} onChange={handleChange}  />
                    <TextField label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange}  />
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Add Account"}
                </Button>

                <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate(-1)}>
                    Cancel
                </Button>
            </Paper>
        </Container>
    );
};

export default AddAccount;
