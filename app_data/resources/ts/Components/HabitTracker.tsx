import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HabitDoneButton from './atoms/HabitDoneButton';
import { useAuth } from './Authenticate';
import ContributionCalendar from './ContributionCalendar';
import formatText from './FormatText';

import styles from './../../scss/HabitTracker.modules.scss';
import CategoryBadge from './atoms/CategoryBadge';

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
            <CategoryBadge
                {...{ category_id: item.category_id, category_name: item.category_name }}
            />
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
