import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCity, createCity, setCity } from '../../store/actions/cityActions'
import { getRanking } from '../../store/actions/rankActions'
import { getComments } from '../../store/actions/commentActions'
import { bindActionCreators } from 'redux'
import Geocoder from 'react-geocoder-mapbox'
import { getCityByName } from '../../utils/City'

class Landing extends Component {

   constructor(props) {
      super(props);
      
      this.handleSearhResult = this.handleSearhResult.bind(this);
   }


   async handleSearhResult (result){
      const cityName = result.text
      let cityResults = await getCityByName(cityName);
      if(cityResults) {
         this.props.history.push(`/${cityResults.cityId}`);
      }
   }

   render() {
      return (
         <div className="container">
            <Geocoder
            inputClass='ac-box'
            resultsClass='search-results'
            accessToken={process.env.REACT_APP_MAPBOX_API}
            onSelect={this.handleSearhResult}
            inputPlaceholder='Search for city...'
            types='place'
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
