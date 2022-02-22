import React from 'react';
import HabitDoneButton from './atoms/HabitDoneButton';
import { useAuth } from './Authenticate';
import DistributionCalendar from './ContributionCalendar';

type Props = {
    item: HabitItem;
    doneHabit: (habitId: number) => void;
};

const HabitTracker = ({ item, doneHabit }: Props) => {
    const auth = useAuth();

    return (
        <li>
            <p>{item.title}</p>
            <p>
                {item.description
                    ? item.description.split('\n').map((str, index) => (
                          <React.Fragment key={index}>
                              {str}
                              <br />
                          </React.Fragment>
                      ))
                    : ''}
            </p>
            <p>カテゴリ:{item.categoryName}</p>
            <p>総達成日数:{item.doneDaysCount}日</p>
            <p>最大連続達成日数:{item.maxDoneDay}日</p>
            <p>作成日:{item.created_at}</p>
            <div>
                <DistributionCalendar values={item.doneDaysList} />
            </div>
            {auth?.userData?.id === item.user.id ? (
                <HabitDoneButton doneHabit={doneHabit} id={item.id} isDone={item.isDone} />
            ) : null}
        </li>
    );
};

export default HabitTracker;
