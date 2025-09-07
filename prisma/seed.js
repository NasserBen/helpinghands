const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const realSFAddressesWithCoords = [
  {
    address: "2000 Van Ness Ave, Pacific Heights, San Francisco, CA 94109",
    lat: 37.7919,
    lng: -122.4244,
  },
  {
    address: "1600 Fillmore St, Japantown, San Francisco, CA 94115",
    lat: 37.7849,
    lng: -122.4324,
  },
  {
    address: "3200 16th St, Mission District, San Francisco, CA 94103",
    lat: 37.7648,
    lng: -122.4238,
  },
  {
    address: "800 Divisadero St, Western Addition, San Francisco, CA 94117",
    lat: 37.7749,
    lng: -122.4376,
  },
  {
    address: "2500 California St, Pacific Heights, San Francisco, CA 94115",
    lat: 37.7886,
    lng: -122.4324,
  },
  {
    address: "1000 Market St, SOMA, San Francisco, CA 94102",
    lat: 37.7821,
    lng: -122.4081,
  },
  {
    address: "500 Castro St, Castro District, San Francisco, CA 94114",
    lat: 37.7619,
    lng: -122.4350,
  },
  {
    address: "1700 Haight St, Haight-Ashbury, San Francisco, CA 94117",
    lat: 37.7690,
    lng: -122.4479,
  },
  {
    address: "3000 Mission St, Mission District, San Francisco, CA 94110",
    lat: 37.7489,
    lng: -122.4187,
  },
  {
    address: "600 Montgomery St, Financial District, San Francisco, CA 94111",
    lat: 37.7946,
    lng: -122.4014,
  },
  {
    address: "400 Grant Ave, Chinatown, San Francisco, CA 94108",
    lat: 37.7904,
    lng: -122.4059,
  },
  {
    address: "1200 Columbus Ave, North Beach, San Francisco, CA 94133",
    lat: 37.8022,
    lng: -122.4097,
  },
  {
    address: "2800 Lombard St, Marina District, San Francisco, CA 94123",
    lat: 37.8002,
    lng: -122.4413,
  },
  {
    address: "900 Hyde St, Russian Hill, San Francisco, CA 94109",
    lat: 37.7906,
    lng: -122.4169,
  },
  {
    address: "1500 Church St, Noe Valley, San Francisco, CA 94131",
    lat: 37.7484,
    lng: -122.4286,
  },
  {
    address: "700 Diamond St, Glen Park, San Francisco, CA 94131",
    lat: 37.7329,
    lng: -122.4343,
  },
  {
    address: "2200 Irving St, Sunset District, San Francisco, CA 94122",
    lat: 37.7632,
    lng: -122.4829,
  },
  {
    address: "3800 Geary Blvd, Richmond District, San Francisco, CA 94118",
    lat: 37.7804,
    lng: -122.4625,
  },
  {
    address: "1800 Pine St, Pacific Heights, San Francisco, CA 94109",
    lat: 37.7884,
    lng: -122.4244,
  },
  {
    address: "2600 Folsom St, Mission District, San Francisco, CA 94110",
    lat: 37.7539,
    lng: -122.4145,
  },
  {
    address: "1100 Valencia St, Mission District, San Francisco, CA 94110",
    lat: 37.7559,
    lng: -122.4210,
  },
  {
    address: "450 Hayes St, Hayes Valley, San Francisco, CA 94102",
    lat: 37.7766,
    lng: -122.4241,
  },
  {
    address: "2900 24th St, Mission District, San Francisco, CA 94110",
    lat: 37.7522,
    lng: -122.4080,
  },
  {
    address: "1400 Union St, Russian Hill, San Francisco, CA 94109",
    lat: 37.7976,
    lng: -122.4208,
  },
  {
    address: "3500 Balboa St, Richmond District, San Francisco, CA 94121",
    lat: 37.7759,
    lng: -122.4948,
  },
  {
    address: "800 Irving St, Inner Sunset, San Francisco, CA 94122",
    lat: 37.7632,
    lng: -122.4658,
  },
  {
    address: "1900 Fillmore St, Western Addition, San Francisco, CA 94115",
    lat: 37.7879,
    lng: -122.4324,
  },
  {
    address: "650 Chestnut St, Marina District, San Francisco, CA 94123",
    lat: 37.8026,
    lng: -122.4344,
  },
  {
    address: "2100 Polk St, Russian Hill, San Francisco, CA 94109",
    lat: 37.7947,
    lng: -122.4206,
  },
  {
    address: "1300 Stockton St, North Beach, San Francisco, CA 94133",
    lat: 37.8027,
    lng: -122.4080,
  },
  {
    address: "3700 Mission St, Mission District, San Francisco, CA 94110",
    lat: 37.7327,
    lng: -122.4258,
  },
  {
    address: "2400 Bryant St, Mission District, San Francisco, CA 94110",
    lat: 37.7570,
    lng: -122.4095,
  },
  {
    address: "1000 Potrero Ave, Potrero Hill, San Francisco, CA 94110",
    lat: 37.7577,
    lng: -122.4069,
  },
  {
    address: "850 Bush St, Nob Hill, San Francisco, CA 94108",
    lat: 37.7906,
    lng: -122.4100,
  },
  {
    address: "1600 Ocean Ave, Ingleside, San Francisco, CA 94112",
    lat: 37.7244,
    lng: -122.4566,
  },
  {
    address: "2800 Taraval St, Sunset District, San Francisco, CA 94116",
    lat: 37.7426,
    lng: -122.4928,
  },
  {
    address: "1200 9th Ave, Inner Sunset, San Francisco, CA 94122",
    lat: 37.7632,
    lng: -122.4658,
  },
  {
    address: "3200 Clement St, Richmond District, San Francisco, CA 94121",
    lat: 37.7829,
    lng: -122.4948,
  },
  {
    address: "900 Irving St, Inner Sunset, San Francisco, CA 94122",
    lat: 37.7632,
    lng: -122.4658,
  },
  {
    address: "1800 Divisadero St, Western Addition, San Francisco, CA 94115",
    lat: 37.7879,
    lng: -122.4376,
  },
];

