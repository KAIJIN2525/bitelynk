import { orderService } from "./orderService";
import { productService } from "./productService";
import { userService } from "./userService";


export const apiServices = {
    products: productService,
    orders: orderService,
    users: userService,
}