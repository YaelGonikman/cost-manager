// Yael Gonikman 206752396 0522430787 yaelgonikman@gmail.com
// Shay peretz 319126405 0508317979 shay28561@gmail.com

import './App.css'
import Products from "./components/Products.jsx";
import 'react-notifications-component/dist/theme.css'
import { ReactNotifications } from 'react-notifications-component'

function App() {
    return (
      <div style={{justifyContent: 'center', display:'flex', width: "100vw", height:"100vh"}}>
          <div style={{marginRight: '20px', display:'flex', flexDirection:'row'}}>
              <Products/>
          </div>
          <ReactNotifications/>
      </div>
  )
}

export default App
