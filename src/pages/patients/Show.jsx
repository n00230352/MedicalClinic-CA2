import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Show(){
    const [patients, setPatients] = useState([]);
    const {id} = useParams();
    const { token } = useAuth();

    useEffect(( ) => {
        const fetchPatients = async () => {
        const options = {
            method: "GET",
            url: `/patients/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            setPatients(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    fetchPatients();

    console.log("Hello");
    }, []);
    

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{patients.first_name} {patients.last_name}</CardTitle>
                <CardDescription>
                    {patients.email}
                </CardDescription>
                <CardDescription>
                    {patients.phone}
                </CardDescription>
                <CardDescription>
                    {patients.date_of_birth}
                </CardDescription>
                <CardDescription>
                    {patients.address}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <img src={patients.image_path} alt={`${patients.first_name} ${patients.last_name}`} />
            </CardContent>
            <CardFooter className="flex-col gap-2">
            </CardFooter>
        </Card>
    );
}