import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import MapGL, { Marker, Popup } from 'react-map-gl';
import { getCity } from '../../store/actions/cityActions'
import Geocoder from 'react-map-gl-geocoder'

class Map extends Component {

   constructor(props) {
      super(props);

      this.state = {
         viewport: {
            width: '100%',
            height: '100%',
            latitude: 37.7577,
            longitude: -122.4376,
            zoom: 11
         },
         marker: {
            latitude: 37.7577,
            longitude: -122.4376,
         },
         popupInfo: null,
      };

      this._renderPopup = this._renderPopup.bind(this);
    }

    mapRef = React.createRef();

    componentDidMount() {
      window.addEventListener('resize', this.resize)
      this.resize()
    }
   
    componentWillUnmount() {
      window.removeEventListener('resize', this.resize)
    }
   
    resize = () => {
      this.handleViewportChange({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    handleViewportChange = viewport => {
      this.setState({
        viewport: { ...this.state.viewport, ...viewport }
      });
    };
  

    handleGeocoderViewportChange = viewport => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };
  
      return this.handleViewportChange({
        ...viewport,
        ...geocoderDefaultOverrides
      });
    };

    handleSearhResult = result => {
       const center = result.result.center
       const cityName = result.result.place_name.split(',')[0]
       this.setState({
         marker: { 
            latitude: center[1], 
            longitude: center[0]
         }
       })
       this.props.getCity(cityName)
       console.log(result.result.place_name.split(',')[0])
    }

    _renderCityMarker = () => {
      const { marker } = this.state
      return (
        <Marker 
          key={`1234`}
          longitude={marker.longitude}
          latitude={marker.latitude} >
          <i onClick={() => this.setState({popupInfo: this.props.city})} className="far fa-star fa-8x"></i>
        </Marker>
      );
    }
  
    _renderPopup() {
      const {popupInfo} = this.state;
  
      return popupInfo && (
        <Popup tipSize={5}
          anchor="bottom"
          longitude={this.state.viewport.longitude}
          latitude={this.state.viewport.latitude}
          onClose={() => this.setState({popupInfo: null})} >
          <Link to={`/${popupInfo.cityId}`} >{popupInfo.cityId}</ Link>
          <p>{popupInfo.cityName}</p>
          <button className="btn">Rank this city</button>
        </Popup>
      );
    }

   render() {

      const { viewport } = this.state;
      const { city } = this.props;

      return (
         <div className="map">
            <MapGL
                ref={this.mapRef}
               {...viewport}
               onViewportChange={this.handleViewportChange}
               mapStyle="mapbox://styles/mapbox/dark-v9"
               mapboxApiAccessToken={process.env.REACT_APP_Secret}
            >
            {city ? this._renderCityMarker()
            :
            null
            }
            {this._renderPopup()}

            <div style={{height: '100%'}}className="container center">
               <Link to="/create"><button className="btn deep-purple darken-4 center">Rank your city</button></Link>
               <Geocoder
                  mapRef={this.mapRef}
                  onViewportChange={this.handleGeocoderViewportChange}
                  mapboxApiAccessToken={process.env.REACT_APP_Secret}
                  onResult={this.handleSearhResult}
                  types='place'
               />
            </div>
            </MapGL>
          
         </div>
      )
   }

}

const mapToState = (state) => {
   console.log("Map State", state);
   return {
      auth: state.firebase.auth,
      city: state.city
   }
}

const mapToDispatch = (dispatch) => {
   return {
      getCity: (cityName) => dispatch(getCity(cityName))
   }
} 

export default connect(mapToState, mapToDispatch)(Map)