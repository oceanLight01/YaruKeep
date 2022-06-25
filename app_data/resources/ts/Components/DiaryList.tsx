import React from 'react';
import DiaryItem from './Atoms/DiaryItem';

type Props = {
    diaries: DiaryItem[];
};

const DiaryList = ({ diaries }: Props) => {
    return (
        <ul>
            {diaries.map((item, index) => {
                return <DiaryItem {...item} key={index} />;
            })}
        </ul>
    );
};

export default DiaryList;
