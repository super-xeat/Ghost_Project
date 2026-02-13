import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './page/login';
import Register from './page/register';
import ChatRoom from './components/chat';
import Authcontext from './context/authcontext';
import Messagerie from './components/messagerie';
import Navbar from './components/navbar';
import Demande_Amis from './components/demande_ami_liste';
import Profile from './page/profile';


export default function App() {
  
  
  return (  
    <Authcontext>
      <BrowserRouter>
        <Navbar/>
            <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/chatroom/:id' element={<ChatRoom />}/>
            <Route path='/demande_amis' element={<Demande_Amis />}/>
            <Route path='/Accueil' element={<Messagerie />}/>
          </Routes>
      </BrowserRouter>
    </Authcontext>
  )
}


