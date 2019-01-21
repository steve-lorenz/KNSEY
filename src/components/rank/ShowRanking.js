import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import StarRatings from 'react-star-ratings'
import { setCity } from '../../store/actions/cityActions'
import Comment from '../comment/Comment'
import { getCityById } from '../../utils/City'
import { getRankingById } from '../../utils/Ranking'
import { ClipLoader } from 'react-spinners'

class ShowRanking extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      city: '',
      ranking: '',
      loading: true
    };
    this.findCity = this.findCity.bind(this);
  }

  componentWillMount() {
    const cityURL = this.props.match.params
    this.findCity(cityURL.id)
  }

  componentWillUnmount() {
    this.props.getCity(' ');
  }

  async findCity(cityId) {
    let cityResults = await getCityById(cityId);
    if(cityResults) {
      let rankResults = await getRankingById(cityId)
      this.setState({
        city: cityResults,
        ranking: rankResults,
        loading: false,
      })
      this.props.setCity(cityResults)
    }
  }

  render() {
    const {city, ranking} = this.state
    return (
      <div className='container'>
      {city && ranking ? 
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
          <Comment 
            cityStuff={city}
          />
        </div>
        :
        <div className='center white-box'>
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
  console.log("Ranking state", state)
  return {
     auth: state.firebase.auth,
     city: state.city,
     ranking: state.ranking
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCity: (city) => dispatch(setCity(city))
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowRanking)
