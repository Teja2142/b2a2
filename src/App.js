import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navrbar';
import Home from './Home';
import Vehicles from './Vehicles';
import Login from './Login';
import Register from './Register';
import Admin from './Admin';
import test2 from './test2';
import Auctions from './Auctions';
import About from './About';
import Contact from './Contact';
import Services from './Services';




function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/Admin" element={<Admin/>}/>
        <Route path="/test2" element={<Admin />} />
        <Route path='/Auctions' element={<Auctions/>}/>
        <Route path="/About" element={<About />} />
        <Route path='/Contact' element={<Contact/>}/>
        <Route path='/Services' element={<Services/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
