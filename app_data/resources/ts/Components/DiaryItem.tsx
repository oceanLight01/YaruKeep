import React from 'react';
import { Link } from 'react-router-dom';
import formatText from './FormatText';

import styles from './../../scss/DiaryItem.modules.scss';

const DiaryItem = (props: DiaryItem) => {
    let text = props.text;
    if (text.length > 100) {
        text = `${text.substring(0, 100)}...`;
    }

    return (
        <li className={styles.diary_item}>
            <Link to={`/user/${props.user.screen_name}/habit/${props.habit_id}/diary/${props.id}`}>
                <p>{formatText(text)}</p>
                <div className={styles.created}>{props.created_at}</div>
            </Link>
        </li>
    );
};

export default DiaryItem;
