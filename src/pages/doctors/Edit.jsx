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

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z.string().min(1, "Phone number is required"),
  specialisation: z.enum([
    "Podiatrist",
    "Dermatologist",
    "Pediatrician",
    "Psychiatrist",
    "General Practitioner",
  ]),
});

export default function Edit() {

  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      specialisation: "",
    },
    mode: "onChange",
  });



  useEffect(() => {
    const fetchDoctor = async () => {
      const options = {
        method: "GET",
        url: `/doctors/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.request(options);
        console.log(response.data);
        const doctor = response.data;

        form.reset({
            first_name: doctor.first_name,
            last_name: doctor.last_name,
            email: doctor.email,
            phone: doctor.phone,
            specialisation: doctor.specialisation,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctor();
  }, [id, token, form]);

  

  // const handleChange = (e) => {
  //   setForm({
  //     ...form,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const onSubmit = async (data) => {

    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      specialisation: data.specialisation,  
    };

    try {
      await axios.patch(`/doctors/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/doctors");
    } catch (err) {
      console.log(err);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(form);
  //   updateDoctor();
  // };

  return (
    <>
      <h1>Update Doctor</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-sm">

        <div className="flex flex-col gap-1">
          <Input
            type="text"
            placeholder="First Name"
            {...form.register("first_name")}
          />
          {form.formState.errors.first_name && (
            <p className="text-xs text-red-500">
              {form.formState.errors.first_name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Input
            type="text"
            placeholder="Last Name"
            {...form.register("last_name")}
          />
          {form.formState.errors.last_name && (
            <p className="text-xs text-red-500">
              {form.formState.errors.last_name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
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
              name="specialisation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Specialisation</FieldLabel>
                  <Select
                    name={field.name}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Choose specialisation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Podiatrist">Podiatrist</SelectItem>
                      <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                      <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                      <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                      <SelectItem value="General Practitioner">
                        General Practitioner
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Select your specialisation 
                  </FieldDescription>
                </Field>
              )}
            />
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
          placeholder="Specialisation"
          name="specialisation"
          value={form.specialisation}
          onChange={handleChange}
        /> */}
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
