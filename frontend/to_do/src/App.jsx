import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Add from './AddTask'
import {BrowserRouter,Routes,Route} from "react-router-dom";
import { Link } from 'react-router-dom'

function Home() {
  return(
    <>
     <h1>Welcome to the Homepage</h1>;
     
     
     
      <Link to="/add-task">
      <h1 className='bg-red'>Click on this page to go to the add task page</h1>
      </Link>
    </>
   

  );
  
  
  
}


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/add-task" element={<Add />} />
        
        </Routes>
      
      </BrowserRouter>
     
      
    </>
  )
}

export default App
