// require('dotenv').config();
// const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri = "mongodb+srv://Bhavesh:Bh%40vesh_2310@devtinder.rqrpd0d.mongodb.net/?retryWrites=true&w=majority&appName=DevTinder";

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function connectDB() {
//   try {
//     await client.connect();
//     console.log("✅ MongoDB connected successfully");
//     return client;
//   } catch (error) {
//     console.error("❌ MongoDB connection failed:", error);
//     process.exit(1);
//   }
// }

// module.exports = { connectDB, client };