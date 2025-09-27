import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
// FIX: Reverting to the original alias import (@/) which suggests the project uses this configuration.
import { useAppState } from "@/context/app-state"; 
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CalendarIcon } from "lucide-react";

// Schema for form validation - email is now required
const patientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  gender: z.enum(["male", "female", "prefer not to say"], {
    required_error: "Gender is required",
  }),
  dob: z.string().min(1, "Date of birth is required"),
  contact: z
    .string()
    .regex(/^\d{10}$/, "Contact number must be exactly 10 digits"),
  address: z.object({
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
  }),
  email: z.string().email("Valid email required"), // Now required
  height: z.string().optional(),
  weight: z.string().optional(),
  ayurvedic_category: z.enum(["vata", "pitta", "kapha"], {
    required_error: "Ayurvedic category is required",
  }),
  // Keep as string for form handling, will be joined later
  allergies: z.string().optional(),
  diseases: z.string().optional(),
  medical_history: z
    .any() // Use any for file upload handling
    .refine((file) => !file || file instanceof File && file.type === "application/pdf", {
      message: "Only PDF files are allowed",
    })
    .optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

// Animation variants
const fieldVariants = {
  initial: { opacity: 0, y: 10 },
  enter: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 }
  })
};

// Form Field Components (using existing definitions)
function TextField({
  name,
  label,
  index = 0,
  ...props
}: { 
  name: keyof PatientFormValues; 
  label: string; 
  index?: number 
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<PatientFormValues>();
  const error = (errors as any)[name];

  return (
    <motion.div
      variants={fieldVariants}
      initial="initial"
      animate="enter"
      custom={index}
      className="space-y-2"
    >
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} {...props} {...register(name as keyof PatientFormValues)} />
      {error && <p className="text-xs text-red-600">{error.message}</p>}
    </motion.div>
  );
}

function SelectField({
  name,
  label,
  options,
  placeholder,
  index = 0,
}: {
  name: keyof PatientFormValues;
  label: string;
  options: { label: string; value: string }[];
  placeholder: string;
  index?: number;
}) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PatientFormValues>();
  const value = watch(name);
  const error = (errors as any)[name];

  return (
    <motion.div
      variants={fieldVariants}
      initial="initial"
      animate="enter"
      custom={index}
      className="space-y-2"
    >
      <Label>{label}</Label>
      <Select
        value={value as string}
        onValueChange={(v) => setValue(name as any, v as any, { shouldValidate: true })}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-600">{error.message}</p>}
    </motion.div>
  );
}

