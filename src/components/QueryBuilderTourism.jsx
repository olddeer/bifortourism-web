import React, {useEffect, useRef, useState} from "react";
import ReactECharts from "echarts-for-react";
import {QueryBuilder, useCubeQuery} from "@cubejs-client/react";
import Flatpickr from 'react-flatpickr';
import Loader from "./Loader";
import {Button, Card} from "react-bootstrap";
import {Layout, Divider, Empty, Select, DatePicker, Input, Avatar, Typography, Space} from "antd";

import "flatpickr/dist/themes/material_green.css";
import {cubejsApi} from "../App";
import cubejs from "@cubejs-client/core";
import LineChartWithCategory from "./LineChartWithCategory";
import BarChart from "./BarChart";
import {CSVLink, CSVDownload} from 'react-csv';
import MapChart from "./MapChartReviewAtrractions";
import ReactFileReader from 'react-file-reader';
import Papa from 'papaparse';
import dayjs from "dayjs";
import {saveUseCases} from "./services/useCasesService";
import {createTitleAndDescription} from "./services/chatGptService";
import LineChartWithCategoryWithoutTimeDimension from "./LineChartWithCategoryWithoutTimeDimension";

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

function getOnSelect(availableDimensions, mainOperator, filterValues, setLogText, logText, updateFilters, user) {
    return (m) => {

        let dimensionValue = availableDimensions.find(mes => mes.name === m);

        if (mainOperator !== null && mainOperator !== "" && filterValues !== null && filterValues !== []) {
            setLogText([...logText, {user: user.username, date: new Date(), log: "Add filter " + JSON.stringify(dimensionValue) + " operator: " + JSON.stringify(mainOperator) + " value: " + JSON.stringify(filterValues)}]);

            console.log(logText);

            updateFilters.add({
                member: m,
                dimension: dimensionValue,
                operator: mainOperator,
                values: filterValues
            })
        }


    };
}



