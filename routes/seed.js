/**
 * seed.js — Populates the database with an admin user and sample events.
 * Run once with:  npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User  = require('./models/User');
const Event = require('./models/Event');

const events = [
  {
    title:       'Tech Innovators Summit 2026',
    description: 'A premier corporate conference bringing together the brightest minds in technology, AI and digital transformation. Featuring keynote speakers, panel discussions and networking sessions.',
    category:    'Conference',
    date:        new Date('2026-08-15'),
    time:        '08:00',
    location:    'Cape Town International Convention Centre',
    price:       1500,
    capacity:    300
  },
  {
    title:       'Full-Stack Web Development Bootcamp',
    description: 'An intensive hands-on workshop covering modern full-stack development with Node.js, React and cloud deployment. Suitable for intermediate developers looking to level up.',
    category:    'Workshop',
    date:        new Date('2026-07-05'),
    time:        '09:00',
    location:    'The Innovation Hub, Pretoria',
    price:       850,
    capacity:    40
  },
  {
    title:       'Joburg Music & Arts Festival',
    description: 'A vibrant outdoor festival celebrating South African music, art and culture. Featuring 20+ live acts across 3 stages, food vendors and art exhibitions.',
    category:    'Festival',
    date:        new Date('2026-09-20'),
    time:        '12:00',
    location:    'Constitution Hill, Johannesburg',
    price:       350,
    capacity:    2000
  },
  {
    title:       'Executive Leadership Masterclass',
    description: 'A half-day private workshop for senior executives covering strategic leadership, change management and building high-performance teams.',
    category:    'Corporate',
    date:        new Date('2026-07-22'),
    time:        '09:30',
    location:    'Sandton Convention Centre',
    price:       2200,
    capacity:    25
  },
  {
    title:       'Photography & Lightroom Workshop',
    description: 'Learn professional photo editing techniques using Adobe Lightroom. This beginner-friendly workshop covers colour grading, retouching and export workflows.',
    category:    'Workshop',
    date:        new Date('2026-08-02'),
    time:        '10:00',
    location:    'Neighbourgoods Market, Cape Town',
    price:       450,
    capacity:    20
  },
  {
    title:       'Durban Beachfront Summer Concert',
    description: 'An open-air music concert on the Durban beachfront featuring local and international artists. Bring your family and enjoy an evening of great music and ocean views.',
    category:    'Festival',
    date:        new Date('2026-12-06'),
    time:        '17:00',
    location:    'North Beach, Durban',
    price:       0,
    capacity:    5000
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Event.deleteMany({});
  console.log('Cleared existing users and events');

  // Create admin user (password is hashed by the User pre-save hook)
  const admin = await User.create({
    name:     'Admin User',
    email:    'admin@eventhub.co.za',
    password: 'Admin@1234',
    role:     'admin'
  });
  console.log('Admin created: admin@eventhub.co.za / Admin@1234');

  // Create a regular user for testing
  await User.create({
    name:     'Test User',
    email:    'user@eventhub.co.za',
    password: 'User@1234',
    role:     'user'
  });
  console.log('Test user created: user@eventhub.co.za / User@1234');

  // Create sample events
  for (const data of events) {
    await Event.create({ ...data, createdBy: admin._id });
  }
  console.log(`Created ${events.length} sample events`);

  await mongoose.disconnect();
  console.log('Done. Run "npm run dev" to start the server.');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
