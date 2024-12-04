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
  const dimension = resultSet.loadResponse.results[0].query.dimensions[0];
  const dimensionTitle = resultSet.loadResponse.results[0].query.dimensions.find(element => element.includes(".title"));
  const measure = resultSet.loadResponse.results[0].query.measures[0];

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
    let totalValue =  categoriesArray[key].reduce((sum, obj) => sum + obj.value, 0);
    categoriesArray[key][0].value = totalValue;
    return  categoriesArray[key][0];
  });

  let mergedCategoriesArray = groupBy(mergedArray, "title");

  Object.entries(mergedCategoriesArray).forEach(([key, value]) => {
    mergedCategoriesArray[key] = value[0];
  });

  let uniqueCategories= keys(categoriesArray);

  let lineSeries = [];

    lineSeries.push({
      name: dimension,
      data: Object.keys(mergedCategoriesArray).map((key) => {
        return  categoriesArray[key][0].value;
      }),
      type: "line"
    });

  const options = {
    notMerge: true,
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "cross",
      },

    },
    xAxis: {
      type: 'category',
      data: uniqueCategories,
    },
    yAxis: {
      type: 'value'
    },
    series: lineSeries
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
