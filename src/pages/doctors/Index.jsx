import { useEffect, useState } from "react";
import axios from "axios";


import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button"
import { Link } from "react-router";

export default function Index() {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
    const fetchDoctors = async () => {
        const options = {
        method: "GET",
        url: "https://ca2-med-api.vercel.app/doctors",
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            setDoctors(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    fetchDoctors();

    console.log("Hello");
    }, []);

    const doctorCards = doctors.map((doctor) => {
        return (
            <Card key={doctor.id}>
                <CardHeader>
                    <CardTitle>{doctor.first_name} {doctor.last_name}</CardTitle>

                    <CardDescription>
                        <div><strong>Email:</strong> {doctor.email}</div>
                        <div><strong>Phone:</strong> {doctor.phone}</div>
                        <div><strong>Specialisation:</strong> {doctor.specialisation}</div>
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button 
                    asChild
                    variant="outline">
                        <Link size='md' to={`/doctors/${doctor.id}`}>
                            View
                        </Link></Button>
                    </CardFooter>
                </Card>
        );
    });

    return (
        <>
            <h1>Doctor page</h1>
            {doctorCards}
        </>
    );
};