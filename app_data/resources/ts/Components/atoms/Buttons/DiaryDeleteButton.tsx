import React from 'react';

type Props = {
    diaryId: number;
    deleteDiary: (DiaryId: number) => void;
};

const DiaryDeleteButton = (props: Props) => {
    return <button onClick={() => props.deleteDiary(props.diaryId)}>削除</button>;
};

export default DiaryDeleteButton;
