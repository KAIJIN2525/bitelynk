// DUMMY DATA FOR TESTING CREATE ORDER FUNCTION
// BiteLynk Backend Order Testing

// ====================================================
// 📋 TEST DATA FOR POSTMAN/FRONTEND
// ====================================================

// 1. BASIC ORDER DATA (Required Fields)
export const basicOrderData = {
  firstName: "John",
  lastName: "Doe", 
  email: "john.doe@example.com",
  phone: "08012345678",
  address: "123 Ikorodu Road, Palmgroove",
  city: "Lagos",
  state: "Lagos",
  zip: "100001",
  country: "Nigeria",
  deliveryFee: 500,
  paymentMethod: "paystack"
};

// 2. COMPREHENSIVE ORDER DATA (All Fields)
export const fullOrderData = {
  firstName: "Adebayo",
  lastName: "Ogundimu",
  email: "adebayo.ogundimu@gmail.com", 
  phone: "08098765432",
  address: "45 Allen Avenue, Ikeja",
  city: "Lagos",
  state: "Lagos",
  zip: "100271",
  country: "Nigeria",
  deliveryFee: 800,
  paymentMethod: "paystack"
};

// 3. CASH ON DELIVERY ORDER
export const codOrderData = {
  firstName: "Fatima",
  lastName: "Ibrahim",
  email: "fatima.ibrahim@yahoo.com",
  phone: "07033445566",
  address: "78 Ahmadu Bello Way, Victoria Island",
  city: "Lagos", 
  state: "Lagos",
  zip: "101241",
  country: "Nigeria",
  deliveryFee: 1000,
  paymentMethod: "Cash on Delivery"
};

// 4. DIFFERENT LOCATION ORDER
export const abujaOrderData = {
  firstName: "Chinedu",
  lastName: "Okwu",
  email: "chinedu.okwu@hotmail.com",
  phone: "08177889900",
  address: "12 Gana Street, Maitama",
  city: "Abuja",
  state: "FCT",
  zip: "900001",
  country: "Nigeria", 
  deliveryFee: 1200,
  paymentMethod: "paystack"
};

// 5. MINIMUM DELIVERY FEE ORDER
export const minOrderData = {
  firstName: "Blessing",
  lastName: "Eze",
  email: "blessing.eze@outlook.com",
  phone: "09011223344",
  address: "5 New Market Road, Onitsha",
  city: "Onitsha",
  state: "Anambra", 
  zip: "434101",
  country: "Nigeria",
  deliveryFee: 0, // Free delivery
  paymentMethod: "paystack"
};

// ====================================================
// 🧪 TESTING SCENARIOS
// ====================================================

// TEST 1: Valid Order Creation
export const testValidOrder = {
  method: "POST",
  url: "/api/orders",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer your_jwt_token_here"
  },
  body: basicOrderData
};

// TEST 2: Missing Required Fields
export const testMissingFields = {
  method: "POST", 
  url: "/api/orders",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer your_jwt_token_here"
  },
  body: {
    firstName: "John",
    // Missing lastName, email, etc.
    phone: "08012345678"
  }
};

// TEST 3: Invalid Email Format
export const testInvalidEmail = {
  method: "POST",
  url: "/api/orders", 
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer your_jwt_token_here"
  },
  body: {
    ...basicOrderData,
    email: "invalid-email-format"
  }
};

// TEST 4: Empty Cart Scenario
export const testEmptyCart = {
  method: "POST",
  url: "/api/orders",
  headers: {
    "Content-Type": "application/json", 
    "Authorization": "Bearer your_jwt_token_here"
  },
  body: basicOrderData,
  note: "Make sure user's cart is empty before testing"
};

// ====================================================
// 📱 POSTMAN COLLECTION FORMAT
// ====================================================

