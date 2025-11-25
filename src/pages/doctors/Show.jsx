import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router';

export default function Show(){
    const [doctors, setDoctors] = useState([]);
    const {id} = useParams();

    let token= localStorage.getItem('token');

    useEffect(( ) => {
        const fetchDoctors = async () => {
        const options = {
            method: "GET",
            url: ` https://ca2-med-api.vercel.app/doctors/${id}`,
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
        <>
            <h2>Doctor Info</h2>

            <p>First name: {doctors.first_name}</p>
            <p>Last name: {doctors.last_name}</p>
            <p>Email: {doctors.email}</p>
            <p>Phone: {doctors.phone}</p>
            <p>Specialisation: {doctors.specialisation}</p>
        </>
    );
}