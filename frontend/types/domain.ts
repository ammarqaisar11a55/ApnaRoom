export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type Paginated<T> = {
  items: T[];
  pagination: Pagination;
};

export type Hostel = {
  _id: string;
  name: string;
  description: string;
  type: "Boys" | "Girls" | "Mixed";
  address: string;
  city: string;
  googleMapsLocation?: string;
  nearbyUniversities: string[];
  pricing: {
    monthlyRent: number;
    securityDeposit: number;
    electricityCharges: number;
    internetCharges: number;
    messCharges: number;
  };
  floors: number;
  totalRooms: number;
  availableRooms: number;
  roomTypes: string[];
  facilities: string[];
  rules: string[];
  contact: { phone: string; whatsapp?: string; emergency?: string };
  timings: { checkIn: string; checkOut: string };
  thumbnail?: { url: string; alt?: string };
  images?: Array<{ url: string; alt?: string }>;
  policies?: string;
  status: "draft" | "published" | "unpublished";
  analytics?: { views: number; inquiries: number; conversionRate: number };
};

export type Room = {
  _id: string;
  hostel: Hostel | string;
  roomNumber: string;
  roomType: "Single" | "Double" | "Triple" | "Shared";
  capacity: number;
  occupiedBeds: number;
  availableBeds: number;
  pricePerBed: number;
  attachedBathroom: boolean;
  airConditioned: boolean;
  images?: Array<{ url: string; alt?: string }>;
  status: "Available" | "Full" | "Maintenance";
};

export type Booking = {
  _id: string;
  hostel: Pick<Hostel, "name" | "city">;
  room?: Pick<Room, "roomNumber" | "roomType">;
  guest: { name: string; email: string; phone: string; university?: string };
  requestedMoveIn?: string;
  bedsRequested: number;
  amount: number;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
  paymentStatus: "Paid" | "Unpaid" | "Partial";
  createdAt: string;
};

export type Tenant = {
  _id: string;
  hostel: Pick<Hostel, "name" | "city">;
  room?: Pick<Room, "roomNumber" | "roomType">;
  name: string;
  email?: string;
  phone: string;
  university?: string;
  moveInDate: string;
  moveOutDate?: string;
  status: "Active" | "Notice" | "Left";
  paymentRecords: Array<{ month: string; amount: number; status: "Paid" | "Unpaid" | "Partial"; paidAt?: string }>;
};

export type Owner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "owner";
  city?: string;
  hostelName?: string;
  avatar?: string;
  notificationPreferences?: {
    bookings?: boolean;
    payments?: boolean;
    reviews?: boolean;
    marketing?: boolean;
  };
};

export type Review = {
  _id: string;
  hostel: Pick<Hostel, "name" | "city">;
  authorName: string;
  rating: number;
  comment: string;
  status: "Pending" | "Published" | "Hidden";
  reply?: { message?: string; repliedAt?: string };
};

export type NotificationItem = {
  _id: string;
  type: "booking_new" | "booking_cancelled" | "payment_received" | "review_new" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};
