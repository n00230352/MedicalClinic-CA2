import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .nonempty("Invalid email address")
    .email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  date_of_birth: z.date().min(1, "Date of birth is required"),
  address: z.string().min(1, "Address is required"),
});

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      address: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      date_of_birth: data.date_of_birth.toISOString().split("T")[0], // "YYYY-MM-DD"
      address: data.address,
    };

    try {
      await axios.post("/patients", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/patients", {
        state: {
          type: "success",
          message: "Patient created successfully!",
        },
      });
    } catch (err) {
      console.log(err);
      console.log(err.response?.data);
    }
  };

  // const handleChange = (e) => {
  //     setForm({
  //         ...form,
  //         [e.target.name] : e.target.value
  //     });
  // };

  // const createPatient = async () => {
  //     const token = localStorage.getItem("token");

  //     const options = {
  //         method: "POST",
  //         url: `/patients`,
  //         headers: {
  //             Authorization: `Bearer ${token}`
  //         },
  //         data: form
  //     };

  //     try {
  //         let response = await axios.request(options);
  //         console.log(response.data);
  //         navigate('/patients'), { state : {
  //             type: 'success',
  //             message: `Patient ${response.data.first_name} created successfully!`
  //         }};
  //     } catch (err) {
  //         console.log(err);
  //     }

  // };

  // const handleSubmit = (e) => {
  //     e.preventDefault();
  //     console.log(form);
  //     createPatient();
  // };

  return (
    <>
      <h1>Create a new Patient</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 max-w-md mt-4"
      >

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">First name</label>
          <Input
            type="text"
            placeholder="First name"
            {...form.register("first_name")}
          />
          {form.formState.errors.first_name && (
            <p className="text-xs text-red-500">
              {form.formState.errors.first_name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Last name</label>
          <Input
            type="text"
            placeholder="Last name"
            {...form.register("last_name")}
          />
          {form.formState.errors.last_name && (
            <p className="text-xs text-red-500">
              {form.formState.errors.last_name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="text"
            placeholder="Email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Phone</label>
          <Input
            type="text"
            placeholder="Phone"
            {...form.register("phone")}
          />
          {form.formState.errors.phone && (
            <p className="text-xs text-red-500">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>

        <Controller
          name="date_of_birth"
          control={form.control}
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Date of Birth
              </label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    {field.value
                      ? field.value.toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {form.formState.errors.date_of_birth && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.date_of_birth.message}
                </p>
              )}
            </div>
          )}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Adress</label>
          <Input
            type="text"
            placeholder="Address"
            {...form.register("address")}
          />
          {form.formState.errors.address && (
            <p className="text-xs text-red-500">
              {form.formState.errors.address.message}
            </p>
          )}
        </div>


        {/* <Input 
                    type="text" 
                    placeholder="First Name" 
                    name="first_name" 
                    value={form.first_name} 
                    onChange={handleChange} 
                />
                <Input 
                    className="mt-2"
                    type="text" 
                    placeholder="Last Name" 
                    name="last_name" 
                    value={form.last_name} 
                    onChange={handleChange} 
                />
                <Input 
                    className="mt-2"
                    type="text" 
                    placeholder="Email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                />
                <Input 
                    className="mt-2"
                    type="text" 
                    placeholder="Phone" 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange} 
                />
                <Input 
                    className="mt-2"
                    type="text" 
                    placeholder="Date of Birth" 
                    name="date_of_birth" 
                    value={form.date_of_birth} 
                    onChange={handleChange} 
                />
                <Input 
                    className="mt-2"
                    type="text" 
                    placeholder="Address" 
                    name="address" 
                    value={form.address} 
                    onChange={handleChange} 
                /> */}
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
