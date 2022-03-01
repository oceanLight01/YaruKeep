import React from 'react';
import { useNavigate } from 'react-router-dom';
import formatText from './FormatText';

const DiaryItem = (props: DiaryItem) => {
    let text = props.text;
    if (text.length > 100) {
        text = `${text.substring(0, 100)}...`;
    }
    const navigate = useNavigate();

    return (
        <li
            onClick={() =>
                navigate(
                    `/user/${props.user.screen_name}/habit/${props.habit_id}/diary/${props.id}`
                )
            }
        >
            <p>{formatText(text)}</p>
            <p>{props.created_at}</p>
        </li>
    );
};

export default DiaryItem;
