import { useState } from 'react'
import './App.css'
import ApplicationContainer from './components/applications/application-container'
import Header from './components/header/header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
      <Header />
      <div className="card">
            <ApplicationContainer />
      </div>
    </div>
  )
}

export default App
