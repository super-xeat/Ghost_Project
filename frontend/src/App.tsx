import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './page/login';
import Register from './page/register';
import ChatRoom from './components/chat';
import Authcontext from './context/authcontext';
import { useAuth } from './context/authcontext';
import Messagerie from './components/messagerie';


export default function App() {
  
  const socket = new WebSocket('')
  const {user} = useAuth()

  socket.onmessage = function(e) {
    const data = JSON.parse(e.data)

    if (data.type === "notifier_demande_ami" || user?.Etat === 'en ligne') {

      alert('vous avez une nouvelle demande')
    }
  }
  return (  
    <Authcontext>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/chat' element={<ChatRoom />}/>
          <Route path='/Accueil' element={<Messagerie />}/>
        </Routes>
      </BrowserRouter>
    </Authcontext>
  )
}


