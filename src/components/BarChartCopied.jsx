import React from "react";
import ReactECharts from "echarts-for-react";
import { useCubeQuery } from "@cubejs-client/react";
import Loader from "./Loader";
import { Card } from "react-bootstrap";

function BarChart() {
  const { resultSet, isLoading, error, progress } = useCubeQuery({
    measures: [
      "WeatherOccupancyRate.occupancyPercentAvg"
    ],
    order: {
      "WeatherOccupancyRate.datetime": "asc"
    },
    timeDimensions: [
      {
        dimension: "WeatherOccupancyRate.datetime",
        granularity: "hour"
      }
    ],
    dimensions: [
      "WeatherOccupancyRate.temp",
      "WeatherOccupancyRate.title"
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
  const dateTimeHour = workingData.map(
    (item) => item["WeatherOccupancyRate.datetime.hour"]
  );
  const occupancyRate = workingData.map((item) => item["WeatherOccupancyRate.occupancyPercentAvg"]);
  const temp = workingData.map((item) => item["WeatherOccupancyRate.temp"]);
  const titles = workingData.map((item) => item["WeatherOccupancyRate.title"]);
  const options = {
    xAxis: [{
      data: dateTimeHour,
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
    series: [
      {
        name: "occupancy rate",
        data: occupancyRate,
        type: "bar",
        stack: "y"
      },
      {
        name: "temperature",
        data: temp,
        type: "bar",
        stack: "y"
      }
    ],
  };

  return (
    <Card className="m-4">
      <Card.Body>
        <Card.Title>Orders by Product Category Names</Card.Title>
        <ReactECharts option={options} />
      </Card.Body>
    </Card>
  );
}

export default BarChart;
