
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import MainPage from './components/MainPage'
import SingleMovie from './components/SingleMovie'
import './App.css'
import Navbar from './components/Navbar'
import Favoritos from './components/Favoritos';
import Modal from 'react-modal';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserContext from './components/UserContext';
import { useState } from 'react';
import './App.css';

Modal.setAppElement('#root');

function App() {
  const [user, setUser] = useState(null);
  return (
    <div className='body-background'>
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/movies/:id" element={<SingleMovie />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/inicio_sesion" element={<LoginPage />} /> 
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
    </div>
  )
}

export default App
