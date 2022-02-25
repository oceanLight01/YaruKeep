import React from 'react';

type Props = {
    text: string;
    created_at: string;
};

const DiaryItem = (props: Props) => {
    let text = props.text;
    if (text.length > 100) {
        text = `${text.substring(0, 100)}...`;
    }

    return (
        <li>
            <p>{text}</p>
            <p>{props.created_at}</p>
        </li>
    );
};

export default DiaryItem;
