import React, {useEffect, useState} from "react";
import {Container, Navbar, Tab, Tabs} from "react-bootstrap";
import AreaChart from "./components/AreaChart";
import LineChart from "./components/MapChartReviewAtrractions";
import Login from "./components/Login";
import QueryBuilderTourism from "./components/QueryBuilderTourism";
import cubejs from "@cubejs-client/core";
import MyList from "./components/MyList";
import {fetchUseCases} from "./components/services/useCasesService";
import Search from "./components/Search";

export const cubejsApi = cubejs("token", {
    apiUrl: `http://localhost:4000/cubejs-api/v1`,
});

const App = () => {
    const [user, setUser] = useState(null);
    var [importedParamDimensions, setImportedParamDimensions] = useState([]);
    var [importedParamMeasure, setImportedParamMeasure] = useState([{name: "AttractionsReviews.reviewsLikescount"}]);
    var [importedTimeDimension, setImportedTimeDimension] = useState([{granularity:"week", dimension: {name: "AttractionsReviews.reviewsPublishedatdate"}}]);

    var [avatarLink, setAvatarLink] = useState(["https://api.dicebear.com/7.x/miniavs/svg?seed=0"]);
    var [useCaseDescription, setUseCaseDescription] = useState(["Please select dimensions, measures and filters to build chart"]);
    var [useCaseTitle, setUseCaseTitle] = useState(["Query builder"]);
    var [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log(importedParamDimensions);

    const handleLogout = () => {
        setUser(null);
        setTextArray([]);
        setUseCaseDescription(["Please select dimensions, measures and filters to build chart"]);
        setUseCaseTitle(["Query builder"]);
        setImportedParamDimensions([]);
        setImportedParamMeasure([]);
        setImportedFilters([]);
        setIsUserImported(true);
    };

    useEffect(() => {
        // Fetch data on component mount
        const getData = async () => {
            try {
                const result = await fetchUseCases();
                setData(result.map(dto => {
                    return {
                        title: dto.title,
                        description: dto.description,
                        avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=' + Math.floor(Math.random() * 3),
                        fileData: {useCase: dto},
                    };
                })); // Assuming result is an array of objects
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);


    const [textArray, setTextArray] = useState([]);
    const [isUserImported, setIsUserImported] = useState(false);

    let [importedFilter, setImportedFilters] = useState([]);
    console.log(data);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="App">
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand>BI4Tourism</Navbar.Brand>
                </Container>
            </Navbar>
        {user ? (

                <Tabs
                    defaultActiveKey="profile"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="home" title="Chat gpt">
                        <AreaChart />
                    </Tab>
                    <Tab eventKey="profile" title="Query builder">
                        <QueryBuilderTourism user={user} onLogout={handleLogout} importedParamDimensions = {importedParamDimensions}
                        importedParamMeasure = {importedParamMeasure} importedTimeDimension = {importedTimeDimension}
                        setImportedParamDimensions = {setImportedParamDimensions}
                        setImportedParamMeasure = {setImportedParamMeasure}
                        setImportedTimeDimension = {setImportedTimeDimension}
                                             avatarLink = {avatarLink}
                                             useCaseDescription = {useCaseDescription}
                                             useCaseTitle = {useCaseTitle}
                                             setUseCaseDescription = {setUseCaseDescription}
                                             setUseCaseTitle = {setUseCaseTitle}
                                             listData = {data}
                                             setListData = {setData}
                                             isUserImported = {isUserImported}
                                             setIsUserImported = {setIsUserImported}
                                             textArray = {textArray}
                                             setTextArray = {setTextArray}
                                             importedFilter = {importedFilter}
                                             setImportedFilters = {setImportedFilters}
                                            />
                    </Tab>
                    <Tab eventKey="list" title="List of users' requests">
                        <MyList setImportedParamDimensions = {setImportedParamDimensions}
                                setImportedParamMeasure = {setImportedParamMeasure}
                                setImportedTimeDimension = {setImportedTimeDimension}
                                setAvatarLink = {setAvatarLink}
                                setUseCaseDescription = {setUseCaseDescription}
                                setUseCaseTitle = {setUseCaseTitle}
                                setIsUserImported = {setIsUserImported}
                                listData = {data}
                                textArray = {textArray}
                                setTextArray = {setTextArray}
                                importedFilter = {importedFilter}
                                setImportedFilters = {setImportedFilters}
                        />
                    </Tab>
                    <Tab eventKey="search" title="Search by already created usecases">
                        <Search setImportedParamDimensions = {setImportedParamDimensions}
                                setImportedParamMeasure = {setImportedParamMeasure}
                                setImportedTimeDimension = {setImportedTimeDimension}
                                setAvatarLink = {setAvatarLink}
                                setUseCaseDescription = {setUseCaseDescription}
                                setUseCaseTitle = {setUseCaseTitle}
                                setIsUserImported = {setIsUserImported}
                                listData = {data}
                                textArray = {textArray}
                                setTextArray = {setTextArray}
                                importedFilter = {importedFilter}
                                setImportedFilters = {setImportedFilters}/>
                    </Tab>
                </Tabs>

        ) : (
            <Login setUser={setUser} setIsUserImported={setIsUserImported} />
        )}
        <div>
        <LineChart></LineChart>
        </div>
    </div>);

};

export default App;
