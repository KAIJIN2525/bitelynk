import mongoose from "mongoose";
import Product from "./model/product.model.js";
import "dotenv/config";

// Mock food products data based on frontend dummydata
const products = [
  {
    name: "Kebab",
    description: "Juicy grilled meat with authentic spices",
    price: 4000,
    category: "Main Course",
    imageUrl: "https://example.com/images/kebab.png", // Replace with actual image URLs
    imagePublicId: "kebab_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.5,
    hearts: 105,
  },
  {
    name: "Chicken Tikka",
    description: "Tender chicken marinated in sauce",
    price: 1400,
    category: "Appetizer",
    imageUrl: "https://example.com/images/chicken-tikka.png",
    imagePublicId: "chicken_tikka_001",
    popular: false,
    bestseller: true,
    special: false,
    rating: 5.0,
    hearts: 155,
  },
  {
    name: "Desi Chowmein",
    description: "Spicy Asian noodles with a local twist",
    price: 6000,
    category: "Main Course",
    imageUrl: "https://example.com/images/desi-chowmein.png",
    imagePublicId: "desi_chowmein_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.2,
    hearts: 85,
  },
  {
    name: "Chicken Chargha",
    description: "Crispy golden fried whole chicken",
    price: 2000,
    category: "Main Course",
    imageUrl: "https://example.com/images/chicken-chargha.png",
    imagePublicId: "chicken_chargha_001",
    popular: false,
    bestseller: false,
    special: true,
    rating: 4.8,
    hearts: 285,
  },
  {
    name: "Paneer Tikka",
    description: "Cottage cheese marinated in spices",
    price: 2200,
    category: "Appetizer",
    imageUrl: "https://example.com/images/paneer-tikka.png",
    imagePublicId: "paneer_tikka_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.8,
    hearts: 210,
  },
  {
    name: "Masala Dosa",
    description: "Crispy rice crepe with potato filling",
    price: 1800,
    category: "Main Course",
    imageUrl: "https://example.com/images/masala-dosa.png",
    imagePublicId: "masala_dosa_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.5,
    hearts: 165,
  },
  {
    name: "Palak Paneer",
    description: "Spinach curry with cottage cheese",
    price: 2500,
    category: "Main Course",
    imageUrl: "https://example.com/images/palak-paneer.png",
    imagePublicId: "palak_paneer_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.7,
    hearts: 190,
  },
  {
    name: "Gulab Jamun",
    description: "Golden dumplings in rose syrup",
    price: 3000,
    category: "Dessert",
    imageUrl: "https://example.com/images/gulab-jamun.png",
    imagePublicId: "gulab_jamun_001",
    popular: false,
    bestseller: false,
    special: true,
    rating: 4.9,
    hearts: 275,
  },
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seed...");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing products (optional - remove if you want to keep existing products)
    console.log("🗑️  Clearing existing products...");
    await Product.deleteMany({});
    console.log("✅ Existing products cleared");

    // Insert new products
    console.log("📦 Inserting new products...");
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ ${insertedProducts.length} products inserted successfully!`);

    // Display inserted products
    console.log("\n📋 Inserted Products:");
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₦${product.price.toLocaleString()}`);
    });

    console.log("\n🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit();
  }
};

// Additional function to add more products if needed
const addMoreProducts = async () => {
  const additionalProducts = [
    {
      name: "Biryani",
      description: "Fragrant basmati rice with spiced meat",
      price: 5500,
      category: "Main Course",
      imageUrl: "https://example.com/images/biryani.png",
      imagePublicId: "biryani_001",
      popular: true,
      bestseller: true,
      special: false,
      rating: 4.9,
      hearts: 320,
    },
    {
      name: "Butter Chicken",
      description: "Creamy tomato-based chicken curry",
      price: 3500,
      category: "Main Course",
      imageUrl: "https://example.com/images/butter-chicken.png",
      imagePublicId: "butter_chicken_001",
      popular: true,
      bestseller: false,
      special: false,
      rating: 4.7,
      hearts: 245,
    },
    {
      name: "Samosa",
      description: "Crispy pastry with spiced potato filling",
      price: 800,
      category: "Snack",
      imageUrl: "https://example.com/images/samosa.png",
      imagePublicId: "samosa_001",
      popular: false,
      bestseller: false,
      special: false,
      rating: 4.3,
      hearts: 95,
    },
    {
      name: "Mango Lassi",
      description: "Refreshing yogurt drink with mango",
      price: 1200,
      category: "Beverage",
      imageUrl: "https://example.com/images/mango-lassi.png",
      imagePublicId: "mango_lassi_001",
      popular: false,
      bestseller: false,
      special: false,
      rating: 4.6,
      hearts: 180,
    },
  ];

  try {
    console.log("🌱 Adding additional products...");
    await mongoose.connect(process.env.MONGO_URI);
    
    const inserted = await Product.insertMany(additionalProducts);
    console.log(`✅ ${inserted.length} additional products added!`);
    
  } catch (error) {
    console.error("❌ Error adding additional products:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

// Run the seeding function
if (process.argv[2] === "add-more") {
  addMoreProducts();
} else {
  seedDatabase();
}

export { seedDatabase, addMoreProducts };
