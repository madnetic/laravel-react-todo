import React, {
    Component, 
    Fragment
}                       from 'react';
import PropTypes        from 'prop-types';

import * as cn          from 'classnames';
import moment           from 'moment';

import ReactSelect      from 'react-select';
import DateRangePicker  from 'react-bootstrap-daterangepicker';

import cfg              from '../../config';
import Button           from '../common/Button';
import Checkbox         from '../forms/Checkbox';
import Select           from '../forms/Select';
import {
    taskSchema,
    optionSchema
}                       from '../../validation/props';

import 'bootstrap-daterangepicker/daterangepicker.css';

export default class TasklistFilters extends Component {
    static propTypes = {
        tasks               : PropTypes.arrayOf(taskSchema),
        priorityValues      : PropTypes.arrayOf(optionSchema).isRequired,
        selectedPriority    : PropTypes.arrayOf(optionSchema),
        showLate            : PropTypes.bool.isRequired,
        showDone            : PropTypes.bool.isRequired,
        startDate           : PropTypes.object,
        endDate             : PropTypes.object,
        dateRanges          : PropTypes.objectOf(PropTypes.array).isRequired,
        defaultDateRange    : PropTypes.string,
        sortBy              : PropTypes.string.isRequired,
        sortValues          : PropTypes.arrayOf(optionSchema).isRequired,
        className           : PropTypes.string,
        onDateRangeChange   : PropTypes.func,
        onPriorityChange    : PropTypes.func,
        onShowDoneChange    : PropTypes.func,
        onShowLateChange    : PropTypes.func,
        onSortByChange      : PropTypes.func
    };
    static defaultProps = {
        tasks               : [],
        priorityValues      : [],
        selectedPriority    : null,
        startDate           : null,
        endDate             : null,
        showLate            : true,
        showDone            : false,
        dateRanges          : {},
        defaultDateRange    : null,
        sortBy              : 'expires_at_asc',
        sortValues          : [],
        className           : null,
        onDateRangeChange   : () => {},
        onPriorityChange    : () => {},
        onShowDoneChange    : () => {},
        onShowLateChange    : () => {},
        onSortByChange      : () => {}
    };

    static Wrap = ({ children, className, ...props }) => <div className={cn('py-1', { [className]: className })} {...props}>{children}</div>

    constructor(props) {
        super(props);

        const { startDate, endDate, dateRanges, defaultDateRange, onDateRangeChange } = props;
        
        this.startDate  = startDate || (defaultDateRange !== 'Any' && typeof dateRanges[defaultDateRange] !== 'undefined' && dateRanges[defaultDateRange][0]) || moment().subtract(99, 'days');
        this.endDate    = endDate   || (defaultDateRange !== 'Any' && typeof dateRanges[defaultDateRange] !== 'undefined' && dateRanges[defaultDateRange][1]) || moment().add(99, 'days');

        this.state = { dateRangeBtnLabel: defaultDateRange };

        onDateRangeChange(defaultDateRange, startDate, endDate);
    }

    render() {
        const { tasks, className, priorityValues, selectedPriority, showDone, showLate, onPriorityChange, onShowLateChange, onShowDoneChange, onSortByChange, sortBy, sortValues, dateRanges, defaultDateRange, startDate, endDate, onDateRangeChange, children, ...props } = this.props;
        const { dateRangeBtnLabel } = this.state;

        return (
            <Fragment>
                {children && <div className="text-left">{children}</div>}
                <div className={cn('bg-white py-2 d-flex flex-wrap justify-content-center align-items-center', { [className]: className })} style={{ flexGrow: 1 }} {...props}>
    
                    <TasklistFilters.Wrap className="px-4">
                        <label className="d-block text-left m-0">Date Range</label>
                        <DateRangePicker
                            startDate   = {this.startDate}
                            endDate     = {this.endDate}
                            ranges      = {dateRanges}
                            onApply     = {(e, picker) => {
                                const label = picker.chosenLabel === 'Custom Range' ?
                                    picker.startDate.format(cfg.dateFormat) + ' to ' + picker.endDate.format(cfg.dateFormat) : picker.chosenLabel;

                                this.setState({ dateRangeBtnLabel: label }); 

                                if (label === 'Any') {
                                    onDateRangeChange(label);
                                } else {
                                    onDateRangeChange(label, picker.startDate, picker.endDate);
                                }
                            }}
                            showDropdowns
                            alwaysShowCalendars
                            autoApply
                        >
                            <Button 
                                variant     = "default" 
                                icon        = "calendar" 
                                label       = {dateRangeBtnLabel} 
                                className   = "d-flex align-items-center" 
                                labelStyle  = {{ whiteSpace: 'normal', textAlign: 'left', fontSize: '0.75rem', lineHeight: 1 }}
                                labelClass  = "ml-1"
                                style       = {{ width: '150px', height: '2.4rem' }} 
                            />
                        </DateRangePicker>
                    </TasklistFilters.Wrap>
    
                    <TasklistFilters.Wrap className="px-4">
                        <label className="mb-0">Priority</label>
                        <ReactSelect 
                            isMulti
                            closeMenuOnSelect   = {false}
                            placeholder         = "Any"
                            options             = {priorityValues}
                            styles              = {{ control: base => ({ ...base, width: 244 }) }}
                            onChange            = {onPriorityChange}
                            value               = {selectedPriority}
                        />
                    </TasklistFilters.Wrap>

                    <div className="d-flex mb-2 mb-sm-0">
                        <TasklistFilters.Wrap className="px-4">
                            <Checkbox
                                label           = "Show late"
                                variant         = "danger"
                                name            = "showLate"
                                checked         = {showLate}
                                onChange        = {onShowLateChange}
                                containerClass  = "mb-0 mt-3 mt-sm-4"
                            />
                        </TasklistFilters.Wrap>
    
                        <TasklistFilters.Wrap className="px-sm-4">
                            <Checkbox
                                label           = "Show done"
                                variant         = "success"
                                name            = "showDone"
                                checked         = {showDone}
                                onChange        = {onShowDoneChange}
                                containerClass  = "mb-0 mt-3 mt-sm-4"
                            />
                        </TasklistFilters.Wrap>
                    </div>
    
                    <TasklistFilters.Wrap className="px-4">
                        <label className="d-block text-left mb-0" style={{ marginLeft: '12px' }}>Sort By</label>
                        <Select 
                            value       = {sortBy}
                            values      = {sortValues}
                            onChange    = {e => onSortByChange(e.target.value)}
                            style       = {{ width: '150px' }}
                            containerClass = "mb-0"
                            horizontal
                            hidePlaceholder
                        />
                    </TasklistFilters.Wrap>
    
                </div>
            </Fragment>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        const { startDate, endDate, selectedPriority, showLate, showDone, sortBy } = this.props;
        const { dateRangeBtnLabel } = this.state;

        if (showLate            !== prevProps.showLate          || 
            showDone            !== prevProps.showDone          ||
            startDate           !== prevProps.startDate         ||
            endDate             !== prevProps.endDate           ||
            selectedPriority    !== prevProps.selectedPriority  ||
            sortBy              !== prevProps.sortBy
        ) {
            localStorage.setItem(cfg.settingsKeyName, btoa(JSON.stringify({
                showLate            : showLate,
                showDone            : showDone,
                dateRange           : dateRangeBtnLabel,
                startDate           : startDate,
                endDate             : endDate,
                selectedPriority    : selectedPriority,
                sortBy              : sortBy
            }))); 
        }
    }
}
