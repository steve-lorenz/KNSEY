import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import StarRatings from 'react-star-ratings'
import { getCity } from '../../store/actions/cityActions'

class ShowRanking extends Component {


  componentWillUnmount (){
    this.props.getCity(' ');
  }

  render() {
    const {city, ranking} = this.props
    return (
      <div className='container'>
        <div className='center white-box'>
          <h1>{city.cityName} Ranking</h1>
          <p className='city-ranking'>City Rating: {ranking.average}</p>
          <StarRatings
            rating={ranking.average}
            starDimension="40px"
            starSpacing="15px"
            starRatedColor="#3B0075"
            numberOfStars={7}
          />
          <p style={{fontSize: '2em'}}>Total Ratings: {ranking.userRanking}</p>
          <Link to="/"><button className="btn find-btn center">Find a City</button></Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  console.log("Show Ranking State", state);
  return {
     auth: state.firebase.auth,
     city: state.city,
     ranking: state.ranking
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCity: (cityName) => dispatch(getCity(cityName))
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowRanking)
