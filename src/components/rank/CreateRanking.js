import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import StarRatings from 'react-star-ratings'
import { createRanking } from '../../store/actions/rankActions'
import { createCity } from '../../store/actions/cityActions'
import { bindActionCreators } from 'redux'

class CreateRanking extends Component {

	constructor(props) {
		super(props);

		this.state = {
			starRating: 0,
			cityName: '',
			state: '',
			country: ''
		}
		this.onClickHandler = this.onClickHandler.bind(this);
		this.goBack = this.goBack.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

	}

	componentDidMount() {
		const url = "https://ipinfo.io/json"

		fetch(url)
		.then(response => {
			if(response.ok){
				return response.json()
			}
			else{
				return Promise.reject('Something went wrong!')
			}
		})
		.then(data => {
				this.setState({
					cityName: data.city,
					state: data.region,
					country: data.country
				})
		})
		.catch(error => {
			console.log(`An error has occured: ${error}`)
		});
	}
   
   goBack() {
      this.props.history.goBack();
   }

   onClickHandler = rating =>  {
		console.log("Selected Rating", rating)
		console.log(this.state)
		this.setState({
			starRating: rating,
		})
	}
	
	handleSubmit(e) {
		e.preventDefault();
		console.log(this.state)
		this.props.createCity({
			cityName: this.state.cityName,
			state: this.state.state,
			country: this.state.country
		})
		this.props.createRanking(this.state)
		this.goBack()
   }

   render () {
      const { auth } = this.props;

      if(!auth.uid) return <Redirect to="/signin" />

      return (
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