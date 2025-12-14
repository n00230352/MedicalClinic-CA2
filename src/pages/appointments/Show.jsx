import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from "react-router";
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

export default function Show() {
  const [appointment, setAppointment] = useState([]);
  const [patients, setPatients] = useState([]);
	const [doctors, setDoctors] = useState([]);

  const { id } = useParams();
  const { token } = useAuth();

  const unixToLocalDateString = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleDateString(); // Format the date to a readable string
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      const options = {
        method: "GET",
        url: `/appointments/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setAppointment(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchPatients = async () => {
          try {
            const response = await axios.get("/patients", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setPatients(response.data);
          } catch (err) {
            console.log(err);
          }
        };
    
        const fetchDoctors = async () => {
          try {
            const response = await axios.get("/doctors", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setDoctors(response.data);
          } catch (err) {
            console.log(err);
          }
        };

    fetchAppointment();
    fetchPatients();
    fetchDoctors();

    console.log("appointment fetched");
  }, []);

  const getPatientName = (patientId) => {
		const patient = patients.find((p) => p.id === patientId);
		return patient ? `${patient.first_name} ${patient.last_name}` : patientId;
	};

	const getDoctorName = (doctorId) => {
		const doctor = doctors.find((d) => d.id === doctorId);
		return doctor ? `${doctor.first_name} ${doctor.last_name}` : doctorId;
	};

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Date: 
          {unixToLocalDateString(appointment.appointment_date)}
        </CardTitle>
        <CardDescription>Doctor: {getDoctorName(appointment.doctor_id)}</CardDescription>
        <CardDescription>Patient: {getPatientName(appointment.patient_id)}</CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  );
}
