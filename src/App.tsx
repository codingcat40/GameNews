
import './App.css'
import GameDetail from './components/GameDetail'
import Games from './components/Games'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/games' element = {<Games />}/>
        <Route path='/games/game/:id' element = {<GameDetail />}/>
      </Routes>
      
    </Router>
  )
}

export default App
