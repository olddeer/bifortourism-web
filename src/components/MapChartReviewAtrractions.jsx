import React, {useState} from "react";
import ReactECharts from "echarts-for-react";
import {useCubeQuery} from "@cubejs-client/react";
import * as echarts from 'echarts';
import 'echarts-extension-gmap';
import '@react-google-maps/api';
import Flatpickr from 'react-flatpickr';
import Loader from "./Loader";
import {Card} from "react-bootstrap";
import Select from 'react-select';

import "flatpickr/dist/themes/material_green.css";
import {groupBy, keys} from "lodash";
import {Marker, TrafficLayer, useJsApiLoader} from "@react-google-maps/api";
function MapChart(resultSetParam) {

  require('echarts');
  require('echarts-extension-gmap');
  useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAuFpPuIATSQfPamtqq3ePlDZfl7TCiiXo"
  })

  const resultSet = resultSetParam.resultSet;

  if (!resultSet) {
    return null;
  }

  const workingData = resultSet.loadResponse.results[0].data;

  const titleCoordinates = workingData.map(
    (item) => {
      let map = item["Attractions.location"].split(",").map(Number);
      let array = [map[1], map[0]];
      return {
        value: array.concat(item["AttractionsReviews.starsAvg"] * 50),
        starsAvg: item["AttractionsReviews.starsAvg"],
        title: item["Attractions.title"],
        category: item["Attractions.categoryname"],
        tooltip: {
          formatter: function (params, ticket, callback) {
            return params.data.title + "</br>"
                + "Category: " + params.data.category + "</br>"
                + "Average rating: " + params.data.starsAvg + "</br>";
          }
        }
      };
    }
  );


  var _ = require('lodash');

  let titleReviews = groupBy(titleCoordinates, "title");
  console.log(titleCoordinates);
  let titleReviewGolds = groupBy(titleCoordinates, "title");
  const titleReviewGoldsMap =titleCoordinates.filter(v => v.starsAvg > 4.6);

  let uniqueTitles= keys(titleReviews);

  let lineSeries = [];

  for (let key of uniqueTitles) {
    lineSeries.push({
      name: key,
      data: titleReviews[key],
      type: "scatter"
    });
  }

  const options = {
    gmap: {
      // initial options of Google Map
      // See https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions for details
      // initial map center, accepts an array like [lng, lat] or an object like { lng, lat }
      center: [2.3441931, 48.8602723],
      // center: { lng: 108.39, lat: 39.9 },
      // initial map zoom
      zoom: 12,

      // whether echarts layer should be rendered when the map is moving. `true` by default.
      // if false, it will only be re-rendered after the map `moveend`.
      // It's better to set this option to false if data is large.
      renderOnMoving: true,
      // the zIndex of echarts layer for Google Map. `2000` by default.
      echartsLayerZIndex: 2019,

      // whether to enable gesture handling. `true` by default.
      // since v1.4.0
      roam: true

      // More initial options...
    },
    tooltip: {
      trigger: "item"
    },
    series: [
      {
        type: 'scatter',
        // use `gmap` as the coordinate system
        coordinateSystem: 'gmap',
        name: "Attraction to visit",
        // data items [[lng, lat, value], [lng, lat, value], ...]
        data: titleCoordinates,
        itemStyle: {
          color: "bronze"
        },
        encode: {
          // encode the third element of data item as the `value` dimension
          value: 2,
          lng: 0,
          lat: 1
        }
      },
      
      {
        type: 'scatter',
        // use `gmap` as the coordinate system
        coordinateSystem: 'gmap',
        name: "Attraction to visit",
        // data items [[lng, lat, value], [lng, lat, value], ...]
        data: titleReviewGoldsMap,
        itemStyle: {
          color: "gold"
        },
        encode: {
          // encode the third element of data item as the `value` dimension
          value: 2,
          lng: 0,
          lat: 1
        }
      }
    ]
  };



  return (
    <Card className="m-4">
      <Card.Body>
        <Card.Title>Best places to visit near the city center</Card.Title>
        <ReactECharts  option={options}/>
      </Card.Body>
    </Card>
  );
}

export default MapChart;
