import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import MapGL, { Marker, Popup } from 'react-map-gl';
import { getCity, createCity, setCity } from '../../store/actions/cityActions'
import { getRanking } from '../../store/actions/rankActions'
import { getComments } from '../../store/actions/commentActions'
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
         marker : {
            latitude: 37.7577,
            longitude: -122.4376,
         },
         popupInfo: null,
         showPopup: false,
         isMarkerShowing: false,
         isInputShowing: true,
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
      const cityName = result.text
      this.props.getCity(cityName)
      this.setState({
         marker: {
            latitude: viewport.latitude,
            longitude: viewport.longitude
         },
         isMarkerShowing: true
      })
      return this.handleViewportChange({
         ...viewport
      });
    }

    renderPopUp = () => {
      const { city } = this.props

      this.setState({
         popupInfo: this.props.city, 
         showPopup: true,
         isInputShowing: false
      })
      this.props.getRanking(city.cityId)
      this.props.getComments(city.cityId)
    }

    renderCityMarker = () => {
      if(this.state.isMarkerShowing) {
         return (
            <Marker 
              key={`1234`}
              longitude={this.state.marker.longitude}
              latitude={this.state.marker.latitude} >
              <i onClick={() => this.renderPopUp()} className="fas fa-map-marker-alt fa-5x"></i>
            </Marker>
          );
      }
    }

   render() {

      const { viewport, popupInfo } = this.state;
      const { city, ranking } = this.props;
      const queryParams = {
         types: 'place'
      }

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
            <Popup tipSize={7}
               closeOnClick={false}
               anchor="bottom"
               longitude={this.state.marker.longitude}
               latitude={this.state.marker.latitude}
               onClose={() => this.setState({popupInfo: null, showPopup: false, isInputShowing: true})} >
               <h4><Link to={`/${popupInfo.cityId}`}>{city.cityName}</ Link></h4>
               <p>User Average: {this.props.ranking.average ? this.props.ranking.average : 0}</p>
               <p>Total User Rankings: {this.props.ranking.userRanking ? this.props.ranking.userRanking : 0}</p>
            </Popup>
            :
            popupInfo ? 
            <Popup tipSize={5}
               anchor="bottom"
               longitude={this.state.marker.longitude}
               latitude={this.state.marker.latitude}
               onClose={() => this.setState({popupInfo: null, showPopup: false, isInputShowing: true})} >
               <h4>No City Ranking Yet.</h4>
            </Popup>
            : 
            null
            }
            {this.state.isInputShowing ?
            <div style={{height: '100%'}}className="container center">
            <p>{ranking ? ranking.totalRankings : null}</p>
     
               <Link to='/create'><button className="btn center rank-btn">Rank your city</button></Link>
               <Geocoder
               viewport={viewport}
               mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}
               onSelected={this.handleSearhResult}
               hideOnSelect={true}
               className='search-box'
               queryParams={ queryParams }
               />

            </div>
            : null}
            </MapGL>
          
         </div>
      )
   }

}

const mapStateToProps = (state) => {
   return {
      auth: state.firebase.auth,
      city: state.city,
      ranking: state.ranking
   }
}

const mapDispatchToProps = (dispatch) => {
   return {
      ...bindActionCreators({ getRanking, getCity, getComments, createCity, setCity}, dispatch)
   }
} 

export default connect(mapStateToProps, mapDispatchToProps)(Map)
