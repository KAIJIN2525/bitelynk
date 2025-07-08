import SpecialOffer from '../../components/SpecialOffer/SpecialOffer'
import Banner from '../../components/Banner/Banner'
import Navbar from '../../components/Navbar/Navbar'
import AboutHome from '../../components/AboutHome/AboutHome'

const Home = () => {
  return (
    <>
        <Navbar />
        <Banner />
        <SpecialOffer />
        <AboutHome />
    </>
  )
}

export default Home