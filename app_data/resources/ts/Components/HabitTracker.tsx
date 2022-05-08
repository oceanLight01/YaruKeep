import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HabitDoneButton from './atoms/HabitDoneButton';
import { useAuth } from './Authenticate';
import ContributionCalendar from './ContributionCalendar';
import formatText from './FormatText';

import styles from './../../scss/HabitTracker.modules.scss';

type Props = {
    item: HabitItem;
    index: number;
    doneHabit?: (habitId: number) => void;
};

const HabitTracker = ({ item, index, doneHabit }: Props) => {
    const auth = useAuth();
    const navigation = useNavigate();

    const handleClick = () => {
        navigation(`/user/${item.user.screen_name}/habit/${item.id}`);
    };

    const categoryBadgeList = [
        styles.category_01,
        styles.category_02,
        styles.category_03,
        styles.category_04,
        styles.category_05,
        styles.category_06,
        styles.category_07,
        styles.category_08,
        styles.category_09,
        styles.category_10,
        styles.category_11,
        styles.category_12,
        styles.category_13,
        styles.category_14,
        styles.category_15,
    ];

    const categoryBadgeStyle = categoryBadgeList[item.category_id - 1];

    // 親要素のクリックイベントを発火させないための関数
    const stopEvent = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <li className={styles.habit_tracker_container} onClick={handleClick}>
            <h2 className={styles.habit_tracker_title}>{item.title}</h2>
            <p className={styles.habit_tracker_description}>{formatText(item.description)}</p>
            <div className={styles.calendar_container}>
                <div className={styles.calendar_wrapper}>
                    <ContributionCalendar values={item.done_days_list} />
                </div>
                <div className={styles.habit_tracker_done_info}>
                    <div>
                        <div className={styles.done_title}>合計達成日数</div>
                        <div className={styles.done_day}>
                            <span>{item.done_days_count}</span>日
                        </div>
                    </div>
                    <div>
                        <div className={styles.done_title}>最大連続達成日数</div>
                        <div className={styles.done_day}>
                            <span>{item.max_done_day}</span>日
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.habit_tracker_category}>
                <div className={`${styles.category} ${categoryBadgeStyle}`}>
                    {item.category_name}
                </div>
            </div>
            <div className={styles.habit_tracker_created}>{item.created_at}</div>
            <div className={styles.habit_tracker_user_name}>
                <Link to={`/user/${item.user.screen_name}`} onClick={stopEvent}>
                    {item.user.name}
                </Link>
            </div>
            <span onClick={stopEvent}>
                {auth?.userData?.id === item.user.id && doneHabit !== undefined ? (
                    <HabitDoneButton
                        doneHabit={doneHabit!}
                        id={item.id}
                        isDone={item.is_done}
                        index={index}
                    />
                ) : null}
            </span>
        </li>
    );
};

export default HabitTracker;
