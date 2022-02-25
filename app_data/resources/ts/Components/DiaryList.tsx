import React from 'react';
import DiaryItem from './DiaryItem';

type Props = {
    diaries: {
        id: number;
        habitId: number;
        text: string;

        created_at: string;
    }[];
    user: {
        id: number;
        screenName: string;
        name: string;
    };
};

const DiaryList = ({ diaries, user }: Props) => {
    return (
        <ul>
            {diaries.map((item, index) => {
                return <DiaryItem {...{ ...item, user }} key={index} />;
            })}
        </ul>
    );
};

export default DiaryList;
