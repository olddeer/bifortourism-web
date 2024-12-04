import React, {useState} from "react";
import ReactECharts from "echarts-for-react";
import {QueryBuilder, useCubeQuery} from "@cubejs-client/react";
import Flatpickr from 'react-flatpickr';
import Loader from "./Loader";
import {Card} from "react-bootstrap";
import { Layout, Divider, Empty, Select } from "antd";

import "flatpickr/dist/themes/material_green.css";
import {cubejsApi} from "../App";
function LineChart() {
  const [dateRange, setDateRange] = useState({
    startDate: '2023-01-08T06:00',
    endDate: '2023-01-17T10:00'
  });


  return (
    <Card className="m-4">
      <Card.Body>
        <Card.Title>Average occupancy by temp</Card.Title>
        <QueryBuilder
            query={{
              timeDimensions: [
                {
                  dimension: "WeatherOccupancyRate.datetime",
                  granularity: "hour"
                }
              ]
            }}
            cubejsApi={cubejsApi}
            render={({ resultSet, measures, availableMeasures, updateMeasures }) => (
                <Layout.Content style={{ padding: "20px" }}>
                  <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      onSelect={measure => updateMeasures.add(measure)}
                      onDeselect={measure => updateMeasures.remove(measure)}
                  >
                    {availableMeasures.map(measure => (
                        <Select.Option key={measure.name} value={measure}>
                          {measure.title}
                        </Select.Option>
                    ))}
                  </Select>
                  <Divider />
                  {
                    measures.length > 0 ? (
                        <p>{resultSet}</p>
                  ) : (
                      <Empty description="Select a measure to get started" />
                  )}
                </Layout.Content>
            )}
        />

      </Card.Body>
    </Card>
  );
}

export default LineChart;
