import Navbar from "./components/Navbar";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import AddItems from "./components/AddItems";
import List from "./components/List";
import Order from "./components/Order";
import { Toaster } from "sonner";
import EditItem from "./components/EditItem";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<AddItems />} />
        <Route path="/list" element={<List />} />
        <Route path="/order" element={<Order />} />
        <Route path="/update/:id" element={<EditItem />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
