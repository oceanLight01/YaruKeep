import React from 'react';
import { useNavigate } from 'react-router-dom';
import formatText from './FormatText';

type Props = {
    id: number;
    habitId: number;
    text: string;
    user: {
        id: number;
        screenName: string;
        name: string;
    };
    created_at: string;
};

const DiaryItem = (props: Props) => {
    let text = props.text;
    if (text.length > 100) {
        text = `${text.substring(0, 100)}...`;
    }
    const navigate = useNavigate();

    return (
        <li
            onClick={() =>
                navigate(`/user/${props.user.screenName}/habit/${props.habitId}/diary/${props.id}`)
            }
        >
            <p>{formatText(text)}</p>
            <p>{props.created_at}</p>
        </li>
    );
};

export default DiaryItem;
