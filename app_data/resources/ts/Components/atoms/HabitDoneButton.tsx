import React from 'react';

type Props = {
    id: number;
    doneHabit: (habitId: number) => void;
};

const HabitDoneButton = (props: Props) => {
    return <button onClick={() => props.doneHabit(props.id)}>完了</button>;
};

export default HabitDoneButton;
