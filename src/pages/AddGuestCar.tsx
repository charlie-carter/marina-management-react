import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, addDoc, onSnapshot, DocumentReference, doc } from "firebase/firestore";
import { Container, TextField, Button, Typography, Paper, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import axios from "axios";
import { commonCarMakes } from "../assets/CarBrands";

const carColours = ["Black", "White", "Silver", "Grey", "Blue", "Red", "Green", "Yellow", "Beige"];
const carTypes = ["Sedan", "SUV", "Truck", "Minivan", "Van", ]

const AddGuestCar: React.FC = () => {
  const [licensePlate, setLicensePlate] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedType, setSelectedModel] = useState("");
  const [selectedColour, setSelectedColour] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  
  const navigate = useNavigate();

  // Fetch car makes from NHTSA API
  const carMakes = commonCarMakes;

  

  // Fetch car image when Make, Model, and Color are selected
//   useEffect(() => {
//     if (selectedMake && selecedType && selectedColor) {
//       fetchCarImage(selectedMake, selecedType, selectedColor);
//     }
//   }, [selectedMake, selecedType, selectedColor]);

//   const fetchCarImage = async (make: string, model: string, color: string) => {
//     try {
//       const response = await axios.get(
//         `https://api.unsplash.com/search/photos`,
//         {
//           params: {
//             query: `${color} ${make} ${model}`,
//             client_id: "v6E-yW2RzIZcfdVgSqgTucP51sTYt-xotk61qzHcS0I",
//             per_page: 1,
//           },
//         }
//       );
//       if (response.data.results.length > 0) {
//         setPhotoUrl(response.data.results[0].urls.regular);
//       }
//     } catch (error) {
//       console.error("Error fetching car image:", error);
//     }
//   };

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "accounts"), (snapshot) => {
        const accountData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setAccounts(accountData);
        });

        return () => unsubscribe();
    }, []);

    const handleAddCar = async () => {
        try {
          const guestCarData: any = {
            licensePlate,
            ownerName,
            make: selectedMake,
            type: selectedType, 
            colour: selectedColour,
            days: 1,
            entryTime: new Date().toISOString(),
          };
      
          // Only add account reference if selectedAccount is provided
          if (selectedAccount) {
            guestCarData.account = doc(db, "accounts", selectedAccount);
          }
      
          await addDoc(collection(db, "guestCars"), guestCarData);
      
          navigate("/dashboard");
        } catch (error) {
          console.error("Error adding car:", error);
        }
      };
  
    return (
      <Container>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Add New Guest Car
          </Typography>
          <TextField label="License Plate" fullWidth margin="normal" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} />
          <TextField label="Owner Name" fullWidth margin="normal" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
  
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

          <FormControl fullWidth margin="normal">
            <InputLabel>Account (Optional)</InputLabel>
            <Select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
              {accounts.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.fName} {data.lName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          {/* Car Image Preview */}
          {/* {photoUrl && <img src={photoUrl} alt="Car preview" style={{ width: "100%", maxHeight: "200px", marginTop: "10px" }} />} */}
  
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddCar}>
            Save Car
          </Button>
        </Paper>
      </Container>
    );
  };
  
  export default AddGuestCar;