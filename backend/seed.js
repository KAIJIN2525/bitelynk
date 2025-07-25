import mongoose from "mongoose";
import Product from "./model/product.model.js";
import dotenv from "dotenv";
dotenv.config();

// Nigerian Food Data (40 items)
const nigerianFoods = [
  // Rice & Main Dishes
  {
    name: "Jollof Rice",
    description: "Classic Nigerian rice cooked in rich tomato sauce",
    price: 2500,
    category: "Lunch",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753403073/Nigerian-Jollof-Rice-Recipe_zud9df.jpg",
    imagePublicId: "Nigerian-Jollof-Rice-Recipe_zud9df",
    popular: true,
    bestseller: true,
    rating: 4.9,
    hearts: 320,
  },
  {
    name: "Fried Rice",
    description: "Rice stir-fried with vegetables and assorted meats",
    price: 2800,
    category: "Lunch",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753403018/20220908-nigerian-fried-rice-maureen-celestine-hedenote-f5c3fab4f5ab45368aa315d51644dd2a_vie5ep.jpg",
    imagePublicId:
      "20220908-nigerian-fried-rice-maureen-celestine-hedenote-f5c3fab4f5ab45368aa315d51644dd2a_vie5ep",
    rating: 4.5,
    hearts: 210,
  },
  {
    name: "Coconut Rice",
    description: "Fragrant rice cooked with coconut milk",
    price: 2700,
    category: "Lunch",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753403115/Coconut-rice-8-720x480_jaxker.jpg",
    imagePublicId: "Coconut-rice-8-720x480_jaxker",
    rating: 4.6,
    hearts: 190,
  },
  {
    name: "Ofada Rice",
    description: "Local rice served with special Ofada sauce",
    price: 3200,
    category: "Lunch",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753403191/IMG_9666-scaled_ec4ecm.jpg",
    imagePublicId: "IMG_9666-scaled_ec4ecm",
    popular: true,
    rating: 4.7,
    hearts: 230,
  },

  // Swallows & Soups
  {
    name: "Pounded Yam & Egusi",
    description: "Smooth yam paste with melon seed soup",
    price: 3000,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753403601/GFkg2hsWIAA7Ici_izmfr0.jpg",
    imagePublicId: "GFkg2hsWIAA7Ici_izmfr0",
    rating: 4.7,
    hearts: 245,
  },
  {
    name: "Amala & Ewedu",
    description: "Yam flour swallow with jute leaves soup",
    price: 2500,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753403249/Amala_and_ewedu_with_stew_and_cow_head_and_leg_p6lef1.jpg",
    imagePublicId: "Amala_and_ewedu_with_stew_and_cow_head_and_leg_p6lef1",
    rating: 4.5,
    hearts: 180,
  },
  {
    name: "Fufu & Oha Soup",
    description: "Cassava dough with Ora soup",
    price: 2800,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448034/20230527_082924_dftjbl.jpg",
    imagePublicId: "20230527_082924_dftjbl",
    rating: 4.6,
    hearts: 195,
  },
  {
    name: "Eba & Okro Soup",
    description: "Garri swallow with okra soup",
    price: 2200,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753403626/okra-soup_vghlbw.jpg",
    imagePublicId: "okra-soup_vghlbw",
    rating: 4.4,
    hearts: 170,
  },

  // Proteins
  {
    name: "Suya",
    description: "Spicy grilled skewered meat with peanut spice",
    price: 1800,
    category: "Lunch",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753447919/a-plate-of-stacked-suya-beef-copy_rhvwrp.jpg",
    imagePublicId: "a-plate-of-stacked-suya-beef-copy_rhvwrp",
    popular: true,
    rating: 4.8,
    hearts: 280,
  },
  {
    name: "Peppered Goat Meat",
    description: "Tender goat meat in spicy pepper sauce",
    price: 3500,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753447941/Asun-recipe-IG-1_ehubmy.jpg",
    imagePublicId: "Asun-recipe-IG-1_ehubmy",
    rating: 4.7,
    hearts: 210,
  },
  {
    name: "Grilled Catfish",
    description: "Fresh catfish seasoned and grilled to perfection",
    price: 4000,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448148/E685E539-B688-4131-BFFE-2288C9899A61-scaled_ofkcud.jpg",
    imagePublicId: "E685E539-B688-4131-BFFE-2288C9899A61-scaled_ofkcud",
    popular: true,
    rating: 4.9,
    hearts: 310,
  },
  {
    name: "Nkwobi",
    description: "Spicy cow foot delicacy",
    price: 3200,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448112/nkwobi-3_fd3ovw.jpg",
    imagePublicId: "nkwobi-3_fd3ovw",
    rating: 4.6,
    hearts: 195,
  },

  // Snacks & Small Chops
  {
    name: "Puff Puff",
    description: "Sweet deep-fried dough balls",
    price: 500,
    category: "Breakfast",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448128/puffpuff-nigerian_ihujct.jpg",
    imagePublicId: "puffpuff-nigerian_ihujct",
    popular: true,
    rating: 4.8,
    hearts: 290,
  },
  {
    name: "Akara",
    description: "Bean cakes fried to golden perfection",
    price: 700,
    category: "Breakfast",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753449229/Akara-and-bread-for-Nigerian-Akara-recipe_nmmoxj.jpg",
    imagePublicId: "Akara-and-bread-for-Nigerian-Akara-recipe_nmmoxj",
    rating: 4.7,
    hearts: 230,
  },
  {
    name: "Moi Moi",
    description: "Steamed bean pudding with assorted ingredients",
    price: 800,
    category: "Breakfast",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448164/moi-moi-rollup_wccxcl.jpg",
    imagePublicId: "moi-moi-rollup_wccxcl",
    rating: 4.6,
    hearts: 210,
  },
  {
    name: "Boli & Fish",
    description: "Roasted plantain with grilled fish",
    price: 2500,
    category: "Lunch",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448216/04c1a4af3121ae838d6f9f927aed861b_usqybn.jpg",
    imagePublicId: "04c1a4af3121ae838d6f9f927aed861b_usqybn",
    rating: 4.7,
    hearts: 240,
  },

  // Soups & Stews
  {
    name: "Banga Soup",
    description: "Palm fruit soup with assorted meats",
    price: 2800,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448261/niger-delta-banga-soup-recipe-img-7-500x500_m8e6lv.jpg",
    imagePublicId: "niger-delta-banga-soup-recipe-img-7-500x500_m8e6lv",
    rating: 4.5,
    hearts: 180,
  },
  {
    name: "Ogbono Soup",
    description: "Draw soup made with wild mango seeds",
    price: 2600,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448277/Ogbono-soup-Draw-Soup-IG-1_q7xwcf.jpg",
    imagePublicId: "Ogbono-soup-Draw-Soup-IG-1_q7xwcf",
    rating: 4.4,
    hearts: 170,
  },
  {
    name: "Edikaikong Soup",
    description: "Vegetable soup with assorted proteins",
    price: 3000,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448348/Vegetable-Soup-Edikaikong_nprlmv.jpg",
    imagePublicId: "Vegetable-Soup-Edikaikong_nprlmv",
    rating: 4.6,
    hearts: 200,
  },
  {
    name: "Afang Soup",
    description: "Leafy soup from southern Nigeria",
    price: 2900,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448400/Afang-soup-18_mnuumt.jpg",
    imagePublicId: "Afang-soup-18_mnuumt",
    rating: 4.5,
    hearts: 185,
  },

  // Beverages
  {
    name: "Zobo Drink",
    description: "Refreshing hibiscus drink",
    price: 800,
    category: "Drinks",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448439/Dash-of-Jazz-Nigerian-Zobo-Drink-16_xz3jjl.jpg",
    imagePublicId: "Dash-of-Jazz-Nigerian-Zobo-Drink-16_xz3jjl",
    rating: 4.3,
    hearts: 150,
  },
  {
    name: "Kunu",
    description: "Traditional millet drink",
    price: 700,
    category: "Drinks",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448460/7eed07a0-c04e-11ef-8b55-6daa1fbb4532.jpg_ufpowt.webp",
    imagePublicId: "7eed07a0-c04e-11ef-8b55-6daa1fbb4532.jpg_ufpowt",
    rating: 4.2,
    hearts: 140,
  },
  {
    name: "Palm Wine",
    description: "Natural palm tree sap",
    price: 1500,
    category: "Drinks",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448620/palm-wine-1_arj6lm.jpg",
    imagePublicId: "palm-wine-1_arj6lm",
    popular: true,
    rating: 4.7,
    hearts: 220,
  },
  {
    name: "Chapman",
    description: "Colorful Nigerian cocktail",
    price: 1200,
    category: "Drinks",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448716/07-Nigerias-Favorite-Mocktail-Chapman-Drink-All-Focus_xttwll.jpg",
    imagePublicId:
      "07-Nigerias-Favorite-Mocktail-Chapman-Drink-All-Focus_xttwll",
    rating: 4.6,
    hearts: 200,
  },

  // Desserts
  {
    name: "Chin Chin",
    description: "Crunchy fried snack",
    price: 1000,
    category: "Dessert",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753448897/Chin_Chin_siayqs.jpg",
    imagePublicId: "Chin_Chin_siayqs",
    rating: 4.5,
    hearts: 180,
  },
  {
    name: "Plantain Chips",
    description: "Crispy fried plantain slices",
    price: 800,
    category: "Snack",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753449050/Plantain-Chips-FT-RECIPE0623-24212663ea004a3eaccd777221489165_g81yps.jpg",
    imagePublicId:
      "Plantain-Chips-FT-RECIPE0623-24212663ea004a3eaccd777221489165_g81yps",
    rating: 4.4,
    hearts: 170,
  },
  {
    name: "Biscuit Roll",
    description: "Layered pastry with sweet filling",
    price: 600,
    category: "Dessert",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753449084/Crispy-Egg-Roll-Cookies-banner_yamhrm.jpg",
    imagePublicId: "Crispy-Egg-Roll-Cookies-banner_yamhrm",
    rating: 4.3,
    hearts: 160,
  },

  // Breakfast Items
  {
    name: "Yam & Egg Sauce",
    description: "Boiled yam with scrambled eggs",
    price: 1800,
    category: "Breakfast",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753449130/3328589_1671632021.367_original_pbiwat.jpg",
    imagePublicId: "3328589_1671632021.367_original_pbiwat",
    rating: 4.6,
    hearts: 200,
  },
  {
    name: "Beans & Plantain",
    description: "Stewed beans with fried plantain",
    price: 1500,
    category: "Breakfast",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753452599/IMG_8252-scaled_uerjcj.jpg",
    imagePublicId: "IMG_8252-scaled_uerjcj",
    rating: 4.5,
    hearts: 190,
  },
  {
    name: "Bread & Akara",
    description: "Fresh bread with bean cakes",
    price: 1200,
    category: "Breakfast",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753449229/Akara-and-bread-for-Nigerian-Akara-recipe_nmmoxj.jpg",
    imagePublicId: "Akara-and-bread-for-Nigerian-Akara-recipe_nmmoxj",
    rating: 4.4,
    hearts: 175,
  },
  {
    name: "Pap & Moi Moi",
    description: "Corn pudding with bean pudding",
    price: 1000,
    category: "Breakfast",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753449296/tasty-meal-nigerian-moi-moi-tasty-cereal-pap-tray-three-metal-cups-beans-cake-nigerian-moi-moi-served-191917082_jwgmwm.jpg",
    imagePublicId:
      "tasty-meal-nigerian-moi-moi-tasty-cereal-pap-tray-three-metal-cups-beans-cake-nigerian-moi-moi-served-191917082_jwgmwm",
    rating: 4.3,
    hearts: 165,
  },

  // Special Dishes
  {
    name: "Nigerian Salad",
    description: "Colorful vegetable salad with dressing",
    price: 2000,
    category: "Lunch",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753449322/DSC_0152-2_20191216223522706-scaled_yqtwai.jpg",
    imagePublicId: "DSC_0152-2_20191216223522706-scaled_yqtwai",
    rating: 4.5,
    hearts: 185,
  },
  {
    name: "Abacha",
    description: "African salad made with cassava",
    price: 2200,
    category: "Lunch",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753449362/maxresdefault_bnj0ed.jpg",
    imagePublicId: "maxresdefault_bnj0ed",
    rating: 4.6,
    hearts: 195,
  },
  {
    name: "Isi Ewu",
    description: "Spicy goat head delicacy",
    price: 3800,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753449820/ISIEWU_qmsm0c.jpg",
    imagePublicId: "ISIEWU_qmsm0c",
    rating: 4.7,
    hearts: 230,
  },
  {
    name: "Fisherman Soup",
    description: "Rich seafood soup from the Niger Delta",
    price: 4200,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753451115/Fisherman-Soup-IG-1_iwp5yn.jpg",
    imagePublicId: "Fisherman-Soup-IG-1_iwp5yn",
    rating: 4.8,
    hearts: 260,
  },

  // Extras
  {
    name: "Dodo",
    description: "Fried ripe plantain",
    price: 1000,
    category: "Side",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753451146/Dodo-Recipe-Maureen-Celestine-Step-04-16617aaaa2fd4597bf777ebad11c207d_xaa9bo.jpg",
    imagePublicId:
      "Dodo-Recipe-Maureen-Celestine-Step-04-16617aaaa2fd4597bf777ebad11c207d_xaa9bo",
    rating: 4.5,
    hearts: 190,
  },
  {
    name: "Coleslaw",
    description: "Creamy cabbage salad",
    price: 800,
    category: "Side",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753451167/Classic-homemade-coleslaw-cd8edba_nnr3oc.jpg",
    imagePublicId: "Classic-homemade-coleslaw-cd8edba_nnr3oc",
    rating: 4.3,
    hearts: 160,
  },
  {
    name: "Pepper Soup",
    description: "Spicy broth with assorted meats",
    price: 2500,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753451207/20220425-peppersoup-Maureen-Celestine-23-hero-01-9e718e54b58b4b19af8b6f7011ca7b16_zm3ihp.jpg",
    imagePublicId:
      "20220425-peppersoup-Maureen-Celestine-23-hero-01-9e718e54b58b4b19af8b6f7011ca7b16_zm3ihp",
    rating: 4.6,
    hearts: 210,
  },
  {
    name: "Asun",
    description: "Spicy roasted goat meat",
    price: 3200,
    category: "Dinner",
    imageUrl:
      "https://res.cloudinary.com/dwsquh9ah/image/upload/v1753451231/Asun-recipe-IG-1_alpysi.jpg",
    imagePublicId: "Asun-recipe-IG-1_alpysi",
    popular: true,
    rating: 4.7,
    hearts: 240,
  },
];

// Seeder Function
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data (optional)
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert new data
    await Product.insertMany(nigerianFoods);
    console.log(`Successfully seeded ${nigerianFoods.length} Nigerian foods`);
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    mongoose.disconnect();
  }
};

seedDatabase();
