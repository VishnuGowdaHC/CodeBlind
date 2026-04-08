import 'dotenv/config';
import connectDB from './db.js';
import Problem from './../models/problem.js';

const seedDatabase = async () => {
  await connectDB();

  const foodDeliveryProblem = {
    id: "food_delivery",
    hiddenGoal: "Food Delivery App",
    pieces: [
      {
        pieceId: 1,
        functionName: "filterRestaurants",
        parameters: ["restaurants", "maxDistance"],
        sampleInput: {
          restaurants: [
            { name: "Pizza Hut", distance: 3.2 },
            { name: "KFC", distance: 7.8 }
          ],
          maxDistance: 5
        },
        expectedBehavior: "Return only restaurants within maxDistance"
      },
      {
        pieceId: 2,
        functionName: "calculateDeliveryFee",
        parameters: ["orderWeight", "distance"],
        sampleInput: {
          orderWeight: 2.5,
          distance: 4.0
        },
        expectedBehavior: "Return delivery fee based on weight and distance"
      },
      {
        pieceId: 3,
        functionName: "assignDriver",
        parameters: ["drivers", "restaurantLocation"],
        sampleInput: {
          drivers: [
            { id: "d1", location: { lat: 12.9, lng: 77.5 } }
          ],
          restaurantLocation: { lat: 12.91, lng: 77.51 }
        },
        expectedBehavior: "Return the nearest available driver"
      },
      {
        pieceId: 4,
        functionName: "sendOTP",
        parameters: ["phoneNumber", "orderId"],
        sampleInput: {
          phoneNumber: "9876543210",
          orderId: "ORD123"
        },
        expectedBehavior: "Generate and send a 6-digit OTP to verify delivery"
      }
    ]
  };

  try {
    await Problem.deleteMany(); // Clear out old data
    console.log('🧹 Cleared existing problems.');
    
    await Problem.create(foodDeliveryProblem);
    console.log('🌱 Successfully seeded Food Delivery problem!');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();