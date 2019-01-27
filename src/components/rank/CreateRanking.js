import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import StarRatings from 'react-star-ratings'
import { createCity } from '../../store/actions/cityActions'
import { createRanking } from '../../store/actions/rankActions'
import { getCityByName } from '../../utils/City'
import { getRankingByUser } from '../../utils/Ranking'
import { bindActionCreators } from 'redux'
import { ClipLoader } from 'react-spinners'
import axios from 'axios'

class CreateRanking extends Component {

	constructor(props) {
		super(props);

		this.state = {
			starRating: 0,
			state: '',
			country: '',
			loading: true,
			ranking: 0,
			city: {},
		}
		this.onClickHandler = this.onClickHandler.bind(this);
		this.goBack = this.goBack.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getPosition = this.getPosition.bind(this);
	}

	async componentDidMount() {
		const { auth } = this.props;
		const position = await this.main();
		const currentCity = await this.getReverseGeoCode(position);
		const cityDB = await getCityByName(currentCity[0]);
		const ranking = await getRankingByUser(cityDB.cityId, auth.uid);

		if(currentCity) {
			const cityName = currentCity[0].trim()
			const state = currentCity[1].trim()
			const country = currentCity[2].trim()
			this.props.createCity({
				cityName: cityName,
				state: state,
				country: country
			})
			if(cityDB) {
				this.setState({
					state: state,
					country: country,
					loading: false,
					city: cityDB,
					ranking: ranking,
				})
			}
		}
	}

  getPosition() {
		return new Promise((res, rej) => {
			 navigator.geolocation.getCurrentPosition(res, rej);
		});
  }
  
  async main() {
		var position = await this.getPosition();
		return position.coords;
  }

	getReverseGeoCode(coords) {
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?types=place&access_token=pk.eyJ1IjoiZHVja21vdXRoYmVhc3QiLCJhIjoiY2pvbjliNjJ0MHNsOTN4cm9qMngzemdnMSJ9.VswQoW3vwNt8WJzbBG0FFg`
		return new Promise( function(resolve) {
			axios.get(`${url}`)
			.then(response =>  {
			if(response.statusText === 'OK'){
				const city = response.data.features[0].place_name.split(',');
				resolve(city);
			}
			else {
				return Promise.reject('Something went wrong!');
			}
		
			})
			.catch(error => {
				console.log(error);
			});
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
		const { city } = this.state;
		e.preventDefault();
		if(!city) {
			alert("Sorry, KNSEY can not rank a city without your location being shared.")
		}
		else if(!this.state.starRating) {
			alert("You need to select a star rating, it can't be left blank")
		}
		else {
			this.props.createRanking(this.state)
			this.props.history.push(`/${city.cityId}`);
		}
   }

   render () {
		const { auth } = this.props;
		const { state, country, ranking, city } = this.state;
      if(!auth.uid) return <Redirect to="/signin" />

      return (
		<div className="container white-box-container">
			{ city && ranking ?
				<div className="white-box center">
					<h1>You've already ranked <span className='current-city'>{city.cityName}</span></h1>
					<StarRatings
						rating={ranking}
						starDimension="40px"
						starRatedColor="#3B0075"
						numberOfStars={7}
					/>
					<p><span className='rating'>Rating : {ranking}</span></p>
					<p> 0. Unfriendly - 6. Very Friendly</p>
					<Link to="/"><button className="btn find-btn center">Find a City</button></Link>
				</div> 
				: 
				state && country ? 
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
		...bindActionCreators({ createCity, createRanking }, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRanking)