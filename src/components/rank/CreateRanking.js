import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
// import { createCity } from '../../store/actions/cityActions'
import { getCityByName, createCityAsync } from '../../utils/City'
import { getRankingByUser, createUserRanking, createCityRanking } from '../../utils/Ranking'
import { ClipLoader } from 'react-spinners'
import Rating from 'react-rating'
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
		var position = null;
		var currentCity = null;
		var ranking = null;
		var cityDB = null;
		try {
			position = await this.main();
			currentCity = await this.getReverseGeoCode(position);
			cityDB = await getCityByName(currentCity.text);
			ranking = await getRankingByUser(cityDB.cityId, auth.uid);
		} catch (e) {
			console.log(e);
		}

		if(currentCity) {
			const city = currentCity.place_name.split(',')
			const cityName = city[0].trim()
			const state = city[1].trim()
			const country = city[2].trim()
			const longitude = currentCity.geometry.coordinates[0]
			const latitude = currentCity.geometry.coordinates[1]
			const coords = {
				latitude: latitude,
				longitude: longitude,
			}

			
			const createCity = await createCityAsync({
				cityName: cityName,
				state: state,
				country: country,
				coords: coords
			});
			
			if(createCity) {
				this.setState({
					state: createCity.state,
					country: createCity.country,
					loading: false,
					city: createCity,
				})
			}

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
				const city = response.data.features[0];
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

   onClickHandler(rating) {
		this.setState({ starRating: rating })
	}
	
	async handleSubmit(e) {
		const { city } = this.state;
		const { auth, profile } = this.props;
		e.preventDefault();
		if(!city) {
			alert("Sorry, KNSEY can not rank a city without your location being shared.")
		}
		else if(!this.state.starRating) {
			alert("You need to select a star rating, it can't be left blank")
		}
		else {
			const userRanking = await createUserRanking(this.state, auth.uid, profile)
			const cityRanking = await createCityRanking(this.state)
			if(cityRanking === 200 && userRanking){
				this.props.history.push(`/${city.cityId}`);
			}
			else{
				alert("There was an error when trying to create your ranking, please try again.")
			}
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
					<Rating
						stop={7}
						readonly
						initialRating={ranking}
						className='ranking-icons'
					   emptySymbol={[<img alt='rating 0 empty' src={require("../../assets/images/unicorn_emp_0.png")} className="icon" />, 
										<img alt='rating 1 empty' src={require("../../assets/images/unicorn_emp_1.png")} className="icon" />, 
										<img alt='rating 2 empty' src={require("../../assets/images/unicorn_emp_2.png")} className="icon" />, 
										<img alt='rating 3 empty' src={require("../../assets/images/unicorn_emp_3.png")} className="icon" />, 
										<img alt='rating 4 empty' src={require("../../assets/images/unicorn_emp_4.png")} className="icon" />,
										<img alt='rating 5 empty' src={require("../../assets/images/unicorn_emp_5.png")} className="icon" />,
										<img alt='rating 6 empty' src={require("../../assets/images/unicorn_emp_6.png")} className="icon" />]}
						fullSymbol={[<img alt='rating 0' src={require("../../assets/images/unicorn_0.png")} className="icon" />, 
										<img alt='rating 1' src={require("../../assets/images/unicorn_1.png")} className="icon" />, 
										<img alt='rating 2' src={require("../../assets/images/unicorn_2.png")} className="icon" />, 
										<img alt='rating 3' src={require("../../assets/images/unicorn_3.png")} className="icon" />, 
										<img alt='rating 4' src={require("../../assets/images/unicorn_4.png")} className="icon" />,
										<img alt='rating 5' src={require("../../assets/images/unicorn_5.png")} className="icon" />,
										<img alt='rating 6' src={require("../../assets/images/unicorn_6.png")} className="icon" />]}
					/>
					<p><span className='rating'>Rating : {ranking - 1}</span></p>
					<p> 0. Unfriendly - 6. Very Friendly</p>
					<Link to="/"><button aria-label="Find a City" className="btn find-btn center">Find a City</button></Link>
				</div> 
				: 
				state && country ? 
				<div className="white-box center">
					<h1>RANK YOUR CITY</h1>
					<p className='question'>How gay friendly is <span className='current-city'>{city.cityName}</span> ?</p>
					<Rating
						stop={7}
						onClick={ this.onClickHandler }
						initialRating={this.state.starRating}
					   emptySymbol={[<img alt='rating 0 empty' src={require("../../assets/images/unicorn_emp_0.png")} className="icon" />, 
										<img alt='rating 1 empty' src={require("../../assets/images/unicorn_emp_1.png")} className="icon" />, 
										<img alt='rating 2 empty' src={require("../../assets/images/unicorn_emp_2.png")} className="icon" />, 
										<img alt='rating 3 empty' src={require("../../assets/images/unicorn_emp_3.png")} className="icon" />, 
										<img alt='rating 4 empty' src={require("../../assets/images/unicorn_emp_4.png")} className="icon" />,
										<img alt='rating 5 empty' src={require("../../assets/images/unicorn_emp_5.png")} className="icon" />,
										<img alt='rating 6 empty' src={require("../../assets/images/unicorn_emp_6.png")} className="icon" />]}
						fullSymbol={[<img alt='rating 0' src={require("../../assets/images/unicorn_0.png")} className="icon" />, 
										<img alt='rating 1' src={require("../../assets/images/unicorn_1.png")} className="icon" />, 
										<img alt='rating 2' src={require("../../assets/images/unicorn_2.png")} className="icon" />, 
										<img alt='rating 3' src={require("../../assets/images/unicorn_3.png")} className="icon" />, 
										<img alt='rating 4' src={require("../../assets/images/unicorn_4.png")} className="icon" />,
										<img alt='rating 5' src={require("../../assets/images/unicorn_5.png")} className="icon" />,
										<img alt='rating 6' src={require("../../assets/images/unicorn_6.png")} className="icon" />]}
					/>
					<p> 0. Unfriendly - 6. Very Friendly</p>
					<button aria-label="Submit" className="btn" onClick={ this.handleSubmit }>Submit</button>
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
		ranking: state.ranking,
		profile: state.firebase.profile
   }
}

export default connect(mapStateToProps, null)(CreateRanking)
