import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from '@/config/api';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export default function Create() {
    const [form, setForm] = useState({
        appointment_date: "",
        doctor_id: "",
        patient_id: ""
    });
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };

    const createAppointment = async () => {
        const token = localStorage.getItem("token");

        const options = {
            method: "POST",
            url: `/appointments`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                ...form,
                appointment_date: "",
                patient_id: parseInt(form.patient_id),
                doctor_id: parseInt(form.doctor_id)
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/appointments'), { state : {
                type: 'success',
                message: `Appointment created successfully!`
            }};
        } catch (err) {
            console.log(err);
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        createAppointment();
    };

    return (
        <>
            <h1>Create a new Appointment</h1>
            <form onSubmit={handleSubmit}>
                <Input 
                    type="text" 
                    placeholder="Appointment Date" 
                    name="appointment_date" 
                    value={form.appointment_date} 
                    onChange={handleChange} 
                />
                <Input 
                    className="mt-2"
                    type="text" 
                    placeholder="doctor ID" 
                    name="doctor_id" 
                    value={form.doctor_id} 
                    onChange={handleChange} 
                />
                <Input 
                    className="mt-2"
                    type="text" 
                    placeholder="patient ID" 
                    name="patient_id" 
                    value={form.patient_id} 
                    onChange={handleChange} 
                />
                <Button 
                    className="mt-4 cursor-pointer" 
                    variant="outline" 
                    type="submit" 
                >Submit</Button>
            </form>
        </>
    );
}