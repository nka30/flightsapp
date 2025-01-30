
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Flights from './components/flights';
import Hotels from './components/hotels';
import Cars from './components/cars';
import Navigation from './components/navbar';
import airplane from './airplane2.png'
function App() {
  return (
    <div className="App">
      <Router>
      <Navigation />
      <Routes>
        <Route path="/flights" element={<Flights />}/>
        <Route path="/hotels" element={<Hotels />}/>
        <Route path="/cars" element={<Cars />}/>
        <Route path="/" element={
            <header className="App-header">
            <img src={airplane} alt="logo" style={{ width: '40%', height: 'auto' }}/>
          </header>
        }/>
      </Routes>
      </Router>
      
    </div>
  );
}

export default App;
