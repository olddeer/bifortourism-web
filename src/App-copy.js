import React from "react";
import {Col, Row, Navbar, Container, FloatingLabel, Card} from "react-bootstrap";
import AreaChart from "./components/AreaChart";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import StackedBarChart from "./components/StackedBarChart";
import { CubeProvider } from "@cubejs-client/react";
import cubejs from "@cubejs-client/core";
import LineChartWithCategory from "./components/LineChartWithCategory";
import LineChartWithReview from "./components/LineChartWithReview";
import MapChartReviewAtrractions from "./components/MapChartReviewAtrractions";
import LineChartWithReviewStars from "./components/LineChartWithReviewStars";
import Select from "react-select";
import ReactECharts from "echarts-for-react";

export const cubejsApi = cubejs("token", {
  apiUrl: `http://localhost:4000/cubejs-api/v1`,
});

const Appe = () => {
  return (
      <CubeProvider cubejsApi={cubejsApi}>
        <div className="bg-gray">
          <Navbar>
            <Container>
              <Navbar.Brand href="#home">BI4People Tourism app</Navbar.Brand>
            </Container>
          </Navbar>

          <Row>
            <Col>
              <MapChartReviewAtrractions />
            </Col>
          </Row>
          <Row>
            <Col>
              <LineChartWithCategory />
            </Col>
          </Row>
          <Row>
            <Col>
              <LineChartWithReviewStars />
            </Col>
          </Row>
        </div>
      </CubeProvider>
  );
};

export default App;
