import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import SearchPage from './pages/SearchPage.jsx'
import WatchlistPage from './pages/WatchlistPage.jsx'

function App() {
  return (
    <div className="min-h-screen bg-cs-darker">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
