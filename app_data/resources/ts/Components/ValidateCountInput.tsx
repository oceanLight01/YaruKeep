import React from 'react';

type Props = {
    text: string;
    limit: number;
};

const ValidateCountInput = ({ text, limit }: Props) => {
    // フォームに入力している文字数をカウント
    const stringLength = text === undefined ? 0 : String(text).length;
    const counter = `${stringLength} / ${limit}`;
    const isOver = stringLength > limit;
    const color = isOver ? '#ff6347' : '#808080';

    return <div style={{ fontSize: '0.8em', color: color }}>{counter}</div>;
};

export default ValidateCountInput;
