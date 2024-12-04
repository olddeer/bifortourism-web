import React, {useState} from "react";
import ReactECharts from "echarts-for-react";
import {useCubeQuery} from "@cubejs-client/react";
import Flatpickr from 'react-flatpickr';
import Loader from "./Loader";
import {Card} from "react-bootstrap";
import Select from 'react-select';

import "flatpickr/dist/themes/material_green.css";
import {groupBy, keys} from "lodash";
function LineChart(resultSetParam) {
  const resultSet = resultSetParam.resultSet;

  if (!resultSet) {
    return null;
  }

  const workingData = resultSet.loadResponse.results[0].data;
  const timeDimension = resultSet.loadResponse.results[0].query.timeDimensions[0].dimension + "." + resultSet.loadResponse.results[0].query.timeDimensions[0].granularity;
  const dimension = resultSet.loadResponse.results[0].query.dimensions[0];
  const dimensionTitle = resultSet.loadResponse.results[0].query.dimensions.find(element => element.includes(".title"));
  const measure = resultSet.loadResponse.results[0].query.measures[0];

  const date = workingData.map(
      (item) => {
        if (item[timeDimension] == null) {
          console.log(item[dimension]);
          return item[dimension];
        }
        return item[timeDimension];
      }
  ).filter((value, index, self) => self.indexOf(value) === index);

  const category = workingData.map(
    (item) => {

      var currentDimension;
      if(dimensionTitle != null) {
        currentDimension = dimensionTitle;
      } else {
        currentDimension = dimension;
      }

      return {
        value: item[measure],
        time: item[timeDimension],
        title: item[currentDimension],
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

  const mergedArray = Object.keys(categoriesArray).map((key) => {
    return {
      title: key,
      data: date.map((item) => {
        return categoriesArray[key].find(cat => cat.time === item) || {
          value: null,
          time: item,
          title: null,
          tooltip: null
        };
      })
    };
  });
  let mergedCategoriesArray = groupBy(mergedArray, "title");

  Object.entries(mergedCategoriesArray).forEach(([key, value]) => {
    mergedCategoriesArray[key] = value[0].data;
  });

  let uniqueCategories= keys(categoriesArray);

  let lineSeries = [];

  for (let key of uniqueCategories) {
    lineSeries.push({
      name: key,
      data: mergedCategoriesArray[key],
      type: "line"
    });
  }

  const options = {
    notMerge: true,
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
        <Card.Title>Count of likes by category</Card.Title>
        <ReactECharts option={options} notMerge={true}/>
      </Card.Body>
    </Card>
  );
}

export default LineChart;
