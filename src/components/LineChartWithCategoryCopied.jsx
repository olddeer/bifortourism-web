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
  const { resultSet, isLoading, error, progress } = useCubeQuery({
    timeDimensions: [
      {
        dimension: "AttractionsReviews.reviewsPublishedatdate",
        granularity: "week"
      }
    ],
    order: {
      "AttractionsReviews.reviewsPublishedatdate": "asc"
    },
    measures: [
      "AttractionsReviews.reviewersCount",
      "AttractionsReviews.count"
    ],
    dimensions: [
      "Attractions.title"
    ], filters: [
      {
        member: "Attractions.title",
        operator: "equals",
        values: [
          "The Army Museum",
          "Musée Marmottan Monet",
            "Sainte-Chapelle",
            "Louis Vuitton Foundation"
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

  const category = workingData.map(
    (item) => {
      return {
        value: item["AttractionsReviews.count"] - item["AttractionsReviews.reviewersCount"],
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

  let categoriesArray = groupBy(category, "title");
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
        <Card.Title>Customers that visit this place second time</Card.Title>
        <ReactECharts option={options} />
      </Card.Body>
    </Card>
  );
}

export default LineChart;
