import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
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
		this.props.createCity({
			cityName: city.cityName,
			state: city.state,
			country: city.country
		})
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
		<div className="container">
			{ this.state.loading ?
				<div className='MoonLoader center'>
					<ClipLoader
					className={'spinner'}
					sizeUnit={"px"}
					size={150}
					color={'#123abc'}
					loading={this.state.loading}
					/>
				</div>
				: 
				ranking.average ? 
				<div className="container center">
					<div className="row">
						<button style={{marginTop: '20px'}}className="right btn black round" onClick={ this.goBack }>X</button>
					</div>
					<h1>Your ranking for <strong>{city.cityName}</strong></h1>
					<StarRatings
						rating={ranking.average}
						starDimension="40px"
						starSpacing="15px"
						starRatedColor="#311b92"
						numberOfStars={7}
					/>
					<h4><strong>Rating:{ranking.average}</strong></h4>
					<p> 0. Haters - 6. Very Friendly</p>
				</div> 
				: 					
				<div className="container center">
					<div className="row">
						<button style={{marginTop: '20px'}}className="right btn black round" onClick={ this.goBack }>X</button>
					</div>
					<h1>Ranking City</h1>
					<h5 style={{ marginBottom: '10px' }}>How gay friendly is <strong>{city.cityName}</strong>?</h5>
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
			}		
		</div>	
      )
	}

}

const mapStateToProps = (state) => {
   console.log("Create Ranking State: ", state);
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