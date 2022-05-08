import React from 'react';

import Button from '@mui/material/Button';

type Props = {
    id: number;
    isDone: boolean;
    index?: number;
    doneHabit: (habitId: number, index?: number) => void;
};

const HabitDoneButton = (props: Props) => {
    return (
        <Button
            variant="contained"
            onClick={() => props.doneHabit(props.id, props.index)}
            disabled={props.isDone}
        >
            完了
        </Button>
    );
};

export default HabitDoneButton;
