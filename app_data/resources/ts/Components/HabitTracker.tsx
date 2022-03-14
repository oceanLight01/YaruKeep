import React from 'react';
import { useNavigate } from 'react-router-dom';
import HabitDoneButton from './atoms/HabitDoneButton';
import { useAuth } from './Authenticate';
import ContributionCalendar from './ContributionCalendar';
import formatText from './FormatText';

type Props = {
    item: HabitItem;
    index: number;
    doneHabit: (habitId: number) => void;
};

const HabitTracker = ({ item, index, doneHabit }: Props) => {
    const auth = useAuth();
    const navigation = useNavigate();

    const handleClick = () => {
        navigation(`/user/${item.user.screen_name}/habit/${item.id}`);
    };

    return (
        <li>
            <div onClick={handleClick}>
                <p>{item.title}</p>
                <p>{formatText(item.description)}</p>
                <p>カテゴリ:{item.category_name}</p>
                <p>総達成日数:{item.done_days_count}日</p>
                <p>最大連続達成日数:{item.max_done_day}日</p>
                <p>作成日:{item.created_at}</p>
                <div>
                    <ContributionCalendar values={item.done_days_list} />
                </div>
            </div>
            {auth?.userData?.id === item.user.id ? (
                <HabitDoneButton
                    doneHabit={doneHabit}
                    id={item.id}
                    isDone={item.is_done}
                    index={index}
                />
            ) : null}
        </li>
    );
};

export default HabitTracker;
