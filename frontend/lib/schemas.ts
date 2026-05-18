import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Phone is required"),
  city: z.string().min(2, "City is required"),
  hostelName: z.string().optional(),
});

export const hostelSchema = z.object({
  name: z.string().min(3, "Hostel name is required"),
  description: z.string().min(20, "Add a useful description"),
  type: z.enum(["Boys", "Girls", "Mixed"]),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  googleMapsLocation: z.string().url("Enter a valid map URL").or(z.literal("")).optional(),
  nearbyUniversities: z.string().optional(),
  monthlyRent: z.coerce.number().min(0),
  securityDeposit: z.coerce.number().min(0),
  electricityCharges: z.coerce.number().min(0),
  internetCharges: z.coerce.number().min(0),
  messCharges: z.coerce.number().min(0),
  floors: z.coerce.number().min(1),
  totalRooms: z.coerce.number().min(0),
  availableRooms: z.coerce.number().min(0),
  roomTypes: z.array(z.string()).min(1, "Select at least one room type"),
  facilities: z.array(z.string()).min(1, "Select at least one facility"),
  rules: z.string().optional(),
  phone: z.string().min(8, "Contact phone is required"),
  whatsapp: z.string().optional(),
  emergency: z.string().optional(),
  checkIn: z.string(),
  checkOut: z.string(),
  policies: z.string().optional(),
  status: z.enum(["draft", "published", "unpublished"]),
});

export type HostelFormValues = z.infer<typeof hostelSchema>;

export const roomSchema = z.object({
  hostel: z.string().min(1, "Select a hostel"),
  roomNumber: z.string().min(1, "Room number is required"),
  roomType: z.enum(["Single", "Double", "Triple", "Shared"]),
  capacity: z.coerce.number().min(1),
  occupiedBeds: z.coerce.number().min(0),
  pricePerBed: z.coerce.number().min(0),
  attachedBathroom: z.boolean(),
  airConditioned: z.boolean(),
  status: z.enum(["Available", "Full", "Maintenance"]),
});

export const tenantSchema = z.object({
  hostel: z.string().min(1, "Select a hostel"),
  room: z.string().optional(),
  name: z.string().min(2, "Tenant name is required"),
  email: z.string().email("Enter a valid email").or(z.literal("")).optional(),
  phone: z.string().min(8, "Phone is required"),
  university: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  moveInDate: z.string().min(1, "Move-in date is required"),
  status: z.enum(["Active", "Notice", "Left"]),
  paymentMonth: z.string().optional(),
  paymentAmount: z.coerce.number().min(0).optional(),
  paymentStatus: z.enum(["Paid", "Unpaid", "Partial"]),
});

export type RoomFormValues = z.infer<typeof roomSchema>;
export type TenantFormValues = z.infer<typeof tenantSchema>;