export default function AddPatient() {
  const navigate = useNavigate();
  // We only need currentUser and addNotification from context
  const { currentUser, addNotification } = useAppState() as any; 
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Determine the correct user ID property (using _id first, then id as fallback)
  const doctorId = currentUser?._id || currentUser?.id;


  const methods = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      gender: undefined,
      dob: "",
      contact: "",
      address: { city: "", state: "", country: "" },
      email: "", // Required field
      height: "",
      weight: "",
      ayurvedic_category: undefined,
      allergies: "",
      diseases: "",
      medical_history: undefined,
    },
    mode: "onChange",
  });

  const { handleSubmit, setValue } = methods;

  // Handler for file input
  const handlePdfChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0];
    // Cast the file to any to satisfy the Zod refinement using a custom type for files
    setValue("medical_history", file, { shouldValidate: true });
  };

  const onSubmit = async (values: PatientFormValues) => {
    setIsLoading(true);
    setError(null);

    // Basic client-side checks for required fields
    if (!values.name || !values.email || !values.contact || !values.dob || !values.gender || !values.ayurvedic_category) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    // CHECK: Use the determined doctorId
    if (!doctorId) { 
      // This is the error message the user is seeing, suggesting doctorId is null/undefined
      setError("No doctor logged in. Please log in first.");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for backend submission (required for file upload)
      const formData = new FormData();
      
      // REQUIRED FIELDS
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", "123456"); // Password required by User model
      formData.append("gender", values.gender);
      formData.append("dob", values.dob);
      formData.append("contact", values.contact);
      formData.append("ayurvedic_category", values.ayurvedic_category);
      formData.append("mode", "offline"); // Set 'mode' as required by Patient model
      
      // ADDRESS (Backend expects address as JSON array string)
      formData.append("address", JSON.stringify([values.address]));

      // OPTIONAL FIELDS
      if (values.height) formData.append("height", values.height);
      if (values.weight) formData.append("weight", values.weight);
      
      // ARRAY FIELDS (Backend handles comma-separated strings for diseases/allergies)
      if (values.allergies) formData.append("allergies", values.allergies);
      if (values.diseases) formData.append("diseases", values.diseases);
      
      // FILE UPLOAD (Must use the exact field name 'medical_history' as defined in doctor.routes.js)
      if (values.medical_history instanceof File) {
        formData.append("medical_history", values.medical_history);
      }
      
      console.log('Attempting to submit patient data to /api/doctor/add-patient...');

      const response = await axios.post(
        // Ensure the URL matches the backend route
        "/api/doctor/add-patient", 
        formData,
        {
          headers: {
            // Setting Content-Type to multipart/form-data is usually optional when using FormData, 
            // but setting it explicitly doesn't hurt. Axios may set boundary for you.
            "Content-Type": "multipart/form-data", 
          },
          // Ensure cookies are sent for authentication
          withCredentials: true, 
        }
      );

      console.log('Patient registration successful:', response.data);

      // --- Success Handling ---
      
      // Show success notification
      addNotification({
        type: "success",
        title: "Patient added successfully!",
        message: `${values.name} has been assigned to you. Refresh the patient list to see them.`,
      });

      // Navigate back to patients list
      // The DoctorPatients component will handle fetching the new patient via API
      navigate("/doctor/patients"); 
      
      // We explicitly removed the mock local state update (setRequests) here.

    } catch (err: any) {
      console.error('Patient registration error:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred while adding the patient.";
      setError(errorMessage);

      // Show error notification
      addNotification({
        type: "warning",
        title: "Failed to add patient",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Add Patient</h1>
          <p className="text-sm text-gray-600 mt-1">
            Patient will be assigned to: <span className="font-medium">{currentUser?.name || "Current Doctor"}</span>
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle>Patient Details</CardTitle>
          <CardDescription>
            Fill in the patient's information. The patient will be automatically assigned to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  name="name"
                  label="Full Name"
                  placeholder="Enter patient's full name"
                  required
                  index={0}
                />
                
                <SelectField
                  name="ayurvedic_category"
                  label="Ayurvedic Category"
                  placeholder="Select category"
                  options={[
                    { label: "Vata", value: "vata" },
                    { label: "Pitta", value: "pitta" },
                    { label: "Kapha", value: "kapha" },
                  ]}
                  index={1}
                />

                <SelectField
                  name="gender"
                  label="Gender"
                  placeholder="Select gender"
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Prefer not to say", value: "prefer not to say" },
                  ]}
                  index={2}
                />

                <motion.div
                  variants={fieldVariants}
                  initial="initial"
                  animate="enter"
                  custom={3}
                  className="space-y-2"
                >
                  <Label>Date of Birth</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input 
                      type="date" 
                      className="pl-10" 
                      {...methods.register("dob")} 
                      required
                    />
                  </div>
                  {methods.formState.errors.dob && (
                    <p className="text-xs text-red-600">{methods.formState.errors.dob.message}</p>
                  )}
                </motion.div>

                <TextField
                  name="contact"
                  label="Phone Number"
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  required
                  index={4}
                />

                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="patient@email.com"
                  required
                  index={5}
                />
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  variants={fieldVariants}
                  initial="initial"
                  animate="enter"
                  custom={6}
                  className="space-y-2"
                >
                  <Label>City</Label>
                  <Input placeholder="City" {...methods.register("address.city")} required />
                  {methods.formState.errors.address?.city && (
                    <p className="text-xs text-red-600">{methods.formState.errors.address.city.message}</p>
                  )}
                </motion.div>

                <motion.div
                  variants={fieldVariants}
                  initial="initial"
                  animate="enter"
                  custom={7}
                  className="space-y-2"
                >
                  <Label>State</Label>
                  <Input placeholder="State" {...methods.register("address.state")} required />
                  {methods.formState.errors.address?.state && (
                    <p className="text-xs text-red-600">{methods.formState.errors.address.state.message}</p>
                  )}
                </motion.div>

                <motion.div
                  variants={fieldVariants}
                  initial="initial"
                  animate="enter"
                  custom={8}
                  className="space-y-2"
                >
                  <Label>Country</Label>
                  <Input placeholder="Country" {...methods.register("address.country")} required />
                  {methods.formState.errors.address?.country && (
                    <p className="text-xs text-red-600">{methods.formState.errors.address.country.message}</p>
                  )}
                </motion.div>
              </div>

              {/* Physical Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  name="height"
                  label="Height (cm)"
                  type="number"
                  placeholder="170"
                  index={9}
                />
                <TextField
                  name="weight"
                  label="Weight (kg)"
                  type="number"
                  placeholder="65"
                  index={10}
                />
              </div>

              {/* Medical Information (same as register page) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  variants={fieldVariants}
                  initial="initial"
                  animate="enter"
                  custom={11}
                  className="space-y-2"
                >
                  <Label>Allergies</Label>
                  {/* Note: In Zod schema, this is now `string | undefined` */}
                  <Input
                    placeholder="e.g., peanuts, pollen (comma-separated)"
                    {...methods.register("allergies")}
                  />
                  <p className="text-xs text-gray-500">Leave blank if none</p>
                </motion.div>

                <motion.div
                  variants={fieldVariants}
                  initial="initial"
                  animate="enter"
                  custom={12}
                  className="space-y-2"
                >
                  <Label>Medical Conditions</Label>
                  {/* Note: In Zod schema, this is now `string | undefined` */}
                  <Input
                    placeholder="e.g., diabetes, hypertension (comma-separated)"
                    {...methods.register("diseases")}
                  />
                  <p className="text-xs text-gray-500">Leave blank if none</p>
                </motion.div>
              </div>

              {/* File Upload */}
              <motion.div
                variants={fieldVariants}
                initial="initial"
                animate="enter"
                custom={13}
                className="space-y-2"
              >
                <Label>Medical Documents</Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                <p className="text-xs text-gray-500">Upload reports or prescriptions (PDF only)</p>
                {methods.formState.errors.medical_history && (
                  <p className="text-xs text-red-600">
                    {typeof methods.formState.errors.medical_history.message === 'string'
                      ? methods.formState.errors.medical_history.message
                      : 'Error'}
                  </p>
                )}
              </motion.div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/doctor/patients")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isLoading ? "Adding Patient..." : "Add Patient"}</span>
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
