/**
 *  Name_file :dates.js
 *  Description: Componente sobre selecion de fechas
 */


import React from 'react';

/**Importaciones del time*/
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

/**Estilos CSS*/
import '../../styles/styleGeneral.css';

const Dates = ({ handleDateChange,param}) => {
    return (
        <ul className={"flex-row"}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                  <li className={"flex-item-form"}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                       // label="Date picker inline"
                        value={param}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                  </li>
                  <li className={"flex-item-form"}>
                    <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                       // label="Time picker"
                        value={param}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                    />
                  </li>
                </Grid>
            </MuiPickersUtilsProvider>
        </ul>
    )
};

export default Dates;