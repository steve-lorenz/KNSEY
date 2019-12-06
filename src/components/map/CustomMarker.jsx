/* eslint-disable import/no-dynamic-require */
import React from 'react';
import { Marker } from 'react-map-gl';

const btnStyle = {
  background: 'none',
  border: 'none',
};

const CustomMarker = ({ rankings, renderPopUp }) => (
  rankings.map((ranking) => {
    const ratingAverage = (Math.round(ranking.average) - 1);
    return (
      <Marker
        key={ranking.cityId}
        longitude={ranking.coords.longitude}
        latitude={ranking.coords.latitude}
        offsetLeft={-25}
        offsetTop={-75}
      >
        <button style={btnStyle} onClick={() => renderPopUp(ranking)} type="button"><img alt={`rating ${ratingAverage}`} src={require(`../../assets/images/unicorn_${String(ratingAverage)}.png`)} className="map-icon" /></button>
      </Marker>
    );
  })
);

export default CustomMarker;
