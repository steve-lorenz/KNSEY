import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import StarRatings from 'react-star-ratings'
import { createRanking, getUserRanking } from '../../store/actions/rankActions'
import { createCity, getCity } from '../../store/actions/cityActions'
import { bindActionCreators } from 'redux'
import { ClipLoader } from 'react-spinners'

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

	componentDidMount () {
		const { city } = this.props;
		if( city.cityId ){
			this.props.getCity(city.cityName);
			this.setState({
				loading: false
			})
		}
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
      const { auth, city, ranking } = this.props;
      if(!auth.uid) return <Redirect to="/signin" />

      return (
		<div className="container white-box-container">
			{ this.state.loading ?
				<div className='MoonLoader center'>
					<ClipLoader
					className={'spinner'}
					sizeUnit={"px"}
					size={150}
					color={'#3B0075'}
					loading={this.state.loading}
					/>
				</div>
				: 
				ranking.average ? 
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
		...bindActionCreators({ createCity, createRanking, getUserRanking, getCity }, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRanking)