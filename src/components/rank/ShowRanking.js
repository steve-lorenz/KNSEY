import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Rating from 'react-rating';
import { ClipLoader } from 'react-spinners'
import { setCity } from '../../store/actions/cityActions'
import Comment from '../comment/Comment'
import { getCityById } from '../../utils/City'
import { getRankingById } from '../../utils/Ranking'

class ShowRanking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      city: '',
      ranking: '',
      loading: true,
    };
    this.findCity = this.findCity.bind(this);
  }

  componentWillMount() {
    console.log('rankings', this.props);
    const cityURL = this.props.match.params;
    this.findCity(cityURL.id);
  }

  async findCity(cityId) {
    const cityResults = await getCityById(cityId);
    if (cityResults) {
      const rankResults = await getRankingById(cityId);
      this.setState({
        city: cityResults,
        ranking: rankResults,
        loading: false,
      });
      this.props.setCity(cityResults);
    }
  }

  render() {
    const { city, ranking } = this.state;
    return (
      <div className="container">
        {city && ranking 
        ? <div className="center white-box">
          <h1>
{city.cityName}
{' '}
Ranking
</h1>
          <p className="city-ranking">
City Rating:
{' '}
{ranking.average - 1}
</p>
          <Rating
            stop={7}
            readonly
            initialRating={ranking.average}
            className="ranking-icons"
            emptySymbol={[<img alt="rating 0 empty" src={require('../../assets/images/unicorn_emp_0.png')} className="icon" />,
  <img alt="rating 1 empty" src={require('../../assets/images/unicorn_emp_1.png')} className="icon" />,
  <img alt="rating 2 empty" src={require('../../assets/images/unicorn_emp_2.png')} className="icon" />,
  <img alt="rating 3 empty" src={require('../../assets/images/unicorn_emp_3.png')} className="icon" />,
  <img alt="rating 4 empty" src={require('../../assets/images/unicorn_emp_4.png')} className="icon" />,
  <img alt="rating 5 empty" src={require('../../assets/images/unicorn_emp_5.png')} className="icon" />,
  <img alt="rating 6 empty" src={require('../../assets/images/unicorn_emp_6.png')} className="icon" />]}
            fullSymbol={[<img alt="rating 0" src={require('../../assets/images/unicorn_0.png')} className="icon" />,
  <img alt="rating 1" src={require('../../assets/images/unicorn_1.png')} className="icon" />,
  <img alt="rating 2" src={require('../../assets/images/unicorn_2.png')} className="icon" />,
  <img alt="rating 3" src={require('../../assets/images/unicorn_3.png')} className="icon" />,
  <img alt="rating 4" src={require('../../assets/images/unicorn_4.png')} className="icon" />,
  <img alt="rating 5" src={require('../../assets/images/unicorn_5.png')} className="icon" />,
  <img alt="rating 6" src={require('../../assets/images/unicorn_6.png')} className="icon" />]}
          />
          <p style={{ fontSize: '2em' }}>
Total Ratings:
{' '}
{ranking.userRanking}
</p>
          <Link to="/"><button aria-label="Find a City" className="btn find-btn center">Find a City</button></Link>
          <Comment
            cityStuff={city}
          />
        </div>
        :        <div className="center white-box">
          <ClipLoader
            className="spinner"
            sizeUnit="px"
            size={150}
            color="#3B0075"
            loading={this.state.loading}
          />
        </div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
     auth: state.firebase.auth,
     city: state.city,
     ranking: state.ranking
  });

const mapDispatchToProps = (dispatch) => ({
    setCity: (city) => dispatch(setCity(city))
 });

export default connect(mapStateToProps, mapDispatchToProps)(ShowRanking);
