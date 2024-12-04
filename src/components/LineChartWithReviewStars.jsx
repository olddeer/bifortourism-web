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
    measures: [
      "AttractionsReviews.count"
    ],
    dimensions: [
      "AttractionsReviews.reviewsStars",
      "Attractions.categoryname"
    ],
    order: [
      [
        "AttractionsReviews.reviewsStars",
        "asc"
      ]
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
      return item["AttractionsReviews.reviewsStars"];
    }
  ).filter((value, index, self) => self.indexOf(value) === index);

  const category = workingData.map(
    (item) => {
      return {
        value: item["AttractionsReviews.count"],
        category: item["Attractions.categoryname"],
        tooltip: {
          formatter: function (params, ticket, callback) {
            return params.name + "</br>"
                + "Category: " + params.data.category + "</br>";
          }
        }
      };
    }
  );

  var _ = require('lodash');

  let categoriesArray = groupBy(category, "category");
  let uniqueCategories= keys(categoriesArray);

  let lineSeries = [];

  for (let key of uniqueCategories) {
    lineSeries.push({
      name: key,
      data: categoriesArray[key],
      type: "line"
    });
  }

  const options = {
    legend: {
      data: uniqueCategories,
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
        <Card.Title>Distribution of review counts by review stars and categories</Card.Title>
        <ReactECharts option={options} />
      </Card.Body>
    </Card>
  );
}

export default LineChart;
