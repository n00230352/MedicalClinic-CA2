import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Edit() {
  const [form, setForm] = useState({
      appointment_date: "",
      doctor_id: "",
      patient_id: "",
  });

  const { token } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
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
        let appointment = response.data;
        setForm({
            appointment_date: appointment.appointment_date,
            doctor_id: appointment.doctor_id,
            patient_id: appointment.patient_id,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchAppointments();
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateAppointments = async () => {

    const options = {
      method: "PATCH",
      url: `/appointment/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
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
      navigate("/appointments");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    updateAppointments();
  };

  return (
    <>
      <h1>Update Appointment</h1>
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
          placeholder="Doctor ID"
          name="doctor_id"
          value={form.doctor_id}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Patient ID"
          name="patient_id"
          value={form.patient_id}
          onChange={handleChange}
        />
         
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
