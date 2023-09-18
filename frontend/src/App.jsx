import {Routes,Route} from 'react-router-dom';
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Users from './components/Users';
import Notfound from './components/Notfound';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
        <Route path="register" element={<Register/>}/>
        <Route path="login" element={<Login />} />
        <Route path='users' element={<Users />}/>
        <Route path="*" element={<Notfound/>}/>
    </Routes>
  )
}

export default App
