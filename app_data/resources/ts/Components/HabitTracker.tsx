import React from 'react';

type Props = {
    item: {
        title: string;
        description: string;
        categoryId: number;
        categoryName: string;
        maxDoneDay: number;
        doneDaysCount: number;
        created_at: string;
        updated_at: string;
    };
};

const HabitTracker = ({ item }: Props) => {
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
        </li>
    );
};

export default HabitTracker;
