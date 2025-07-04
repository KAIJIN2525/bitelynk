import React from 'react'
import Home from './components/pages/Home/Home'
import { Route, Routes } from 'react-router-dom'
import Contact from './components/pages/Contact/Contact'
import About from './components/pages/About/About'
import Menu from './components/pages/Menu/Menu'
import Cart from './components/pages/Cart/Cart'

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