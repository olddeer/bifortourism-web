import React, {useState} from 'react';
import {List, Avatar, Layout, Select, Divider, Input, Empty} from 'antd';
import {Button} from "react-bootstrap";

const MyList = ({setImportedParamDimensions, setImportedParamMeasure, setImportedTimeDimension,
                    setAvatarLink, setUseCaseDescription, setUseCaseTitle, setIsUserImported, listData,
                    setTextArray, textArray, importedFilter, setImportedFilters}) => {


    return (
        <List
            itemLayout="horizontal"
            dataSource={listData}
            renderItem={item => (
                <List.Item actions={[
            <Button onClick={
                () => {

                    setImportedParamDimensions(item.fileData.useCase.dimensions);
                    setImportedParamMeasure(item.fileData.useCase.measures);
                    setImportedTimeDimension(item.fileData.useCase.timeDimensions);
                    setAvatarLink(item.avatar);
                    setUseCaseDescription(item.description);
                    setUseCaseTitle(item.title);
                    setIsUserImported(false);
                    setTextArray(item.fileData.useCase.comments !== undefined ? item.fileData.useCase.comments.map(comment => comment.comment) :
                        item.fileData.useCase.comment);
                    setImportedFilters(item.fileData.useCase.filters);
                }

            }>Check request</Button>
                ]}>
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar}/>}
                        title={item.title}
                        description={item.description}
                    />
                </List.Item>
            )}
        />
    );
};

export default MyList;