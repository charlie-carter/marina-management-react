import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {Container, Typography, Paper, Button, Box, ButtonGroup} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ParkingDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parkingId = location.state?.parkingId; // Extract correctly



  const [parking, setParking] = useState<any>(null);
  const [car, setCar] = useState<any>(null);

  useEffect(() => {
    if (!parkingId) return;

    const fetchParkingData = async () => {
      try {
        const parkingRef = doc(db, "guestCars", parkingId);
        const parkingSnap = await getDoc(parkingRef);

        if (parkingSnap.exists()) {
          const parkingData = parkingSnap.data();
          setParking(parkingData);

          if (parkingData.carRef) {  // Ensure carRef exists

            const carDocReference = doc(db, "cars", parkingData.carRef.id); // Fix here
            const carSnap = await getDoc(carDocReference);

            if (carSnap.exists()) {
              setCar(carSnap.data());
            }
          }

        } else {
          console.error("Parking document not found");
        }
      } catch (error) {
        console.error("Error fetching parking details:", error);
      }
    };


    fetchParkingData();
  }, [parkingId]);

  const handleAddDay = async () => {
    try {
      const parkingRef = doc(db, "guestCars", parkingId);
      const parkingSnap = await getDoc(parkingRef);

      if (parkingSnap.exists()) {
        const parkingData = parkingSnap.data();

        const updatedDaysStayed = (parkingData.daysStayed || 0) + 1;

        await updateDoc(parkingRef, {
          daysStayed: updatedDaysStayed
        });

        setParking((prev) => ({
          ...prev,
          daysStayed: updatedDaysStayed,
        }));

      }
    } catch (error) {
      console.error("Error adding a day:", error);
    }
  };

  const handleRemoveDay = async () => {
    try {
      const parkingRef = doc(db, "guestCars", parkingId);
      const parkingSnap = await getDoc(parkingRef);

      if (parkingSnap.exists()) {
        const parkingData = parkingSnap.data();

        const updatedDaysStayed = parkingData.daysStayed  - 1;

        await updateDoc(parkingRef, {
          daysStayed: updatedDaysStayed
        });

        setParking((prev) => ({
          ...prev,
          daysStayed: updatedDaysStayed,
        }));

      }
    } catch (error) {
      console.error("Error removing a day:", error);
    }
  };

  if (!car) {
    return (
      <Container>
        <Typography variant="h5">Loading car details...</Typography>
      </Container>
    );
  }

  const entryDateObject = car.entryDate?.toDate ? car.entryDate.toDate() : new Date(car.entryDate);
  const entryDateFormatted = entryDateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Car Details
      </Typography>

      <Box sx={{ display: "flex", gap: 3 }}>
        <Paper sx={{ padding: 2, textAlign: "center", maxWidth: "40%" }}>
          {car.photoUrl ? (
            <img src={car.photoUrl} alt="Car" style={{ maxWidth: "100%", borderRadius: 8, maxHeight: "300px" }} />
          ) : (
            <Typography variant="body2">No image available</Typography>
          )}
        </Paper>

        <Paper sx={{ padding: 2, minWidth: "20%" }}>
          <Typography variant="h6">Owner: {car.ownerName}</Typography>
          <Typography variant="body1">License Plate: {car.licensePlate}</Typography>
          <Typography variant="body1">Vehicle Type: {car.make} {car.type}</Typography>
          <Typography variant="body1">Colour: {car.colour}</Typography>

        </Paper>

        <Paper sx={{padding: 2, maxWidth: "40%"}}>
          <Typography>Parking Information: </Typography>
          <Typography>Days parked: {parking.daysStayed}</Typography>
          <Typography>Date Arrived: {parking.entryDate}</Typography>
          <Typography>Date Leaving: {parking.exitDate ? parking.exitDate : "Unknown"}</Typography>
          <Typography>Paid: {parking.paid ? "Yes" : "No"}</Typography>

          <ButtonGroup size="large" sx={{width: '100%', padding: 4}}>
            <Button
                variant="contained"
                color="success"
                onClick={handleAddDay}
                startIcon={<AddIcon />}>Add Day</Button>

            <Button
                variant="outlined"
                onClick={handleRemoveDay}
                color="error">Remove Day</Button>
          </ButtonGroup>

          {!parking.paid ? <Button variant="contained" sx={{width: '90%', margin: 2}}>Mark As Paid</Button> : <Typography></Typography>}

          <Button variant="contained" color="error" sx={{width: '90%', margin: 2}}>Mark As Gone</Button>


        </Paper>
      </Box>

      <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => navigate(-1)}>
        Back to List
      </Button>
    </Container>
  );
};

export default ParkingDetails;
