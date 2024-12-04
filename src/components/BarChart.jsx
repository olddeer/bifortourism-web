import React from "react";
import ReactECharts from "echarts-for-react";
import { useCubeQuery } from "@cubejs-client/react";
import Loader from "./Loader";
import { Card } from "react-bootstrap";
import {groupBy, keys} from "lodash";

function BarChart(resultSetParam) {
  const resultSet = resultSetParam.resultSet;

  if (!resultSet) {
    return null;
  }
  const workingData = resultSet.loadResponse.results[0].data;
  const timeDimension = resultSet.loadResponse.results[0].query.timeDimensions[0].dimension + "." + resultSet.loadResponse.results[0].query.timeDimensions[0].granularity;
  const dimension = resultSet.loadResponse.results[0].query.dimensions[0];
  const measure = resultSet.loadResponse.results[0].query.measures[0];

  const date = workingData.map(
      (item) => {
        return item[timeDimension];
      }
  ).filter((value, index, self) => self.indexOf(value) === index);

  const category = workingData.map(
      (item) => {
        return {
          value: item[measure],
          time: item[timeDimension],
          title: item[dimension],
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
      type: "bar",
      stack: "y"
    });
  }

  const options = {
    xAxis: [{
      data: date,
      position: "bottom"
    }],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    yAxis: {
      type: "value",
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

export default BarChart;
