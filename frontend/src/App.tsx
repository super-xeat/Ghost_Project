import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './page/login';
import Register from './page/register';
import Training from './page/training';

export default function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/training' element={<Training/>}/>
        <Route path='/' element={<Login/>}/>
        <Route path='register/' element={<Register />}/>
      </Routes>
    </BrowserRouter>
  )
}


