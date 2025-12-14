import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  appointment_date: z.date({ required_error: "Appointment date is required" }),
  doctor_id: z.string().min(1, "Doctor is required"),
  patient_id: z.string().min(1, "Patient is required"),
});

export default function Edit() {

  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  	const [doctors, setDoctors] = useState([]);
	const [patients, setPatients] = useState([]);


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointment_date: undefined,
      doctor_id: "",
      patient_id: "",
    },
    mode: "onChange",
  });
  


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
        const response = await axios.request(options);
        const appointment = response.data;
        console.log("Fetched appointment:", appointment);

        form.reset({
            appointment_date: appointment.appointment_date
            ? new Date(appointment.appointment_date) 
            : undefined,
            doctor_id: appointment.doctor_id?.toString() ?? "",
            patient_id: appointment.patient_id?.toString() ?? "",
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchAppointments();
  }, [id, token, form]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(res.data);
      } catch (err) {
        console.log(err);
      }
    };

  if (token) fetchDoctors();
  }, [token]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get("/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(res.data);
      } catch (err) {
        console.log(err);
      }
    };

  if (token) fetchPatients();
  }, [token]);

  // const handleChange = (e) => {
  //   setForm({
  //     ...form,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const onSubmit = async (data) => {
    console.log("Form data to submit:", data);

    const payload = {
      doctor_id: parseInt(data.doctor_id),
      patient_id: parseInt(data.patient_id),
      appointment_date: data.appointment_date
        .toISOString()
        .split("T")[0], // "YYYY-MM-DD"
    };
    console.log("Payload to send:", payload);

    try {
      await axios.patch(`/appointments/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/appointments");
    } catch (err) {
      console.log(err);
    }
  };


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(form);
  //   updateAppointments();
  // };
  const [dateOpen, setDateOpen] = useState(false);

  return (
    <>
      <h1>Update Appointment</h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 max-w-sm"
      >
        
        <Controller
          name="appointment_date"
          control={form.control}
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Appointment Date
              </label>

              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    {field.value
                      ? field.value.toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {form.formState.errors.appointment_date && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.appointment_date.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
					name="doctor_id"
					control={form.control}
					render={({ field }) => (
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">Doctor</label>
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select a doctor" />
								</SelectTrigger>
								<SelectContent>
									{doctors.map((doctor) => (
										<SelectItem key={doctor.id} value={doctor.id.toString()}>
											{doctor.first_name} {doctor.last_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{form.formState.errors.doctor_id && (
								<p className="text-xs text-red-500">
									{form.formState.errors.doctor_id.message}
								</p>
							)}
						</div>
					)}
				/>

				<Controller
					name="patient_id"
					control={form.control}
					render={({ field }) => (
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">Patient</label>
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select a patient" />
								</SelectTrigger>
								<SelectContent>
									{patients.map((patient) => (
										<SelectItem key={patient.id} value={patient.id.toString()}>
											{patient.first_name} {patient.last_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{form.formState.errors.patient_id && (
								<p className="text-xs text-red-500">
									{form.formState.errors.patient_id.message}
								</p>
							)}
						</div>
					)}
				/>

        <Button
          className="mt-2 cursor-pointer self-start"
          variant="outline"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </>
  );
}
