import './App.css'
import Products from "./components/Products.jsx";

function App() {
    return (
      <div style={{justifyContent: 'center', display:'flex', width: "100vw", height:"100vh"}}>
          <div style={{marginRight: '20px', display:'flex', flexDirection:'row'}}>
              <Products/>
          </div>
      </div>
  )
}

export default App
