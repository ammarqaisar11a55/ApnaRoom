const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid resource id');
const optionalText = z.string().trim().optional().or(z.literal(''));
const parseJson = (value, fallback) => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (_err) {
    return fallback;
  }
};
const csvOrArray = z.preprocess((value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseJson(value, null);
    if (Array.isArray(parsed)) return parsed;
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
}, z.array(z.string().trim()).default([]));

const boolish = z.preprocess((value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true' || value === 'on';
  return Boolean(value);
}, z.boolean());

const numberish = z.coerce.number().min(0);

const hostelBody = z.object({
  name: z.string().trim().min(3).max(120),
  description: z.string().trim().min(20).max(3000),
  type: z.enum(['Boys', 'Girls', 'Mixed']),
  address: z.string().trim().min(5),
  city: z.string().trim().min(2),
  googleMapsLocation: optionalText,
  nearbyUniversities: csvOrArray,
  pricing: z.preprocess((value) => parseJson(value, value), z.object({
    monthlyRent: numberish,
    securityDeposit: numberish.default(0),
    electricityCharges: numberish.default(0),
    internetCharges: numberish.default(0),
    messCharges: numberish.default(0),
  })).optional(),
  monthlyRent: numberish.optional(),
  securityDeposit: numberish.optional(),
  electricityCharges: numberish.optional(),
  internetCharges: numberish.optional(),
  messCharges: numberish.optional(),
  floors: z.coerce.number().min(1).default(1),
  totalRooms: z.coerce.number().min(0).default(0),
  availableRooms: z.coerce.number().min(0).default(0),
  roomTypes: csvOrArray,
  facilities: csvOrArray,
  rules: csvOrArray,
  contact: z.preprocess((value) => parseJson(value, value), z.object({
    phone: z.string().trim().min(8),
    whatsapp: optionalText,
    emergency: optionalText,
  })).optional(),
  phone: z.string().trim().min(8).optional(),
  whatsapp: optionalText,
  emergency: optionalText,
  timings: z.preprocess((value) => parseJson(value, value), z.object({
    checkIn: z.string().default('13:00'),
    checkOut: z.string().default('12:00'),
  })).optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  policies: optionalText,
  status: z.enum(['draft', 'published', 'unpublished']).default('draft'),
});

const roomBody = z.object({
  hostel: objectId,
  roomNumber: z.string().trim().min(1).max(40),
  roomType: z.enum(['Single', 'Double', 'Triple', 'Shared']),
  capacity: z.coerce.number().min(1),
  occupiedBeds: z.coerce.number().min(0).default(0),
  pricePerBed: numberish,
  attachedBathroom: boolish.default(false),
  airConditioned: boolish.default(false),
  status: z.enum(['Available', 'Full', 'Maintenance']).default('Available'),
});

const bookingStatusBody = z.object({
  status: z.enum(['Pending', 'Approved', 'Rejected', 'Completed']).optional(),
  paymentStatus: z.enum(['Paid', 'Unpaid', 'Partial']).optional(),
}).refine((value) => value.status || value.paymentStatus, 'Status or payment status is required');

const tenantBody = z.object({
  hostel: objectId,
  room: objectId.optional().or(z.literal('')),
  name: z.string().trim().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().trim().min(8),
  cnic: optionalText,
  university: optionalText,
  guardianName: optionalText,
  guardianPhone: optionalText,
  moveInDate: z.coerce.date(),
  status: z.enum(['Active', 'Notice', 'Left']).default('Active'),
  paymentRecords: z.preprocess((value) => parseJson(value || '[]', []), z.array(z.object({
    month: z.string(),
    amount: numberish,
    status: z.enum(['Paid', 'Unpaid', 'Partial']).default('Unpaid'),
    paidAt: z.coerce.date().optional(),
  })).default([])),
});

const reviewReplyBody = z.object({
  reviewId: objectId,
  message: z.string().trim().min(2).max(800),
});

const reviewModerationBody = z.object({
  status: z.enum(['Pending', 'Published', 'Hidden']),
});

const idParams = z.object({ id: objectId });

module.exports = {
  idParams,
  hostelRequest: z.object({ body: hostelBody }),
  hostelIdRequest: z.object({ params: idParams }),
  hostelUpdateRequest: z.object({ params: idParams, body: hostelBody }),
  roomRequest: z.object({ body: roomBody }),
  roomUpdateRequest: z.object({ params: idParams, body: roomBody.partial({ hostel: true }) }),
  bookingStatusRequest: z.object({ params: idParams, body: bookingStatusBody }),
  tenantRequest: z.object({ body: tenantBody }),
  tenantUpdateRequest: z.object({ params: idParams, body: tenantBody }),
  reviewReplyRequest: z.object({ body: reviewReplyBody }),
  reviewModerationRequest: z.object({ params: idParams, body: reviewModerationBody }),
  hostelBody,
  roomBody,
  bookingStatusBody,
  tenantBody,
  reviewReplyBody,
  reviewModerationBody,
};
