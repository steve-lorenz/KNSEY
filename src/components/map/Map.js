import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import MapGL, { Marker, Popup } from 'react-map-gl';
import { getCity, createCity, setCity } from '../../store/actions/cityActions'
import { getRanking } from '../../store/actions/rankActions'
import Geocoder from 'react-mapbox-gl-geocoder'
import { bindActionCreators } from 'redux'
import axios from 'axios'

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
         showPopup: false,
      };

    }

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

    handleSearhResult = (viewport, result) => {
       const center = result.center
       const cityName = result.text
       this.setState({
         marker: { 
            latitude: center[1], 
            longitude: center[0]
         }
       })
       this.props.getCity(cityName)

      return this.handleViewportChange({
         ...viewport
      });
    }

    renderPopUp = () => {
      const { city } = this.props

      this.setState({
         popupInfo: this.props.city, 
         showPopup: true
      })
      this.props.getRanking(city.cityId)
    }

    renderCityMarker = () => {
      const { marker } = this.state
      return (
        <Marker 
          key={`1234`}
          longitude={marker.longitude}
          latitude={marker.latitude} >
          <i onClick={() => this.renderPopUp()} className="far fa-star fa-8x"></i>
        </Marker>
      );
    }

	geoSuccess = pos => {
      const coords = pos.coords;
		this.getReverseGeoCode(coords);
		this.setState({ 
			userLocation: true
		})
    }
    
	geoError = err => {
		console.warn(`ERROR(${err.code}): ${err.message}`);
		console.log("Sorry, you can't make a ranking without confirming your current location.")
	}

	getReverseGeoCode = (coords) => {
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?types=place&access_token=pk.eyJ1IjoiZHVja21vdXRoYmVhc3QiLCJhIjoiY2pvbjliNjJ0MHNsOTN4cm9qMngzemdnMSJ9.VswQoW3vwNt8WJzbBG0FFg`

		axios.get(`${url}`)
		.then(response =>  {
	
		if(response.statusText === 'OK'){
         const city = response.data.features[0].place_name.split(',')
         const cityName = city[0].trim()
         const state = city[1].trim()
         const country = city[2].trim()
			this.setState({
				cityName: cityName,
				state: state,
				country: country
         })
         this.props.setCity({
            cityName: cityName,
				state: state,
				country: country
         })
         this.props.getCity(cityName)
         this.props.history.push('/create')
		}
		else {
			return Promise.reject('Something went wrong!')
		}
	
		})
		.catch(error => {
			console.log(error);
		});
   }
   
   renderRanking = () => {
      const options = {
         enableHighAccuracy: true,
         timeout: 10000,
         maximumAge: 0
       };
       
      navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError, options);
   }

   render() {

      const { viewport, popupInfo } = this.state;
      const { city, ranking } = this.props;

      return (
         <div className="map">
            <MapGL
               {...viewport}
               onViewportChange={this.handleViewportChange}
               mapStyle="mapbox://styles/mapbox/dark-v9"
               mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}
            >
            {city ? this.renderCityMarker()
            :
            null
            }
            
            {popupInfo && city.cityId ? 
            <Popup tipSize={5}
               anchor="bottom"
               longitude={this.state.viewport.longitude}
               latitude={this.state.viewport.latitude}
               onClose={() => this.setState({popupInfo: null, showPopup: false})} >
               <h4><Link to={`/${popupInfo.cityId}`}>{city.cityName}</ Link></h4>
               <p>User Average: {this.props.ranking.average ? this.props.ranking.average : 0}</p>
               <p>Total User Rankings: {this.props.ranking.userRanking ? this.props.ranking.userRanking : 0}</p>
            </Popup>
            :
            popupInfo ? 
            <Popup tipSize={5}
               anchor="bottom"
               longitude={this.state.viewport.longitude}
               latitude={this.state.viewport.latitude}
               onClose={() => this.setState({popupInfo: null, showPopup: false})} >
               <h4>No City Ranking Yet.</h4>
            </Popup>
            : 
            null
            }

            <div style={{height: '100%'}}className="container center">
            <p>{ranking ? ranking.totalRankings : null}</p>
               <button onClick={this.renderRanking} className="btn deep-purple darken-4 center">Rank your city</button>
               <Geocoder
                  viewport={viewport}
                  mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}
                  onSelected={this.handleSearhResult}
                  hideOnSelect={true}
                  className='search-box'
               />
            </div>
            </MapGL>
          
         </div>
      )
   }

}

const mapStateToProps = (state) => {
   console.log("Map State", state);
   return {
      auth: state.firebase.auth,
      city: state.city,
      ranking: state.ranking
   }
}

const mapDispatchToProps = (dispatch) => {
   return {
      ...bindActionCreators({ getRanking, getCity, createCity, setCity}, dispatch)
   }
} 

export default connect(mapStateToProps, mapDispatchToProps)(Map)
