// src/components/TestFirestore.tsx
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const TestFirestore: React.FC = () => {
    const [cars, setCars] = useState<any[]>([]);

    useEffect(() => {
        const fetchCars = async () => {
            const querySnapshot = await getDocs(collection(db, "cars"));
            const carData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCars(carData);
        };

        fetchCars();
    }, []);

    return (
        <div>
            <h2>Parked Cars</h2>
            <ul>
                {cars.map(car => (
                    <li key={car.id}>
                        {car.owner} - {car.license}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TestFirestore;
