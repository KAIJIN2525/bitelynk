import { orderService } from "./orderService";
import { productService } from "./productService";


export const apiServices = {
    products: productService,
    orders: orderService,
}