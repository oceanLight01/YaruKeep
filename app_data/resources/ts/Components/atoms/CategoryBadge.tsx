import React from 'react';

import styles from 'scss/Components/Atoms/CategoryBadge.modules.scss';

type Props = {
    category_id: number;
    category_name: string;
};

const CategoryBadge = (props: Props) => {
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

    const categoryBadgeStyle = categoryBadgeList[props.category_id - 1];

    return (
        <div className={styles.habit_tracker_category}>
            <div className={`${styles.category} ${categoryBadgeStyle}`}>{props.category_name}</div>
        </div>
    );
};

export default CategoryBadge;
