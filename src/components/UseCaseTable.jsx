import React, { useState, useEffect } from 'react';
import { fetchUseCases } from './services/useCasesService';
import './TableStyles.css';

const UseCasesTable = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data on component mount
        const getData = async () => {
            try {
                const result = await fetchUseCases();
                setData(result); // Assuming result is an array of objects
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <table border="1" className="styled-table">
            <thead>
            <tr>
                <th>Use Case ID</th>
                <th>User Name</th>
                <th>Description</th>
                <th>Measures</th>
                <th>Dimensions</th>
                <th>Comments</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item) => (

                <tr key={item.useCaseId}>
                    <td>{item.useCaseId}</td>
                    <td>{item.userName}</td>
                    <td>{item.description}</td>
                    <td>
                        <table border="1" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                            <tbody>
                            {item.measures.map((measure, index) => (
                                <tr key={index}>
                                    <td>{measure.measureName}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <table border="1" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                            <tbody>
                            {item.dimensions.map((dim, index) => (
                                <tr key={index}>
                                    <td>{dim.dimensionName}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <table border="1" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                            <tbody>
                            {item.comments.map((comment, index) => (
                                <tr key={index}>
                                    <td>{comment.comment}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </td>
                </tr>

            ))}
            </tbody>
        </table>
    );
};

export default UseCasesTable;