export const postmanTests = [
  {
    name: "Create Order - Valid Data",
    request: {
      method: "POST",
      url: "{{base_url}}/api/orders",
      header: [
        {
          key: "Content-Type",
          value: "application/json"
        }
      ],
      body: {
        mode: "raw",
        raw: JSON.stringify(basicOrderData, null, 2)
      }
    },
    expectedStatus: 201,
    expectedResponse: {
      success: true,
      message: "Order created successfully",
      order: {
        id: "expect_mongodb_id",
        reference: "expect_BL_reference", 
        total: "calculated_total_with_vat",
        status: "processing"
      },
      payment: {
        authorization_url: "paystack_checkout_url",
        access_code: "paystack_access_code",
        reference: "payment_reference"
      }
    }
  },
  
  {
    name: "Create Order - Cash on Delivery",
    request: {
      method: "POST",
      url: "{{base_url}}/api/orders",
      header: [
        {
          key: "Content-Type", 
          value: "application/json"
        }
      ],
      body: {
        mode: "raw",
        raw: JSON.stringify(codOrderData, null, 2)
      }
    },
    expectedStatus: 201,
    expectedResponse: {
      success: true,
      message: "Order placed successfully",
      order: {
        id: "expect_mongodb_id",
        total: "calculated_total",
        status: "processing",
        paymentMethod: "Cash on Delivery"
      }
    }
  }
];

// ====================================================
// 🔧 SETUP INSTRUCTIONS
// ====================================================

export const testingInstructions = `
TESTING CREATE ORDER FUNCTION - SETUP GUIDE
==========================================

PREREQUISITES:
1. ✅ User must be authenticated (valid JWT token)
2. ✅ User must have items in cart 
3. ✅ Server must be running on localhost:4000
4. ✅ MongoDB connection active
5. ✅ Paystack keys configured in .env

STEP 1: CREATE USER & LOGIN
---------------------------
POST /api/users/register
{
  "firstName": "Test",
  "lastName": "User", 
  "email": "test@example.com",
  "password": "password123"
}

POST /api/users/login  
{
  "email": "test@example.com",
  "password": "password123"
}
// Save the JWT token from response

STEP 2: ADD ITEMS TO CART
-------------------------
POST /api/cart
{
  "productId": "your_product_id_here",
  "quantity": 2
}

STEP 3: CREATE ORDER
-------------------
POST /api/orders
Headers: Authorization: Bearer your_jwt_token
Body: Use any of the dummy data objects above

EXPECTED FLOW:
1. Order created in database ✅
2. VAT calculated (7.5%) ✅  
3. Paystack payment initialized ✅
4. Cart cleared after successful order ✅
5. Payment URL returned for frontend ✅

TROUBLESHOOTING:
- "Cart is empty" → Add items to cart first
- "Unauthorized" → Check JWT token
- "Payment initialization failed" → Check Paystack keys
- "All delivery details required" → Check required fields
`;

// ====================================================
// 📊 SAMPLE EXPECTED RESPONSES
// ====================================================

export const expectedResponses = {
  success: {
    status: 201,
    body: {
      success: true,
      message: "Order created successfully",
      order: {
        id: "64f1234567890abcdef12345",
        reference: "BL_1705234567_ABC123", 
        total: 2375, // Example: ₦2000 + ₦300 VAT + ₦500 delivery
        status: "processing"
      },
      payment: {
        authorization_url: "https://checkout.paystack.com/xyz789abc",
        access_code: "rk_test_abc123def456",
        reference: "BL_1705234567_ABC123"
      }
    }
  },
  
  missingFields: {
    status: 400,
    body: {
      success: false,
      message: "All delivery details are required"
    }
  },
  
  emptyCart: {
    status: 400,
    body: {
      success: false,
      message: "Cart is empty"
    }
  },
  
  paymentFailed: {
    status: 400,
    body: {
      success: false,
      message: "Payment initialization failed",
      error: "Paystack error details"
    }
  }
};

// ====================================================
// 🚀 READY TO USE - COPY & PASTE INTO POSTMAN
// ====================================================
