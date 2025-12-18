import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, useNavigate } from "react-router";
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
import { Button } from "@/components/ui/button";

export default function Show() {
  const [appointment, setAppointment] = useState([]);
  const [patients, setPatients] = useState([]);
	const [doctors, setDoctors] = useState([]);

  const { id } = useParams();
  const { token } = useAuth();
   const navigate = useNavigate();


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
        <CardTitle className="text-xl">
  Appointment Details
        </CardTitle>
        <CardDescription>Date: {unixToLocalDateString(appointment.appointment_date)}</CardDescription>
      </CardHeader>

   <CardContent className="space-y-2">
        <div className="text-sm">
          <span className="text-muted-foreground">Doctor: </span>
          {getDoctorName(appointment.doctor_id)}
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Patient: </span>
          {getPatientName(appointment.patient_id)}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">

        <Button variant="outline" onClick={() => navigate("/appointments")}>
          Back to Appointments
        </Button>
      </CardFooter>
    </Card>
  );
}
