import api from "./api";

export const specialOfferService = {
  getSpecialOffers: async () => {
    return await api.get("/products/special-offers");
  },
};