const taskCategories = [
  "Moving & Delivery",
  "Cleaning",
  "Handyman",
  "Pet Care",
  "Grocery Shopping",
  "Tech Support",
  "Gardening",
  "Tutoring",
  "Event Help",
  "Elderly Care",
];

const taskTitles = [
  "Help me move furniture to new apartment",
  "Deep clean my studio before move-out",
  "Fix leaky kitchen faucet",
  "Walk my dog while I'm at work",
  "Grocery shopping for elderly neighbor",
  "Set up new WiFi router",
  "Plant flowers in backyard garden",
  "Math tutoring for high school student",
  "Help serve at dinner party",
  "Assist with physical therapy exercises",
  "Assemble IKEA furniture",
  "House cleaning before guests arrive",
  "Install ceiling fan",
  "Pet sitting for weekend trip",
  "Weekly grocery delivery",
  "Computer virus removal",
  "Weed garden and water plants",
  "Spanish language tutoring",
  "Wedding setup assistance",
  "Medication reminder check-ins",
  "Pack boxes for moving day",
  "Window cleaning service",
  "Hang pictures and mirrors",
  "Daily dog walking service",
  "Meal prep and cooking help",
  "Smartphone setup tutorial",
  "Trim hedges and bushes",
  "Piano lesson for beginner",
  "Birthday party cleanup",
  "Companionship visits",
];

