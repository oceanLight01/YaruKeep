import React from 'react';

type Props = {
    id: number;
    isDone: boolean;
    doneHabit: (habitId: number) => void;
};

const HabitDoneButton = (props: Props) => {
    return (
        <button onClick={() => props.doneHabit(props.id)} disabled={props.isDone}>
            完了
        </button>
    );
};

export default HabitDoneButton;
