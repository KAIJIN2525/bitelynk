import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Contact from './pages/Contact/Contact'
import About from './pages/About/About'
import Menu from './pages/Menu/Menu'
import Cart from './pages/Cart/Cart'


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/about' element={<About />} />
      <Route path='/menu' element={<Menu />} />
      <Route path='/cart' element={<Cart />} />

      <Route path='/login' element={<Home />} />
    </Routes>
  )
}

export default App