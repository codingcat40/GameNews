
import './App.css'
import Games from './components/Games'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/games' element = {<Games />}/>
      </Routes>
      
    </Router>
  )
}

export default App
