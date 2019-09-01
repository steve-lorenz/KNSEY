import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getCity, createCity, setCity } from '../../store/actions/cityActions'
import { getRanking } from '../../store/actions/rankActions'
import { getComments } from '../../store/actions/commentActions'
import { bindActionCreators } from 'redux'
import Geocoder from 'react-geocoder-mapbox'
import { getCityByName } from '../../utils/City'
import { getRankingById } from '../../utils/Ranking'

class Landing extends Component {

   constructor(props) {
      super(props);
      
      this.state = {
         isNotRanked: false,
         isInputShowing: false,
         cityName: '',
      }
      
      this.handleSearhResult = this.handleSearhResult.bind(this);
      this.handleSuggest = this.handleSuggest.bind(this);
   }

   componentDidMount() {
      const inputSearch = document.querySelector('.ac-box');

      inputSearch.onfocus = () => {
         this.setState({ 
            isInputShowing: true, 
         })
      }

      inputSearch.onfocusout = () => {
         this.setState({ 
            isInputShowing: false, 
         })
      }
   }

   async handleSearhResult(result){
      const cityName = result.text
      this.setState({ cityName: cityName })
      let cityResults = await getCityByName(cityName);
      let cityRanking = await getRankingById(cityResults.cityId);

      if(cityResults && cityRanking) {
         this.props.history.push(`/${cityResults.cityId}`);
      }
      else {
         this.setState({
            isNotRanked: true,
            isInputShowing: false, 
         })
      }
   }

   handleSuggest(e) {
      this.setState({ 
         cityName: '',
         isNotRanked: false,
      })
   }

   render() {
      return (
         <div className="landing-container">
            <div className="landing-jumbotron">
               <h1 id="landing-title">KNSEY</h1>
               <p className="subtitle">See how queer friendly your city is.</p>
               <Geocoder
               inputClass='ac-box'
               resultClass='search-result'
               resultsClass='search-results'
               accessToken={process.env.REACT_APP_MAPBOX_API}
               onSelect={this.handleSearhResult}
               onSuggest={this.handleSuggest}
               focusOnMount={false}
               inputPlaceholder='Search for city...'
               types='place'
               ref="searchInput"
               />
               { this.state.isNotRanked ? <span className='no-ranking'>Sorry, {this.state.cityName} has not been ranked yet.</span> : '' }
            </div>
            { !this.state.isInputShowing ?
            <div className="ranking-container">
               <p className="subtitle">Rank a city using your current location.</p>
               <Link to="/create"><button aria-label="Create ranking" className="btn center"><i className="fas fa-location-arrow"></i></button></Link>
            </div>
            :
            ''
            }

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
