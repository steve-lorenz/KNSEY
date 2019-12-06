import React, {
  useState, useEffect, useCallback, memo,
} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import MapGL from 'react-map-gl';
import Geocoder from 'react-mapbox-gl-geocoder';
import { bindActionCreators } from 'redux';
import CustomMarker from './CustomMarker';
import CustomPopup from './CustomPopup';
import { getCity, setCity } from '../../store/actions/cityActions';
import { getRanking } from '../../store/actions/rankActions';
import { getComments } from '../../store/actions/commentActions';
import { getAllRankings } from '../../utils/Ranking';
import { getCityByName } from '../../utils/City';

const Map = ({ ranking, city }) => {
  const [viewportState, setViewportState] = useState({
    width: '100%',
    height: '100%',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 6,
  });

  const [popupInfo, setPopupInfo] = useState(null);
  const [isInputShowing, setIsInputShowing] = useState(true);
  const [rankings, setRankings] = useState([]);

  const handleViewportChange = useCallback(
    (viewport) => {
      setViewportState({
        ...viewportState, ...viewport,
      });
    },
    [viewportState],
  );

  const resize = useCallback(
    () => {
      handleViewportChange({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    },
    [handleViewportChange],
  );

  useEffect(() => {
    const cityRankings = async () => {
      const allCityRankings = await getAllRankings();
      return allCityRankings;
    };
    cityRankings()
      .then((cities) => {
        setRankings(cities);
      });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', resize);
  }, [resize]);

  useEffect(() => () => {
    window.removeEventListener('resize', resize);
  }, [resize]);

  const handleSearhResult = async (viewport, result) => {
    const cityName = result.text;
    const city = await getCityByName(cityName);

    if (city) {
      return handleViewportChange({
        ...viewport,
      });
    }

    return alert(`Sorry,${cityName} hasn't been ranked yet.`);
  };

  const renderPopUp = (ranking) => {
    setPopupInfo(ranking);
    setIsInputShowing(false);
  };

  const closePopup = () => {
    setPopupInfo(null);
    setIsInputShowing(true);
  };

  const queryParams = {
    types: 'place',
  };
  return (
    <div className="map">
      <MapGL
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...viewportState}
        onViewportChange={handleViewportChange}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}
        surfaceView
      >
        { rankings.length > 0 && <CustomMarker rankings={rankings} renderPopUp={renderPopUp} /> }
        { popupInfo && <CustomPopup city={city} popupInfo={popupInfo} closePopup={closePopup} /> }
        {isInputShowing
          ? (
            <div style={{ height: '100%' }} className="container center">
              <p>{ranking ? ranking.totalRankings : null}</p>

              <Link to="/create"><button type="button" aria-label="Rank your city" className="btn center rank-btn">Rank your city</button></Link>
              <Geocoder
                viewport={viewportState}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}
                onSelected={handleSearhResult}
                hideOnSelect
                className="search-box"
                queryParams={queryParams}
              />

            </div>
          )
          : null}
      </MapGL>

    </div>
  );
};

Map.propTypes = {
  ranking: PropTypes.shape({
    totalRankings: PropTypes.number,
  }),
  profile: PropTypes.shape({
    role: PropTypes.number,
  }).isRequired,
  city: PropTypes.shape({
    cityId: PropTypes.string,
  }),
};

Map.defaultProps = {
  ranking: {},
  city: {},
};

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  city: state.city,
  ranking: state.ranking,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getRanking, getCity, getComments, setCity,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(Map));
