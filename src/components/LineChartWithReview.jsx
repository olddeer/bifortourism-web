import React, {useState} from "react";
import ReactECharts from "echarts-for-react";
import {useCubeQuery} from "@cubejs-client/react";
import Flatpickr from 'react-flatpickr';
import Loader from "./Loader";
import {Card} from "react-bootstrap";
import Select from 'react-select';

import "flatpickr/dist/themes/material_green.css";
import {groupBy, keys} from "lodash";
function LineChart() {
  const [dateRange, setDateRange] = useState({
    startDate: '2023-01-08T06:00',
    endDate: '2023-01-17T10:00'
  });

  const selectValues = [
    { value: 'Rue Ancelle, Neuilly sur Seine Cedex', label: 'Rue Ancelle, Neuilly sur Seine Cedex' },
    { value: 'The Army Museum', label: 'The Army Museum' }
  ]

  let [titles, setTitle] = useState([selectValues[0].value]);
  const { resultSet, isLoading, error, progress } = useCubeQuery({
    dimensions: [
      "Attractions.title"
    ],
    order: {
      "AttractionsReviews.reviewsPublishedatdate": "asc"
    },
    measures: [
      "AttractionsReviews.starsAvg"
    ],
    timeDimensions: [
      {
        dimension: "AttractionsReviews.reviewsPublishedatdate",
        granularity: "day"
      }
    ],
    filters: [
      {
        member: "Attractions.title",
        operator: "equals",
        values: [
          "The Army Museum",
          "Conciergerie"
        ]
      },
      {
        member: "AttractionsReviews.reviewsPublishedatdate",
        operator: "afterDate",
        values: [
          "2023-01-19"
        ]
      }
    ]
  });

  if (error) {
    return <p>{error.toString()}</p>;
  }
  if (isLoading) {
    return (
      <div>
        {(progress && progress.stage && progress.stage.stage) || <Loader />}
      </div>
    );
  }

  if (!resultSet) {
    return null;
  }

  const workingData = resultSet.loadResponse.results[0].data;

  const date = workingData.map(
    (item) => {
      return item["AttractionsReviews.reviewsPublishedatdate"];
    }
  ).filter((value, index, self) => self.indexOf(value) === index);

  const reviews = workingData.map(
    (item) => {
      return {
        value: item["AttractionsReviews.starsAvg"],
        title: item["Attractions.title"],
        tooltip: {
          formatter: function (params, ticket, callback) {
            return params.name + "</br>"
            + "Title: " + params.data.title;
          }
        }
      };
    }
  );

  var _ = require('lodash');

  let titleReviews = groupBy(reviews, "title");
  let uniqueTitles= keys(titleReviews);

  let lineSeries = [];

  for (let key of uniqueTitles) {
    lineSeries.push({
      name: key,
      data: titleReviews[key],
      type: "line"
    });
  }

  const options = {

    legend: {
      data: uniqueTitles,
    },
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "cross",
      },

    },
    xAxis: {
      type: 'category',
      data: date,
    },
    yAxis: {
    },
    series: lineSeries,
  };

  return (
    <Card className="m-4">
      <Card.Body>
        <Card.Title>Review distribution of places in January</Card.Title>
        <ReactECharts option={options} />
      </Card.Body>
    </Card>
  );
}

export default LineChart;
