import 'dotenv/config';
import connectDB from './db.js';
import Problem from './../models/problem.js';

const seedDatabase = async () => {
  await connectDB();

  const OnlineShoppingCart ={
    "id": "Shopping_Cart",
    "hiddenGoal": "Online Shopping Cart",
    "length": 4,
    "pieces": [
        {
        "pieceId": 1,
        "functionName": "FilterByPrice",
        "parameters": ["items", "maxPrice"],
        "sampleInput": {
            "items": [
            { "name": "Shirt", "price": 299 },
            { "name": "Shoes", "price": 1500 },
            { "name": "Cap", "price": 199 }
            ],
            "maxPrice": 500
        },
        "expectedBehavior": "Return only items that cost less than or equal to maxPrice"
        },
        {
        "pieceId": 2,
        "functionName": "CalculateTotal",
        "parameters": ["cartItems"],
        "sampleInput": {
            "cartItems": [
            { "name": "Shirt", "price": 299, "quantity": 2 },
            { "name": "Cap", "price": 199, "quantity": 1 }
            ]
        },
        "expectedBehavior": "Return total price of all items multiplied by their quantity"
        },
        {
        "pieceId": 3,
        "functionName": "ApplyDiscount",
        "parameters": ["totalAmount", "discountPercent"],
        "sampleInput": {
            "totalAmount": 797,
            "discountPercent": 10
        },
        "expectedBehavior": "Return final amount after applying discount percentage"
        },
        {
        "pieceId": 4,
        "functionName": "CheckStock",
        "parameters": ["items", "cartItems"],
        "sampleInput": {
            "items": [
            { "name": "Shirt", "stock": 5 },
            { "name": "Cap", "stock": 0 }
            ],
            "cartItems": ["Shirt", "Cap"]
        },
        "expectedBehavior": "Return only items that are in stock"
        }
    ]
    };

    const ATM = 
    {
        "id": "ATM_withdrawal",
        "hiddenGoal": "ATM Withdrawal System",
        "length": 2,
        "pieces": [
            {
            "pieceId": 1,
            "functionName": "CheckBalance",
            "parameters": ["accountBalance", "withdrawAmount"],
            "sampleInput": {
                "accountBalance": 5000,
                "withdrawAmount": 2000
            },
            "expectedBehavior": "Return true if accountBalance is greater than or equal to withdrawAmount, false otherwise"
            },
            {
            "pieceId": 2,
            "functionName": "DispenseCash",
            "parameters": ["withdrawAmount", "availableNotes"],
            "sampleInput": {
                "withdrawAmount": 2000,
                "availableNotes": [2000, 500, 200, 100]
            },
            "expectedBehavior": "Return the fewest notes needed to make up the withdrawAmount using availableNotes"
            }
        ]
        }
    
        const exam = {
        "id": "Exam_Result",
        "hiddenGoal": "Student Exam Result System",
        "length": 3,
        "pieces": [
            {
            "pieceId": 1,
            "functionName": "CalculateAverage",
            "parameters": ["marks"],
            "sampleInput": {
                "marks": [78, 85, 92, 60, 74]
            },
            "expectedBehavior": "Return the average of all marks in the array"
            },
            {
            "pieceId": 2,
            "functionName": "AssignGrade",
            "parameters": ["average"],
            "sampleInput": {
                "average": 82
            },
            "expectedBehavior": "Return grade A if average >= 80, B if >= 60, C if >= 40, else F"
            },
            {
            "pieceId": 3,
            "functionName": "GetRanklist",
            "parameters": ["students"],
            "sampleInput": {
                "students": [
                { "name": "Arjun", "average": 91 },
                { "name": "Priya", "average": 76 },
                { "name": "Rahul", "average": 85 }
                ]
            },
            "expectedBehavior": "Return students sorted from highest to lowest average"
            }
        ]
        }

  try {
    await Problem.deleteMany(); // Clear out old data
    console.log('🧹 Cleared existing problems.');
    
    await Problem.create(OnlineShoppingCart);
    console.log('🌱 Successfully seeded Food Delivery problem!');

    await Problem.create(ATM);
    console.log('🌱 Successfully seeded ATM problem!');

    await Problem.create(exam);
    console.log('🌱 Successfully seeded Exam Result problem!');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();