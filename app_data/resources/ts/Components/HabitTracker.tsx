import React from 'react';
import { useNavigate } from 'react-router-dom';
import HabitDoneButton from './atoms/HabitDoneButton';
import { useAuth } from './Authenticate';
import DistributionCalendar from './ContributionCalendar';
import formatText from './FormatText';
import FormatText from './FormatText';

type Props = {
    item: HabitItem;
    index: number;
    doneHabit: (habitId: number) => void;
};

const HabitTracker = ({ item, index, doneHabit }: Props) => {
    const auth = useAuth();
    const navigation = useNavigate();

    const handleClick = () => {
        navigation(`/user/${item.user.screenName}/habit/${item.id}`);
    };

    return (
        <li>
            <div onClick={handleClick}>
                <p>{item.title}</p>
                <p>{formatText(item.description)}</p>
                <p>カテゴリ:{item.categoryName}</p>
                <p>総達成日数:{item.doneDaysCount}日</p>
                <p>最大連続達成日数:{item.maxDoneDay}日</p>
                <p>作成日:{item.created_at}</p>
                <div>
                    <DistributionCalendar values={item.doneDaysList} />
                </div>
            </div>
            {auth?.userData?.id === item.user.id ? (
                <HabitDoneButton
                    doneHabit={doneHabit}
                    id={item.id}
                    isDone={item.isDone}
                    index={index}
                />
            ) : null}
        </li>
    );
};

export default HabitTracker;
