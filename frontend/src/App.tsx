import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './page/login';
import Register from './page/register';


export default function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path='/' element={<Login/>}/>
        <Route path='register/' element={<Register />}/>
      </Routes>
    </BrowserRouter>
  )
}


