import React, { Component } from 'react'
import { connect } from 'react-redux'
import StarRatings from 'react-star-ratings'

class ShowRanking extends Component {

  render() {
    const {city, ranking} = this.props
    return (
      <div className='container center'>
        <h1>{city.cityName} Ranking</h1>
        <h4>City Rating: {ranking.average}</h4>
        <StarRatings
          rating={ranking.average}
          starDimension="40px"
          starSpacing="15px"
          starRatedColor="#311b92"
          numberOfStars={7}
        />
        
        <h4>Total Ratings: {ranking.userRanking}</h4>
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
     
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ShowRanking)
