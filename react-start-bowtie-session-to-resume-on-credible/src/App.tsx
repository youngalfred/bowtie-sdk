import React from 'react'
import logo from './logo.png'
import './App.css'
import Instructions from './components/Instructions'
import StarterForm from './components/StarterForm'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="Credible-logo" alt="logo" />
      </header>

      <main>
        <Instructions />
        <StarterForm />
      </main>
    </div>
  )
}

export default App
