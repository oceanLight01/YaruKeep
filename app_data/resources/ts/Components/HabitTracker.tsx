import React from 'react';
import DistributionCalendar from './ContributionCalendar';

type Props = {
    item: {
        title: string;
        description: string;
        categoryId: number;
        categoryName: string;
        maxDoneDay: number;
        doneDaysCount: number;
        doneDaysList: { [date: string]: number };
        isPrivate: boolean;
        created_at: string;
        updated_at: string;
    };
};

const HabitTracker = ({ item }: Props) => {
    console.log(item);
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
        </li>
    );
};

export default HabitTracker;
