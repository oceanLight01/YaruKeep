import React from 'react';

type Props = {
    id: number;
    isDone: boolean;
    index?: number;
    doneHabit: (habitId: number, index?: number) => void;
};

const HabitDoneButton = (props: Props) => {
    return (
        <button onClick={() => props.doneHabit(props.id, props.index)} disabled={props.isDone}>
            完了
        </button>
    );
};

export default HabitDoneButton;
