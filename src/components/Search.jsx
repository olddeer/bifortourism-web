import React, {useState} from 'react';
import {List, Avatar, Layout, Select, Divider, Input, Empty} from 'antd';
import {Button} from "react-bootstrap";
import {createTitleAndDescription, searchByAlreadyCreated} from "./services/chatGptService";

const Search = ({setImportedParamDimensions, setImportedParamMeasure, setImportedTimeDimension,
                    setAvatarLink, setUseCaseDescription, setUseCaseTitle, setIsUserImported, listData,
                    setTextArray, textArray, importedFilter, setImportedFilters}) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const handleGenerate = async () => {
        try {
            const result = await searchByAlreadyCreated(searchQuery, listData);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'user', text: searchQuery },
                { sender: 'bot', text: result }, // Assuming result is the response text
            ]);
            console.log(result);
        } catch (err) {
            console.log(err)
        }
    };
    return (
        <div style={styles.container}>
            <div style={styles.chatBox}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={
                            msg.sender === 'user' ? styles.userMessage : styles.botMessage
                        }
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <div style={styles.chatContainer}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type your message..."
                    style={styles.input}
                />
                <button onClick={handleGenerate} style={styles.button}>
                    Send
                </button>
                <button onClick={
                    () => {
                        const titleMatch = messages[1].text.match(/Title:\s*"(.*?)"/);
                        let item = listData.find(data => data.title === titleMatch || data.title === titleMatch[0] ||
                            data.title === titleMatch[1]);
                        setImportedParamDimensions(item.fileData.useCase.dimensions);
                        setImportedParamMeasure(item.fileData.useCase.measures);
                        setImportedTimeDimension(item.fileData.useCase.timeDimensions);
                        setAvatarLink(item.avatar);
                        setUseCaseDescription(item.description);
                        setUseCaseTitle(item.title);
                        setIsUserImported(false);
                        setTextArray(item.fileData.useCase.comments.map(comment => comment.comment));
                        setImportedFilters(item.fileData.useCase.filters);
                    }

                } style={styles.button}>
                    Open usecase
                </button>
            </div>



        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
    },
    chatBox: {
        width: '600px',
        maxHeight: '400px',
        overflowY: 'auto',
        backgroundColor: '#ffffff',
        padding: '10px',
        borderRadius: '15px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        marginBottom: '15px',
    },
    userMessage: {
        textAlign: 'right',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '15px',
        margin: '5px 0',
        maxWidth: '75%',
        alignSelf: 'flex-end',
    },
    botMessage: {
        textAlign: 'left',
        backgroundColor: '#e4e6eb',
        color: '#000',
        padding: '10px 15px',
        borderRadius: '15px',
        margin: '5px 0',
        maxWidth: '75%',
        alignSelf: 'flex-start',
    },
    chatContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: '25px',
        padding: '10px',
        width: '600px',
    },
    input: {
        flex: 1,
        border: 'none',
        outline: 'none',
        padding: '10px 15px',
        fontSize: '16px',
        borderRadius: '25px',
        backgroundColor: '#f1f3f4',
    },
    button: {
        marginLeft: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '25px',
        cursor: 'pointer',
    },
};

export default Search;