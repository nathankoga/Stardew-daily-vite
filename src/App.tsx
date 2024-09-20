import GuessBox from './components/GuessBox.tsx'
import './App.css'


function App() {

  return (
    <div>
      <img src="sdv_logo.png" className="appLogo"/>
      <div className="mainApp"> 
        <h1 className="main_title">Welcome to Stardew Daily!</h1>
        <div className="main_header"> Guess the Stardew item!</div>
        <GuessBox />
      </div>
    </div>
  )
}

export default App
