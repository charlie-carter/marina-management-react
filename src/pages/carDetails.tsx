import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Button, Box } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const CarDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const carId = location.state; // Get car ID from state

  const [car, setCar] = useState<any>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!carId) return;

    const fetchCarData = async () => {
      try {
        const carRef = doc(db, "cars", carId);
        const carSnap = await getDoc(carRef);

        if (carSnap.exists()) {
          const carData = carSnap.data();
          setCar(carData);

        } else {
          console.error("Car not found");
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    fetchCarData();
  }, [carId]);

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
            <img src={car.photoUrl} alt="Car" style={{ maxWidth: "100%", borderRadius: 8, maxHeight: "400px" }} />
          ) : (
            <Typography variant="body2">No image available</Typography>
          )}
        </Paper>

        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6">Owner: {car.ownerName}</Typography>
          <Typography variant="body1">License Plate: {car.licensePlate}</Typography>
          <Typography variant="body1">Vehicle Type: {car.make} {car.type}</Typography>
          <Typography variant="body1">Colour: {car.colour}</Typography>
          
        </Paper>
      </Box>

      <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => navigate(-1)}>
        Back to List
      </Button>
    </Container>
  );
};

export default CarDetails;
