import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './page/login';
import Register from './page/register';
import ChatRoom from './components/chat';
import Authcontext from './context/authcontext';
import Messagerie from './components/messagerie';
import Navbar from './components/navbar';
import Demande_Amis from './components/demande_ami_liste';
import Profile from './page/profile';
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Liste_amis from './page/liste_amis';

export default function App() {
  
  const theme = createTheme()

  return (  
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Authcontext>       
          <Navbar/>
              <Routes>
              <Route path='/' element={<Login/>}/>
              <Route path='/profile/:id' element={<Profile/>}/>
              <Route path='/register' element={<Register />}/>
              <Route path='/chatroom1/discussion/:id' element={<ChatRoom mode={'discussion'}/>}/>
              <Route path='/chatroom1/profile/:id' element={<ChatRoom mode={'profile'}/>}/>
              <Route path='/chatroom1/groupe/:id' element={<ChatRoom mode={'groupe'}/>}/>
              <Route path='/demande_amis' element={<Demande_Amis />}/>
              <Route path='/Accueil' element={<Messagerie />}/>
              <Route path='/Liste_amis/:id' element={<Liste_amis/>}/>
            </Routes>       
        </Authcontext>
      </BrowserRouter>
    </ThemeProvider>
  )
}


