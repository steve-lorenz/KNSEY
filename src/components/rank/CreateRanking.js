import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import StarRatings from 'react-star-ratings'
import { createRanking, getUserRanking } from '../../store/actions/rankActions'
import { createCity, getCity, setCity } from '../../store/actions/cityActions'
import { bindActionCreators } from 'redux'
import { ClipLoader } from 'react-spinners'
import axios from 'axios'

class CreateRanking extends Component {

	constructor(props) {
		super(props);

		this.state = {
			starRating: 0,
			cityName: '',
			state: '',
			country: '',
			loading: true
		}
		this.onClickHandler = this.onClickHandler.bind(this);
		this.goBack = this.goBack.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

	}

	componentDidMount () {
		const { city } = this.props;
		if( city.cityId ){
			this.props.getCity(city.cityName);
			this.setState({
				loading: false
			})
		}
		this.renderRanking();
	}

	componentWillUnmount (){
		this.props.getCity(' ');
	}

	componentDidUpdate(prevProps) {
		if (this.props.city !== prevProps.city) {
			const { city } = this.props;
			this.setState({
				cityName: city.cityName,
				state: city.state,
				country: city.country,
				loading: false
			})
			this.props.getUserRanking(city.cityId);
		}

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
         this.props.createCity({
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
   
   goBack() {
		this.props.history.goBack();
   }

   onClickHandler = rating =>  {
		this.setState({
			starRating: rating,
		})
	}
	
	handleSubmit(e) {
		const { city } = this.props;
		e.preventDefault();
		if(!city.cityId) {
			alert("Sorry, KNSEY can not rank a city without your location being shared.")
		}
		else if(!this.state.starRating) {
			alert("You need to select a star rating, it can't be left blank")
		}
		else {
			this.props.createRanking(this.state)
			this.goBack()
		}
   }

   render () {
		const { auth, city, ranking } = this.props;
		console.log("ranking stuff", city)
      if(!auth.uid) return <Redirect to="/signin" />

      return (
		<div className="container white-box-container">
			{ city && ranking.average ?
				<div className="white-box center">
					<h1>You've already ranked <span className='current-city'>{city.cityName}</span></h1>
					<StarRatings
						rating={ranking.average}
						starDimension="40px"
						starRatedColor="#3B0075"
						numberOfStars={7}
					/>
					<p><span className='rating'>Rating : {ranking.average}</span></p>
					<p> 0. Unfriendly - 6. Very Friendly</p>
					<Link to="/"><button className="btn find-btn center">Find a City</button></Link>
				</div> 
				: 
				city ? 
				<div className="white-box center">
					<h1>RANK YOUR CITY</h1>
					<p className='question'>How gay friendly is <span className='current-city'>{city.cityName}</span> ?</p>
					<StarRatings 
					rating={this.state.starRating} 
					changeRating={ this.onClickHandler }
					starDimension="40px" 
					numberOfStars={7} 
					starRatedColor="#3B0075"
					starHoverColor="#3B0075"
					/>
					<p> 0. Unfriendly - 6. Very Friendly</p>
					<button className="btn" onClick={ this.handleSubmit }>Submit</button>
				</div>
				:
				<div className='MoonLoader center'>
					<ClipLoader
					className={'spinner'}
					sizeUnit={"px"}
					size={150}
					color={'#3B0075'}
					loading={this.state.loading}
					/>
				</div> 					

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
		...bindActionCreators({ createCity, createRanking, getUserRanking, getCity, setCity }, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRanking)