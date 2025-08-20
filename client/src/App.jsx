import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTheme } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MentorList from './pages/MentorList'
import MentorProfile from './pages/MentorProfile'
import BookingSuccess from './pages/BookingSuccess'
import AddMentor from './components/AddMentor'

function App() {
  const { isDark } = useTheme()

  React.useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.style.setProperty('--toast-bg', '#374151')
      root.style.setProperty('--toast-color', '#f9fafb')
      root.style.setProperty('--toast-border', '#4b5563')
    } else {
      root.style.setProperty('--toast-bg', '#ffffff')
      root.style.setProperty('--toast-color', '#111827')
      root.style.setProperty('--toast-border', '#e5e7eb')
    }
  }, [isDark])

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${isDark ? 'dark' : ''}`}>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mentors" element={<MentorList />} />
          <Route path="/mentor/:id" element={<MentorProfile />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/mentors/add" element={<AddMentor/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App