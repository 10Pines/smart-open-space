import React, { useState } from 'react';
import {Box, Calendar, DropButton, Text} from 'grommet';
import PropTypes from 'prop-types';
import {CalendarIcon} from '#shared/icons';
import customTheme from "#app/theme.js";

const getNextYear = () => new Date(new Date().setFullYear(new Date().getFullYear() + 1));

const DateTimePicker = ({ onChange, value, primary = true, calendarProps = {}, label = "Fecha", ...props }) => {
    const [open, setOpen] = useState(false);

    const onSelect = (nextDate) => {
        onChange(nextDate);
        setOpen(false);
    };
    const primaryColor = customTheme.global.colors.primary.light;

    return (
        <Box
            style={{
                position: 'relative',
                display: 'inline-block',
            }}
        >
            {label && (
                <label
                    style={{
                        position: 'absolute',
                        left: '16px',
                        fontSize: '0.8rem',
                        color: primary ?  "white" : primaryColor,
                        backgroundColor: primary ? primaryColor : "white",
                        padding: '0 2px 2px 2px',
                        transform: 'translateY(-50%)',
                        transition: '0.2s ease all',
                        pointerEvents: 'none',
                        zIndex: 1,
                        borderRadius: '5px'
                    }}
                >
                    {label}
                </label>
            )}
            <DropButton
                dropContent={
                    <Calendar
                        bounds={[new Date().toISOString(), getNextYear().toISOString()]}
                        date={value}
                        daysOfWeek
                        onSelect={onSelect}
                        locale="es"
                        size="small"
                        style={{
                            width: '90%',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            paddingTop: '10px',
                            paddingBottom: '10px',
                        }}
                        alignSelf={'center'}
                        { ...calendarProps }
                    />
                }
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                style={{border: `solid 1px ${ primary ? "white" : primaryColor}`,
                    borderRadius: '4px',
                    width: '356px',
                    height: '56px',
                    backgroundColor: primary ? primaryColor : "white",
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
                icon={<CalendarIcon color={ primary ? 'white' : primaryColor } />}
                label={ <Text color={ primary ? "white" : primaryColor } weight={'normal'}>
                    {value ? new Date(value).toLocaleDateString('es') : 'dd/mm/yyyy'}
                </Text> }
                { ...props }
            />
        </Box>
    );
};
DateTimePicker.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    primary: PropTypes.bool
};

export default DateTimePicker;