function QueryBuilderTourism({ user, onLogout, importedParamDimensions, importedParamMeasure, importedTimeDimension,
                                 setImportedParamDimensions, setImportedParamMeasure, setImportedTimeDimension, avatarLink, useCaseDescription, useCaseTitle,  setUseCaseDescription,
                                 setUseCaseTitle, listData, setListData, isUserImported, setIsUserImported,
                                 textArray, setTextArray, importedFilter, setImportedFilters}) {
    const dateFormat = 'YYYY-MM-DD';
    let granularityArrays = ["week", "day", "year", "month", "quarter"];
    let operators = [ 'equals', 'notEquals', 'contains', 'notContains', 'gt', 'gte', 'lt', 'lte', 'inDateRange',
        'notInDateRange', 'beforeDate', 'afterDate'];
    let [mainOperator, setMainOperator] = useState("");
    let [filterValues, setFilterValues] = useState([]);

    const { Title, Paragraph, Text } = Typography;

    let [importedGranularity, setImportedGranularity] = useState([]);

    let [username, setUsername] = useState([]);
    let [logText, setLogText] = useState([{user: "", date: "", log: ""}]);

    const handleSave = async (useCaseData) => {
        try {
            const result = await saveUseCases(useCaseData);
            console.log(result);
        } catch (error) {
            console.log("err");
        }
    };


    const handleGenerate = async (dimensions, measures) => {
        try {
            const result = await createTitleAndDescription(dimensions.map(dim => dim.name), measures.map(dim => dim.name));
            const titleMatch = result.match(/Title:\s*"(.*?)"/);
            const descriptionMatch = result.match(/Description:\s*(.+)/);
            alert('Chat GPT generated Title: ' + titleMatch[1] + "\n Description: " + descriptionMatch[1].trim());
            return {title: titleMatch[1], description: descriptionMatch[1].trim()};
        } catch (err) {
            console.log(err)
        }
    };

    const handleJsonFiles = files => {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Use reader.result
            alert(reader.result)
        }
        reader.readAsText(files[0]);
        reader.onload = e => {
            console.log("e.target.result", e.target.result);
            let json = JSON.parse(e.target.result);
            setImportedParamMeasure(json.useCase.measures);
            setImportedParamDimensions(json.useCase.dimensions);
            setImportedFilters(json.useCase.filters);
            setImportedTimeDimension(json.useCase.timeDimensions);
            setTextArray(json.useCase.comment);
            setUsername(json.user);
            setIsUserImported(true);
        };

    }

    const handleTextChange = (event) => {
        const newText = user.username + ": " + event.target.value;

        // Update the text array with the new text
        const updatedTextArray = [...textArray, newText];
        setTextArray(updatedTextArray);

        setLogText([...logText, {user: user.username, date: new Date(), log: "Add comment " + event.target.value}]);

    };

    const divRef = useRef(null);

    const buttonRef = useRef(null);

    const avartarRef = useRef(null);

    useEffect(() => {
        // Trigger a click event on the button when the component is rendered
        if (importedParamDimensions && importedParamDimensions.length > 0 && !isUserImported) {
            buttonRef.current.click();
            divRef.current.style.display = 'none';
            avartarRef.current.style.display = 'block';
        } else {
            divRef.current.style.display = 'block';
            avartarRef.current.style.display = 'none';
        }

    }, [importedParamDimensions, isUserImported]);


  return (
      <QueryBuilder
          cubejsApi={cubejsApi}
          query={{
              order:
              [
                    ["AttractionsReviews.reviewsPublishedatdate", "asc"],
                    ["WeatherOccupancyRate.occupancyPercent", "asc"],
                    ["WeatherOccupancyRate.temp", "asc"],
                    ["AttractionsPopulartimeshistogrammocked.datetime", "asc"]
              ]
          }}
          render={({ resultSet, measures, availableMeasures, updateMeasures, availableDimensions, updateDimensions,
                       dimensions, availableTimeDimensions, updateTimeDimensions, timeDimensions, orderUpdater,
                       availableFilterMembers, updateFilters, updateQuery, filters }) => (

              <Layout.Content style={{ padding: "20px" }} >
                  <h1>{useCaseTitle}</h1>
                  <Space align="center">
                  <Avatar src={avatarLink} ref={avartarRef}/>
                  <Typography>
                      <Paragraph>{useCaseDescription}</Paragraph>
                  </Typography>
                  </Space>
                <div ref={divRef}>
                  <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="Please select measure"
                      value={measures.map(mes => mes.name)}
                      onSelect={(m) => {
                          setLogText([...logText, {user: user.username, date: new Date(), log: "Add measure " + m}]);

                          console.log(logText);
                          updateMeasures.add(availableMeasures.find(mes => mes.name === m));
                      }
                      }
                      onDeselect={(m) => {
                          setLogText([...logText, {user: user.username, date: new Date(), log: "Remove measure " + m}]);

                          console.log(logText);
                          updateMeasures.remove(availableMeasures.find(mes => mes.name === m))
                      } }>
                      {availableMeasures.map(measure => (
                          <Select.Option key={measure.name} value={measure.name}>
                              {measure.title}
                          </Select.Option>
                      ))}
                  </Select>
                  <Divider />
                  <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="Please select dimension"
                      value={dimensions.map(mes => mes.name)}
                      onSelect={(m) => {
                          setLogText([...logText, {user: user.username, date: new Date(), log: "Add dimension " + m}]);

                          console.log(logText);
                          updateDimensions.add(availableDimensions.find(mes => mes.name === m))
                      }
                      }
                      onDeselect={(m) => {
                          setLogText([...logText, {user: user.username, date: new Date(), log: "Remove dimension " + m}]);

                          console.log(logText);
                          updateDimensions.remove(availableDimensions.find(mes => mes.name === m))
                      }}>
                      {availableDimensions.map(dimension => (
                          <Select.Option key={dimension.name} value={dimension.name}>
                              {dimension.title}
                          </Select.Option>
                      ))}
                  </Select>
                  <Divider />
                  <Select
                      style={{ width: "100%" }}
                      placeholder="Please select time dimension"
                      value={timeDimensions.map(mes => mes.granularity)}
                      onSelect={(m) => {
                          setLogText([...logText, {user: user.username, date: new Date(), log: "Choose granularity " + m}]);

                          console.log(logText);

                          timeDimensions.map((td) => {
                              updateTimeDimensions.update(td, {
                                  ...td,
                                  granularity: m
                              })
                          })
                      }}>
                      {granularityArrays.map(granularity => (
                          <Select.Option key={granularity} value={granularity}>
                              {granularity}
                          </Select.Option>
                      ))}
                  </Select>
                  <Divider />
                  <RangePicker
                      value={[dayjs(typeof timeDimensions !== 'undefined' && timeDimensions.length > 0
                      && typeof timeDimensions[0].dateRange !== 'undefined' ? timeDimensions[0].dateRange[0] : "2022-07-01", dateFormat),
                          dayjs(typeof timeDimensions !== 'undefined'  && timeDimensions.length > 0
                          && typeof timeDimensions[0].dateRange !== 'undefined' ? timeDimensions[0].dateRange[1] : "2024-08-01", dateFormat)]}
                      onChange={(e) => {


                          if (e?.[0] && e?.[1]) {
                              let dateRange = [e[0].format("YYYY-MM-DD"), e[1].format("YYYY-MM-DD")];

                              setLogText([...logText, {user: user.username, date: new Date(), log: "Change time " + JSON.stringify(dateRange)}]);

                              console.log(logText);

                              timeDimensions.map((td) => {
                                  updateTimeDimensions.update(td, {
                                      ...td,
                                      dateRange
                                  })
                              })
                          }
                      }}
                  />
                  <Divider />
                  <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="Please select filter"
                      onSelect={getOnSelect(availableDimensions, mainOperator, filterValues, setLogText, logText, updateFilters, user)}
                      onDeselect={(m) => updateFilters.remove(availableFilterMembers.flatMap(filter => filter.members).find(mes => mes.name === m))}>
                      {availableFilterMembers.flatMap(filter => filter.members).map(dimension => (
                          <Select.Option key={dimension.name} value={dimension.name}>
                              {dimension.title}
                          </Select.Option>
                      ))}
                  </Select>
                  <Divider />
                  <Select
                      style={{ width: "100%" }}
                      placeholder="Please select operation"
                      onSelect={(m) => {
                          setMainOperator(m);
                      }}>
                      {operators.map(operator => (
                          <Select.Option key={operator} value={operator}>
                              {operator}
                          </Select.Option>
                      ))}
                  </Select>
                  <Divider />
                  <Input.TextArea onPressEnter={
                      (textValue) => { setFilterValues([textValue.target.value])}
                  }>
                  </Input.TextArea>
                </div>
                  <Divider />
                  {dimensions.length > 0 && measures.length > 0  && timeDimensions.length > 0? (

                      <LineChartWithCategoryWithoutTimeDimension resultSet={resultSet}/>
                  ) : (
                      <Empty description="Select a dimension or measure to get started" />
                  )}
                  <Divider />
                  {dimensions.length > 0 && measures.length > 0 && timeDimensions.length > 0? (

                      <LineChartWithCategory resultSet={resultSet}/>
                  ) : (
                      <Empty description="Select a dimension or measure to get started" />
                  )}
                  <Divider />
                  {dimensions.length > 0 && measures.length > 0 && timeDimensions.length > 0? (

                      <BarChart resultSet={resultSet}/>
                  ) : (
                      <Empty description="Select a dimension or measure to get started" />
                  )}
                   <Divider />
                  <Divider />
                  <p>Add comment: </p>
                  <Input.TextArea onPressEnter={handleTextChange}>
                  </Input.TextArea>

                  <Divider />
                  <p>Comments: </p>
                  <Divider />
                  {textArray !== null? (

                      textArray.map(comment => (

                          <textarea cols="90" rows="5" value={comment} readOnly={true}></textarea>
                      ))
                  ) : (
                      <Empty description="Add comment" />
                  )}

                  <Divider/>
                  <Space align="center">
                  <Button ref={buttonRef}
                      onClick={() => {


                          let filter = importedFilter && importedFilter.length > 0 ?
                             [ {member: importedFilter[0].member, operator: importedFilter[0].operator, values: importedFilter[0].values}] :
                          []
                          updateQuery({
                              dimensions: [importedParamDimensions[0].name],
                              measures: [importedParamMeasure[0].name],
                              filters: filter,
                              timeDimensions: [{dimension: importedTimeDimension[0].dimension.name,
                                  granularity: importedTimeDimension[0].granularity}],
                              order: [
                              ["AttractionsReviews.reviewsPublishedatdate", "asc"],
                              ["WeatherOccupancyRate.occupancyPercent", "asc"],
                              ["WeatherOccupancyRate.temp", "asc"],
                              ["AttractionsPopulartimeshistogrammocked.datetime", "asc"]]
                          })
                      }}
                      variant="primary"

                  >Load to chart</Button>
                  <Button
                      onClick={() => {
                          let objectData = {
                              useCase: {
                              measures: measures,
                              dimensions: dimensions,
                              filters: filters,
                              timeDimensions: timeDimensions,
                              comment: textArray
                              },
                              userName: user.username,
                              publishedData: new Date()
                          };
                          let filename = "export.json";
                          let contentType = "application/json;charset=utf-8;";
                          if(isUserImported) {
                              setListData([
                                  ...listData,
                                  {
                                      title: 'Likes count by category name filtered by tourist attraction',
                                      description: 'I want to see dependency between count of likes by tourist attraction',
                                      avatar: user.avatarLink,
                                      fileData: {
                                          useCase: {
                                              measures: measures,
                                              dimensions: dimensions,
                                              filters: filters,
                                              timeDimensions: timeDimensions,
                                              comment: textArray
                                          }
                                      }

                                  }

                              ]);
                          }

                          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                              var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(objectData)))], { type: contentType });
                              navigator.msSaveOrOpenBlob(blob, filename);
                          } else {
                              var a = document.createElement('a');
                              a.download = filename;
                              a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(objectData));
                              a.target = '_blank';
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                          }
                      }}
                      variant="primary"

                  >Save use case file</Button>

                      <Button
                          onClick={() => {
                              handleGenerate(dimensions, measures).then(r => {
                                  let objectData = {

                                  measures: measures,
                                  dimensions: dimensions,
                                  filters: filters,
                                  timeDimensions: timeDimensions,
                                  status: "open",
                                  userName: "alex",
                                  description: r.description,
                                  title: r.title,
                                  comment: textArray,
                                  tags: [ {
                                      "name": "Paris"
                                  }],
                                  comments: [    {
                                      "comment": "Nice use case"
                                  }],

                                  publishedDateTime: new Date()
                              };
                                  setListData([
                                      ...listData,
                                      {
                                          description: r.description,
                                          title: r.title,
                                          avatar: user.avatarLink,
                                          fileData: {
                                              useCase: {
                                                  measures: measures,
                                                  dimensions: dimensions,
                                                  filters: filters,
                                                  timeDimensions: timeDimensions,
                                                  comment: textArray
                                              }
                                          }

                                      }

                                  ]);
                              handleSave(objectData);
                          });

                          }}
                          variant="primary"

                      >Save use case</Button>

                      <Button
                          onClick={() => {
                              setImportedParamDimensions(null);
                              setUseCaseDescription(["Please select dimensions, measures and filters to build chart"]);
                              setUseCaseTitle(["Query builder"]);
                              setFilterValues([]);
                              setTextArray([]);
                              updateQuery({
                                  dimensions: [],
                                  measures: [],
                                  filters: [],
                                  timeDimensions: [],
                                  order: [
                                      ["AttractionsReviews.reviewsPublishedatdate", "asc"],
                                      ["WeatherOccupancyRate.occupancyPercent", "asc"],
                                      ["WeatherOccupancyRate.temp", "asc"],
                                      ["AttractionsPopulartimeshistogrammocked.datetime", "asc"]]
                              })
                          }}
                          variant="primary"

                      >Clear form</Button>

                      <ReactFileReader handleFiles={handleJsonFiles} fileTypes={'.json'}>
                          <button className='btn'>Upload from json</button>
                      </ReactFileReader>

                      <Button
                          onClick={() => {
                             setIsUserImported(true);
                          }}
                          variant="primary"

                      >Edit</Button>
                      <div>
                          <button onClick={onLogout}>Logout</button>
                      </div>

                  </Space>
            
              </Layout.Content>


          )}
      />);
}

export default QueryBuilderTourism;
