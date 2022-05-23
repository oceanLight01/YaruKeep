import React from 'react';

import MaterialButton from '@mui/material/Button';

type Props = {
    variant?: 'outlined' | 'text';
    value: string;
    color?: 'warning' | 'error';
    type?: 'submit';
    disabled?: boolean;
    clickHandler?: () => void;
};

const Button = ({ variant, value, color, type, disabled, clickHandler }: Props) => {
    return (
        <MaterialButton
            variant={variant ?? 'contained'}
            type={type ?? 'button'}
            color={color ?? 'primary'}
            disabled={disabled}
            onClick={clickHandler}
        >
            {value}
        </MaterialButton>
    );
};

export default Button;
