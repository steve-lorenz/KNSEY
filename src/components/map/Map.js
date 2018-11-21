import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import MapGL, { Marker, Popup } from 'react-map-gl';
import { getCity } from '../../store/actions/cityActions'
import { getRanking } from '../../store/actions/rankActions'
import Geocoder from 'react-mapbox-gl-geocoder'
import { bindActionCreators } from 'redux'

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

    renderPopUp = () => {
      const { city } = this.props

      this.setState({
         popupInfo: this.props.city, 
         showPopup: true
      })
      this.props.getRanking(city.cityId)
    }

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

   render() {

      const { viewport, popupInfo } = this.state;
      const { city, ranking } = this.props;

      return (
         <div className="map">
            <MapGL
               {...viewport}
               onViewportChange={this.handleViewportChange}
               mapStyle="mapbox://styles/mapbox/dark-v9"
               mapboxApiAccessToken={process.env.REACT_APP_Secret}
            >
            {city ? this.renderCityMarker()
            :
            null
            }
            {popupInfo ? 
         
            <Popup tipSize={5}
               anchor="bottom"
               longitude={this.state.viewport.longitude}
               latitude={this.state.viewport.latitude}
               onClose={() => this.setState({popupInfo: null, showPopup: false})} >
               <h4><Link to={`/${popupInfo.cityId}`}>{city.cityName}</ Link></h4>
               <p>User Average: {this.props.ranking.average}</p>
               <p>Total User Rankings: {this.props.ranking.userRanking}</p>
            </Popup>
            : 
            null
            }

            <div style={{height: '100%'}}className="container center">
            <p>{ranking ? ranking.totalRankings : null}</p>
               <Link to="/create"><button className="btn deep-purple darken-4 center">Rank your city</button></Link>
               <Geocoder
                  viewport={viewport}
                  mapboxApiAccessToken={process.env.REACT_APP_Secret}
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
      ...bindActionCreators({ getRanking, getCity }, dispatch)
   }
} 

export default connect(mapStateToProps, mapDispatchToProps)(Map)
