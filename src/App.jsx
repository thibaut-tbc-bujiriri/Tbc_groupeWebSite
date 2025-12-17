import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Trainers from './pages/Trainers'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Admin from './pages/Admin'
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/services" element={<Layout><Services /></Layout>} />
            <Route path="/trainers" element={<Layout><Trainers /></Layout>} />
            <Route path="/trainer" element={<Layout><Trainers /></Layout>} />
            <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
