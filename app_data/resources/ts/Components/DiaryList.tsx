import React from 'react';
import DiaryItem from './DiaryItem';

type Props = {
    diaries: {
        id: number;
        habitId: number;
        text: string;
        created_at: string;
    }[];
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
