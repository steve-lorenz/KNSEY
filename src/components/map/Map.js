import React from 'react'
import { Link } from 'react-router-dom'

const Map = () => {

   return (
      <div className="container center">
         <h1 style={{marginBottom: '50%'}}>Map</h1>
         <Link to="/create"><button className="btn deep-purple darken-4">Rank your city</button></Link>
      </div>
   )

}

export default Map