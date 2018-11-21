import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import StarRatings from 'react-star-ratings'
import { createRanking } from '../../store/actions/rankActions'
import { createCity } from '../../store/actions/cityActions'
import { bindActionCreators } from 'redux'
import axios from 'axios'

class CreateRanking extends Component {

	constructor(props) {
		super(props);

		this.state = {
			starRating: 0,
			cityName: '',
			state: '',
			country: '',
			userLocation: false,
		}
		this.onClickHandler = this.onClickHandler.bind(this);
		this.goBack = this.goBack.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

	}

	componentDidMount() {
      const options = {
         enableHighAccuracy: true,
         timeout: 10000,
         maximumAge: 0
       };
       
       navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError, options);
	}

	geoSuccess = pos => {
      const coords = pos.coords;
      this.getReverseGeoCode(coords);
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
			this.setState({
				cityName: city[0].trim(),
				state: city[1].trim(),
				country: city[2].trim(),
				userLocation: true
			})
			this.props.createCity({
				cityName: city[0].trim(),
				state: city[1].trim(),
				country:  city[2].trim()
			})

		}
		else {
			return Promise.reject('Something went wrong!')
		}
	
		})
		.catch(error => {
			console.log(error);
		});
	}
   
   goBack() {
      this.props.history.goBack();
   }

   onClickHandler = rating =>  {
		this.setState({
			starRating: rating,
		})
	}
	
	handleSubmit(e) {
		e.preventDefault();
		this.props.createRanking(this.state)
		this.goBack()
   }

   render () {
      const { auth } = this.props;

      if(!auth.uid) return <Redirect to="/signin" />

      return (
		<div className="container">		
			{this.state.userLocation ?
			<div className="container center">
				<div className="row">
					<button style={{marginTop: '20px'}}className="right btn black round" onClick={ this.goBack }>X</button>
				</div>
				<h1>Ranking</h1>
				<h3>{this.state.city}</h3>
				<h5 style={{ marginBottom: '10px' }}>How gay friendly is <strong>{this.state.cityName}</strong>?</h5>
				<StarRatings 
				rating={this.state.starRating} 
				changeRating={ this.onClickHandler } 
				numberOfStars={7} 
				starRatedColor="#311b92"
				starSelectingHoverColor="#311b92"
				/>
				<p> 0. Haters - 6. Very Friendly</p>
				<button className="btn" onClick={ this.handleSubmit }>Submit</button>
			</div>
			:
			<div className="container center">
				<div className="row">
					<button style={{marginTop: '20px'}}className="right btn black round" onClick={ this.goBack }>X</button>
				</div>
				<h1>Ranking</h1>
				<p className="red-text">You need to SHARE your location to rank your current city.</p>
			</div>
			}
		</div>	
      )
}

}

const mapStateToProps = (state) => {
   console.log(state);
   return {
      auth: state.firebase.auth
   }
}

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({ createCity, createRanking }, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRanking)