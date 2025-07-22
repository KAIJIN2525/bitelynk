import mongoose from "mongoose";
import Product from "./model/product.model.js";
import dotenv from "dotenv";
dotenv.config();

const products = [
  {
    name: "Jollof Rice",
    description: "A smoky, spicy one-pot rice dish that's a staple in Nigerian parties.",
    price: 3500,
    category: "Main Course",
    imageUrl: "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "jollof_rice_001",
    popular: true,
    bestseller: true,
    special: false,
    rating: 4.9,
    hearts: 320,
  },
  {
    name: "Egusi Soup",
    description: "A rich soup made with ground melon seeds, spinach, and assorted meats.",
    price: 4500,
    category: "Soup",
    imageUrl: "https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "egusi_soup_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.8,
    hearts: 280,
  },
  {
    name: "Pounded Yam & Nsala Soup",
    description: "Soft, stretchy yam dough served with a light, aromatic 'white soup'.",
    price: 5000,
    category: "Swallow",
    imageUrl: "https://images.pexels.com/photos/106344/pexels-photo-106344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "pounded_yam_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.7,
    hearts: 250,
  },
  {
    name: "Beef Suya",
    description: "Spicy skewered beef, grilled to perfection. A popular street food.",
    price: 2500,
    category: "Snack",
    imageUrl: "https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "suya_001",
    popular: true,
    bestseller: true,
    special: true,
    rating: 4.9,
    hearts: 400,
  },
  {
    name: "Moi Moi",
    description: "Steamed bean pudding made with peeled beans, peppers, and onions.",
    price: 1500,
    category: "Side Dish",
    imageUrl: "https://images.pexels.com/photos/406152/pexels-photo-406152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "moi_moi_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.5,
    hearts: 180,
  },
  {
    name: "Akara & Pap",
    description: "Deep-fried bean fritters served with a fermented corn pudding.",
    price: 2000,
    category: "Breakfast",
    imageUrl: "https://images.pexels.com/photos/4049991/pexels-photo-4049991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "akara_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.6,
    hearts: 210,
  },
  {
    name: "Ofada Rice & Ayamase Sauce",
    description: "A local variety of unpolished rice served with a spicy, bleached palm oil stew.",
    price: 4000,
    category: "Main Course",
    imageUrl: "https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "ofada_rice_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.7,
    hearts: 190,
  },
  {
    name: "Efo Riro",
    description: "A rich Yoruba vegetable soup made with spinach, peppers, and assorted meats.",
    price: 4200,
    category: "Soup",
    imageUrl: "https://images.pexels.com/photos/674577/pexels-photo-674577.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "efo_riro_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.8,
    hearts: 230,
  },
  {
    name: "Amala & Gbegiri/Ewedu",
    description: "A trio of yam flour dough, bean soup, and jute leaf soup. A Yoruba delicacy.",
    price: 4800,
    category: "Swallow",
    imageUrl: "https://images.pexels.com/photos/604969/pexels-photo-604969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "amala_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.6,
    hearts: 200,
  },
  {
    name: "Peppered Snails",
    description: "Large African snails sauteed in a spicy pepper sauce.",
    price: 6000,
    category: "Appetizer",
    imageUrl: "https://images.pexels.com/photos/718742/pexels-photo-718742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "peppered_snails_001",
    popular: true,
    bestseller: false,
    special: true,
    rating: 4.9,
    hearts: 350,
  },
  {
    name: "Banga Soup",
    description: "A flavorful soup made from palm fruit, with a unique blend of spices and fish.",
    price: 4600,
    category: "Soup",
    imageUrl: "https://images.pexels.com/photos/6210876/pexels-photo-6210876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "banga_soup_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.7,
    hearts: 215,
  },
  {
    name: "Gizdodo",
    description: "A delicious mix of fried gizzards and plantains in a spicy tomato sauce.",
    price: 3800,
    category: "Side Dish",
    imageUrl: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "gizdodo_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.6,
    hearts: 195,
  },
  {
    name: "Nigerian Fried Rice",
    description: "A colorful and savory fried rice with mixed vegetables, shrimp, and liver.",
    price: 3800,
    category: "Main Course",
    imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "fried_rice_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.7,
    hearts: 240,
  },
  {
    name: "Abacha (African Salad)",
    description: "A spicy salad made from shredded cassava, palm oil, and fermented oil bean seeds.",
    price: 3000,
    category: "Salad",
    imageUrl: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "abacha_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.5,
    hearts: 160,
  },
  {
    name: "Puff Puff",
    description: "Deep-fried, spongy, sweet dough balls. A classic Nigerian snack.",
    price: 1000,
    category: "Snack",
    imageUrl: "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "puff_puff_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.4,
    hearts: 150,
  },
  {
    name: "Chapman",
    description: "A refreshing non-alcoholic punch, often called the Nigerian sangria.",
    price: 1500,
    category: "Drinks",
    imageUrl: "https://images.pexels.com/photos/1200348/pexels-photo-1200348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "chapman_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.8,
    hearts: 200,
  },
  {
    name: "Zobo (Hibiscus) Drink",
    description: "A chilled drink made from dried hibiscus flowers, ginger, and pineapple.",
    price: 1200,
    category: "Drinks",
    imageUrl: "https://images.pexels.com/photos/5903277/pexels-photo-5903277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "zobo_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.6,
    hearts: 170,
  },
  {
    name: "Edikang Ikong Soup",
    description: "A nutritious vegetable soup from the Efik/Ibibio people, made with pumpkin and water leaves.",
    price: 5500,
    category: "Soup",
    imageUrl: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "edikang_ikong_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.8,
    hearts: 220,
  },
  {
    name: "Tuwo Shinkafa",
    description: "A soft, sticky rice pudding from Northern Nigeria, often served with Miyan Kuka.",
    price: 2500,
    category: "Swallow",
    imageUrl: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "tuwo_shinkafa_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.5,
    hearts: 140,
  },
  {
    name: "Catfish Pepper Soup",
    description: "A hot and spicy soup made with catfish and a blend of traditional Nigerian spices.",
    price: 4000,
    category: "Appetizer",
    imageUrl: "https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "catfish_pepper_soup_001",
    popular: true,
    bestseller: false,
    special: true,
    rating: 4.7,
    hearts: 260,
  },
    {
    name: "Asun (Spicy Smoked Goat Meat)",
    description: "Smoked goat meat sautéed in a very spicy sauce.",
    price: 5500,
    category: "Appetizer",
    imageUrl: "https://images.pexels.com/photos/236781/pexels-photo-236781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "asun_001",
    popular: true,
    bestseller: false,
    special: true,
    rating: 4.8,
    hearts: 290,
  },
  {
    name: "Chin Chin",
    description: "Crunchy, sweet, fried pastry snacks.",
    price: 800,
    category: "Snack",
    imageUrl: "https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "chin_chin_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.3,
    hearts: 120,
  },
  {
    name: "Okpa",
    description: "A traditional Eastern Nigerian dish made from Bambara nut flour.",
    price: 1200,
    category: "Side Dish",
    imageUrl: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "okpa_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.6,
    hearts: 150,
  },
  {
    name: "Semovita",
    description: "A popular swallow made from semolina flour, served with various soups.",
    price: 1500,
    category: "Swallow",
    imageUrl: "https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "semovita_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.5,
    hearts: 180,
  },
  {
    name: "Oha Soup",
    description: "A traditional soup from the South-Eastern part of Nigeria, made with Oha leaves.",
    price: 4800,
    category: "Soup",
    imageUrl: "https://images.pexels.com/photos/209540/pexels-photo-209540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "oha_soup_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.7,
    hearts: 200,
  },
  {
    name: "Adalu (Beans and Corn Porridge)",
    description: "A savory porridge made with beans and sweet corn.",
    price: 2800,
    category: "Main Course",
    imageUrl: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "adalu_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.4,
    hearts: 130,
  },
  {
    name: "Ukwa (African Breadfruit)",
    description: "A rich, savory porridge made from African breadfruit.",
    price: 3500,
    category: "Main Course",
    imageUrl: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "ukwa_001",
    popular: false,
    bestseller: false,
    special: false,
    rating: 4.6,
    hearts: 160,
  },
  {
    name: "Coconut Rice",
    description: "A rich and flavorful rice dish cooked with coconut milk.",
    price: 3200,
    category: "Main Course",
    imageUrl: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "coconut_rice_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.7,
    hearts: 210,
  },
  {
    name: "Plantain and Egg Frittata",
    description: "A delicious frittata made with ripe plantains and eggs.",
    price: 2800,
    category: "Breakfast",
    imageUrl: "https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "plantain_frittata_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.6,
    hearts: 190,
  },
  {
    name: "Ogbono Soup",
    description: "A draw soup made from ground ogbono seeds, with a slippery texture.",
    price: 4500,
    category: "Soup",
    imageUrl: "https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imagePublicId: "ogbono_soup_001",
    popular: true,
    bestseller: false,
    special: false,
    rating: 4.7,
    hearts: 220,
  },
];


// Function to seed the database
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seed...");
    console.log("MONGO_URI:", process.env.MONGO_URI);
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing products
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
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("🔌 Database connection closed");
    }
    process.exit();
  }
};

// Function to create an admin user
const createAdminUser = async () => {
  try {
    const adminExists = await mongoose.model('User').findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      await mongoose.model('User').create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true,
      });
      console.log('✅ Admin user created');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// Run the seeding function
const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB for seeding");

    await seedDatabase();
    await createAdminUser();

  } catch(e) {
    console.error("❌ Error in seedAll:", e);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("🔌 Database connection closed");
    }
    process.exit();
  }
};

seedAll();


export { seedDatabase };
