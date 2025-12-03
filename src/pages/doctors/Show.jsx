import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from 'react-router';

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
    const [doctors, setDoctors] = useState([]);
    const {id} = useParams();

    let token= localStorage.getItem('token');

    useEffect(( ) => {
        const fetchDoctors = async () => {
        const options = {
            method: "GET",
            url: `/doctors/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
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
    

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{doctors.first_name} {doctors.last_name}</CardTitle>
                <CardDescription>
                    {doctors.email}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <img src={doctors.image_path} alt={`${doctors.first_name} ${doctors.last_name}`} />
            </CardContent>
            <CardFooter className="flex-col gap-2">
            </CardFooter>
        </Card>
    );
}