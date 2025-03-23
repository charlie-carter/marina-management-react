import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Button, Grid } from "@mui/material";


const CarDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state;

  if (!car) {
    return (
      <Container>
        <Typography variant="h5">No Car Selected</Typography>
      </Container>
    );
  }



  return (
    <Container>
      <Typography variant="h4" style={{marginBottom: "40px"}}>
        Car Details
      </Typography>


      <Grid container spacing={3}>
    

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
            <Typography variant="body1">Vehicle Type: {car.make} {car.model}</Typography>
            <Typography variant="body1">Entry Time: {car.entryTime}</Typography>
            <Typography variant="body1">Assigned Account: {car.accountId || "N/A"}</Typography>
          </Paper>
        
          
        
      </Grid>

      <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => navigate(-1)}>
        Back to List
      </Button>
    </Container>
  );
};

export default CarDetails;
