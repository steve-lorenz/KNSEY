import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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
        <p style={{fontSize: '2em'}}>Total Ratings: {ranking.userRanking}</p>
        <div class="row">
          <div class="col s6"><Link to="/create"><button className="btn deep-purple darken-4 center"><i className="fas fa-map-marker-alt"></i> Rank your City </button></Link></div>
          <div class="col s6"><Link to="/"><button className="btn deep-purple darken-4 center"><i className="fas fa-search"></i> Find a City </button></Link></div>
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
     
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowRanking)
