require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Tenant = require('../models/Tenant');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([
    User.deleteMany({ email: 'owner@apnaroom.com' }),
    Hostel.deleteMany({}),
    Room.deleteMany({}),
    Booking.deleteMany({}),
    Tenant.deleteMany({}),
    Review.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const owner = await User.create({
    name: 'Ayesha Khan',
    email: 'owner@apnaroom.com',
    phone: '+92 300 1234567',
    password: 'OwnerPass123',
    role: 'owner',
    hostelName: 'Apna Heights',
    city: 'Lahore',
  });

  const hostel = await Hostel.create({
    owner: owner._id,
    name: 'Apna Heights Hostel',
    description: 'A clean, secure hostel near major universities with fast internet, mess, laundry, and furnished rooms.',
    type: 'Girls',
    address: 'Block B, Johar Town',
    city: 'Lahore',
    googleMapsLocation: 'https://maps.google.com',
    nearbyUniversities: ['University of Central Punjab', 'UOL', 'PU'],
    pricing: { monthlyRent: 28000, securityDeposit: 20000, electricityCharges: 3500, internetCharges: 1200, messCharges: 14000 },
    floors: 4,
    totalRooms: 2,
    availableRooms: 1,
    roomTypes: ['Single', 'Double', 'Shared'],
    facilities: ['WiFi', 'Laundry', 'Mess', 'CCTV', 'Security Guard', 'Generator', 'Study Room', 'Furnished Rooms'],
    rules: ['Visitors allowed in lobby only', 'Quiet hours after 11 PM', 'Monthly rent due by the 5th'],
    contact: { phone: '+92 300 1234567', whatsapp: '+92 300 1234567', emergency: '+92 321 7654321' },
    timings: { checkIn: '13:00', checkOut: '12:00' },
    thumbnail: { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', alt: 'Hostel room' },
    images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', alt: 'Room interior' }],
    status: 'published',
    analytics: { views: 1840, inquiries: 132, conversionRate: 7.1 },
  });

  const rooms = await Room.create([
    { owner: owner._id, hostel: hostel._id, roomNumber: 'A-101', roomType: 'Double', capacity: 2, occupiedBeds: 1, pricePerBed: 28000, attachedBathroom: true, airConditioned: true, status: 'Available' },
    { owner: owner._id, hostel: hostel._id, roomNumber: 'A-203', roomType: 'Shared', capacity: 4, occupiedBeds: 4, pricePerBed: 18000, attachedBathroom: false, airConditioned: false, status: 'Full' },
  ]);

  const tenant = await Tenant.create({
    owner: owner._id,
    hostel: hostel._id,
    room: rooms[0]._id,
    name: 'Maham Ali',
    email: 'maham@example.com',
    phone: '+92 333 1122334',
    university: 'UCP',
    moveInDate: new Date('2026-01-12'),
    paymentRecords: [{ month: '2026-05', amount: 28000, status: 'Paid', paidAt: new Date() }],
  });

  await Booking.create([
    { owner: owner._id, hostel: hostel._id, room: rooms[0]._id, tenant: tenant._id, guest: { name: 'Maham Ali', email: 'maham@example.com', phone: '+92 333 1122334', university: 'UCP' }, requestedMoveIn: new Date(), bedsRequested: 1, amount: 28000, status: 'Approved', paymentStatus: 'Paid' },
    { owner: owner._id, hostel: hostel._id, guest: { name: 'Sana Rauf', email: 'sana@example.com', phone: '+92 333 8877665', university: 'UOL' }, requestedMoveIn: new Date(), bedsRequested: 1, amount: 22000, status: 'Pending', paymentStatus: 'Unpaid' },
  ]);

  await Review.create({
    owner: owner._id,
    hostel: hostel._id,
    tenant: tenant._id,
    authorName: 'Maham Ali',
    rating: 5,
    comment: 'Clean rooms, reliable security, and a helpful owner.',
    status: 'Published',
  });

  await Notification.create([
    { owner: owner._id, type: 'booking_new', title: 'New booking request', message: 'Sana Rauf requested a bed at Apna Heights Hostel.' },
    { owner: owner._id, type: 'payment_received', title: 'Payment received', message: 'Maham Ali paid PKR 28,000 for May.' },
  ]);

  console.log('Seed complete: owner@apnaroom.com / OwnerPass123');
  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