const descriptions = [
  "I need help moving a couch and dresser up 3 flights of stairs. Heavy lifting required!",
  "Looking for someone to thoroughly clean my 1-bedroom apartment before I move out.",
  "Kitchen faucet has been dripping for weeks. Need a handy person to fix it.",
  "My golden retriever needs a 30-minute walk every weekday while I'm at the office.",
  "Weekly grocery shopping for my 85-year-old mother who has mobility issues.",
  "Need help setting up new internet router and configuring all devices.",
  "Want to plant seasonal flowers in my small backyard garden this weekend.",
  "High school student needs help with algebra and geometry homework.",
  "Hosting a dinner party for 12 people and need help with serving and cleanup.",
  "Elderly father needs assistance with daily exercises prescribed by physical therapist.",
  "Bought a new bed frame and nightstand that need assembly.",
  "Deep cleaning needed before my parents visit next week.",
  "Bedroom ceiling fan needs installation. All tools and materials provided.",
  "Going out of town for 3 days and need someone to watch my two cats.",
  "Regular grocery delivery service needed for busy working mom.",
  "Laptop is running very slowly and may have viruses.",
  "Backyard garden needs weeding and regular watering.",
  "Adult beginner wants to learn conversational Spanish.",
  "Need help setting up tables, chairs, and decorations for outdoor wedding.",
  "Daily check-ins needed for senior with medication schedule.",
  "Moving day help needed to pack fragile items and load truck.",
  "All windows in 2-story house need professional cleaning.",
  "Have several framed pictures and mirrors to hang throughout house.",
  "Energetic puppy needs daily walks and some basic training.",
  "Meal preparation needed for family of 4 with dietary restrictions.",
  "New iPhone user needs help learning basic functions and apps.",
  "Front yard hedges are overgrown and need professional trimming.",
  "Child wants to learn piano basics before starting formal lessons.",
  "Post-party cleanup needed after large birthday celebration.",
  "Lonely senior citizen would appreciate regular friendly visits.",
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSFAddressWithCoords() {
  // Use all available addresses with coordinates
  return getRandomElement(realSFAddressesWithCoords);
}

function generatePhoneNumber() {
  const area = "415"; // SF area code
  const exchange = Math.floor(Math.random() * 900) + 100;
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${area}-${exchange}-${number}`;
}

async function main() {
  console.log("🌉 Starting seed for San Francisco Helping Hands...");

  // Clear existing data first
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  console.log("🗑️  Cleared existing data");

  // Create test users with easy credentials
  const testUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Test User",
        phoneNumber: "415-555-0001",
        password: "password123",
      },
    }),
    prisma.user.create({
      data: {
        name: "Helper Demo",
        phoneNumber: "415-555-0002",
        password: "password123",
      },
    }),
  ]);

  console.log("✅ Created test users");

  // Create 25 users
  const users = [...testUsers];
  const firstNames = [
    "Alex",
    "Jordan",
    "Taylor",
    "Morgan",
    "Casey",
    "Riley",
    "Avery",
    "Quinn",
    "Cameron",
    "Sage",
    "River",
    "Phoenix",
    "Rowan",
    "Skylar",
    "Dakota",
    "Eden",
    "Finley",
    "Hayden",
    "Kendall",
    "Logan",
    "Parker",
    "Reese",
    "Sam",
    "Blake",
    "Drew",
  ];

  const lastNames = [
    "Chen",
    "Rodriguez",
    "Kim",
    "Patel",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
    "Clark",
  ];

  for (let i = 0; i < 25; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        phoneNumber: generatePhoneNumber(),
        password: "hashedpassword123", // In real app, this would be properly hashed
      },
    });
    users.push(user);
  }

  console.log(`✅ Created ${users.length} users`);

  // Create ~100 tasks
  const tasks = [];
  for (let i = 0; i < 100; i++) {
    const creator = getRandomElement(users);
    const helper =
      Math.random() < 0.3
        ? getRandomElement(users.filter((u) => u.id !== creator.id))
        : null;
    const completed = Math.random() < 0.2; // 20% completed tasks
    const addressWithCoords = getRandomSFAddressWithCoords();

    const task = await prisma.task.create({
      data: {
        title: getRandomElement(taskTitles),
        creatorId: creator.id,
        helperID: helper?.id,
        category: getRandomElement(taskCategories),
        imageUrl:
          Math.random() < 0.3
            ? `https://picsum.photos/400/300?random=${i}`
            : null,
        price: Math.round((Math.random() * 200 + 10) * 100) / 100, // $10-$210
        description: getRandomElement(descriptions),
        address: addressWithCoords.address,
        latitude: addressWithCoords.lat,
        longitude: addressWithCoords.lng,
        completed: completed,
        estimatedDuration: Math.floor(Math.random() * 480) + 30, // 30 minutes to 8 hours
      },
    });
    tasks.push(task);
  }

  console.log(`✅ Created ${tasks.length} tasks`);
  console.log("🎉 Seed completed successfully!");

  // Print some stats
  const completedTasks = tasks.filter((t) => t.completed).length;
  const tasksWithHelpers = tasks.filter((t) => t.helperID).length;
  const avgPrice =
    tasks.reduce((sum, task) => sum + task.price, 0) / tasks.length;

  console.log(`📊 Stats:`);
  console.log(`   - Total users: ${users.length}`);
  console.log(`   - Total tasks: ${tasks.length}`);
  console.log(`   - Completed tasks: ${completedTasks}`);
  console.log(`   - Tasks with helpers: ${tasksWithHelpers}`);
  console.log(`   - Average task price: $${avgPrice.toFixed(2)}`);

  console.log("\n🔑 Test Login Credentials:");
  console.log("   Phone: 415-555-0001, Password: password123 (Test User)");
  console.log("   Phone: 415-555-0002, Password: password123 (Helper Demo)");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
