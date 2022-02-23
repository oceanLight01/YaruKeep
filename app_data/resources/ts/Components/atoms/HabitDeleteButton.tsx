import React from 'react';

type Props = {
    id: number;
    deleteHabit: (habitId: number) => void;
};

const HabitDeleteButton = (props: Props) => {
    return <button onClick={() => props.deleteHabit(props.id)}>削除</button>;
};

export default HabitDeleteButton;
