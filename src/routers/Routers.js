import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Login from "../components/Login"
import Signup from "../components/Signup"
import Home from '../components/Home'
import Profile from '../components/Profile'
import Watchlist from '../components/Watchlist'
import Market from '../components/Market'
import Portfolio from '../components/Portfolio'
import PortfolioForm from '../components/PortfolioForm'
import News from '../components/News'
import StockDetails from '../components/StockDetails'
import CryptoAll from '../components/crypto/CryptoAll'
import CryptoDetail from '../components/crypto/CrytpoDetail'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Routers = () => {
  return (
    <>
    <ToastContainer theme='colored'/>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/market" element={<Market />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolioAdd" element={<PortfolioForm />} />
            <Route path="/portfolioAdd/:symbol" element={<PortfolioForm />} />
            <Route path="/news" element={<News />} />
            <Route path="/stock/:symbol" element={<StockDetails />} />
            <Route path="/crypto" element={<CryptoAll />} />
            <Route path="/crypto/:id" element={<CryptoDetail />} />
        </Routes>
    </>
  )
}

export default Routers
