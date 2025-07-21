import { userService } from "./userService";
import { orderService } from "./orderService";
import { authService } from "./authService";
import { cartService } from "./cartService";
import { productService } from "./productService";

export const apiServices = {
  user: userService,
  orders: orderService,
  auth: authService,
  cart: cartService,
  products: productService,
};
