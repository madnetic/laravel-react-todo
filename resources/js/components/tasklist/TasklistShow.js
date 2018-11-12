import React, {
    Component, 
    Fragment, 
    createRef 
}                       from 'react';

import { Link }         from 'react-router-dom';
import { Sticky }       from 'react-sticky';
import Breadcrumb       from 'react-bootstrap/lib/Breadcrumb';
import styled           from 'styled-components';
import * as cn          from 'classnames';
import moment           from 'moment';
import qs               from 'qs';

import cfg              from '../../config';
import http             from '../../services/http';
import Button           from '../common/Button';
import Modal            from '../common/Modal';
import Spinner          from '../common/Spinner';
import Task             from '../task/Task';
import TaskCreate       from '../task/TaskCreate';
import TasklistFilters  from './TasklistFilters';

export default class TasklistShow extends Component {
    static StyledTasks = styled.div`
        min-height: 50vh;

        & > .card {
            &.danger  { border-left: 3px solid #dc3545; }
            &.warning { border-left: 3px solid #ffc107;}
            &.info    { border-left: 3px solid #17a2b8; }
  
            & > .card-body {
                & > div:first-child {
                    &:hover { cursor: pointer; }
                }
            }
        }
  
        .done {
            &:not(.selected) {
                opacity: 0.2;  
        
                .title { text-decoration: line-through; }  
            }
        }`;

    static StyledPanel = styled.div`z-index: 999;`;

    constructor(props) {
        super(props);

        const settings = localStorage.getItem(cfg.settingsKeyName);
        if (settings) {
            var { showDone, showLate, dateRange, startDate, endDate, selectedPriority, sortBy } = JSON.parse(atob(settings));
        }

        this.tasklistId = parseInt(this.props.match.params.id, 10);

        this.filterDateRanges = {
            'Any'           : [moment().startOf('month'), moment().startOf('month')],
            'Today'         : [moment(), moment()],
            'Tomorrow'      : [moment().add(1, 'days'), moment().add(1, 'days')],
            'Next 7 Days'   : [moment(), moment().add(6, 'days')],
            'Next 30 Days'  : [moment(), moment().add(29, 'days')],
            'This Month'    : [moment().startOf('month'), moment().endOf('month')],
            'Next Month'    : [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
            'This Year'     : [moment().startOf('year'), moment().endOf('year')],
            'Next Year'     : [moment().add(1, 'year').startOf('year'), moment().add(1, 'year').endOf('year')]
        };

        this.priorities = [
            { value: 'low',     label: 'Low' },
            { value: 'medium',  label: 'Medium' },
            { value: 'high',    label: 'High' }
        ];

        this.addTaskInputRef        = createRef();
        this.selectedTaskRef        = createRef();
        this.currentMonthHeadingRef = createRef();

        this.state = {
            data                : null,
            filteredTasks       : [],
            selectedTaskIdx     : null,
            deleting            : false,
            deleted             : false,
            dateRange           : typeof dateRange          !== 'undefined' ? dateRange         : 'Next 7 Days',
            startDate           : startDate                                 ? moment(startDate) : (settings ? null : moment()),
            endDate             : endDate                                   ? moment(endDate)   : (settings ? null : moment().add(6, 'days')),
            showLate            : typeof showLate           !== 'undefined' ? showLate          : true,
            showDone            : typeof showDone           !== 'undefined' ? showDone          : false,
            selectedPriority    : typeof selectedPriority   !== 'undefined' ? selectedPriority  : [],
            sortBy              : typeof sortBy             !== 'undefined' ? sortBy            : 'expires_at_asc',
            processing          : true
        };
    }
    
    render() {
        const { data, filteredTasks, selectedPriority, selectedTaskIdx, dateRange, startDate, endDate, showLate, showDone, sortBy, deleting, processing } = this.state;

        return (
            <Fragment>
                <Breadcrumb>
                    <Link to="/">My Tasklists</Link>
                    <span className="mx-2 text-muted">/</span>
                    <Breadcrumb.Item active>{data && data.name.toUpperCase()}</Breadcrumb.Item>
                </Breadcrumb>

                <div className="position-relative" style={{ zIndex: 1 }}>
                    <Sticky topOffset={150}>
                        {({ style }) => (
                            <TasklistShow.StyledPanel className="bg-light" style={style}>
                                <TaskCreate
                                    className   = "mb-2"
                                    reference   = {this.addTaskInputRef}
                                    onSetTitle  = {this.createTaskHandler.bind(this)}
                                />
                
                                <TasklistFilters
                                    tasks               = {filteredTasks}
                                    priorityValues      = {this.priorities}
                                    selectedPriority    = {selectedPriority}
                                    showLate            = {showLate}
                                    showDone            = {showDone}
                                    dateRanges          = {this.filterDateRanges}
                                    defaultDateRange    = {dateRange}
                                    startDate           = {startDate}
                                    endDate             = {endDate}
                                    sortBy              = {sortBy}
                                    sortValues          = {[
                                        { value: 'expires_at_asc',  label: 'Expires soonest'},
                                        { value: 'expires_at_desc', label: 'Expires latest' },
                                        { value: 'priority_desc',   label: 'Highest priority' },
                                        { value: 'priority_asc',    label: 'Lowest priority' }
                                    ]}
                                    className           = "border-top mb-3"
                                    onDateRangeChange   = {(label, start, end) => this.setState({ dateRange: label, startDate: start, endDate: end })}
                                    onPriorityChange    = {this.priorityChangeHandler.bind(this)} 
                                    onShowLateChange    = {() => this.setState(state => ({ showLate: !state.showLate }))}
                                    onShowDoneChange    = {() => this.setState(state => ({ showDone: !state.showDone }))}
                                    onSortByChange      = {sortBy => this.setState({ sortBy: sortBy })}
                                />

                            </TasklistShow.StyledPanel>
                        )}
                    </Sticky>                    
                </div>
                
                <TasklistShow.StyledTasks
                    className={cn('d-flex flex-column align-items-center position-relative', { 'justify-content-center': processing || !this.hasTasks() })}
                >
                    {sortBy.indexOf('expires_at') === 0 && filteredTasks.length > 0 && (
                        <div className="position-absolute" style={{ width: 0, height: '100%', left: '50%', borderLeft: '1px dotted lightgray', zIndex: -1 }}></div>
                    )}

                    {filteredTasks.map((t, idx) => (
                        <Fragment key={idx}>
                            <div style={{ textAlign: 'center' }}>
                                {idx > 0 && sortBy.indexOf('expires_at') === 0 && !moment(t.expires_at).isSame(filteredTasks[idx-1].expires_at, 'year') && (
                                    <h6 className="bg-light text-muted mt-5">
                                        {moment(filteredTasks[ sortBy.indexOf('_desc') >= 0 ? (idx - 1) : idx ].expires_at).format('YYYY')}
                                    </h6>
                                )}

                                {sortBy.indexOf('expires_at') === 0 && (!idx || !moment(t.expires_at).isSame(filteredTasks[idx-1].expires_at, 'month')) && (
                                    <h3
                                        id          = {moment().isSame(t.expires_at, 'month') ? 'currentMonthHeading' : null} 
                                        className   = "bg-light mb-4 mt-5"
                                        ref         = {moment().isSame(t.expires_at, 'month') ? this.currentMonthHeadingRef : null}
                                    >
                                        {moment(t.expires_at).format('MMMM')}
                                    </h3>
                                )}
                            </div>

                            <Task                                
                                task            = {t}
                                selected        = {selectedTaskIdx === idx}
                                onHeaderClick   = {this.onTaskHeaderClick.bind(this, idx)}
                                onDelete        = {() => this.setState({ deleting: true })}
                                onDoneChange    = {this.taskDoneChangeHandler.bind(this, idx)}
                                onUpdate        = {this.taskUpdateHandler.bind(this)}
                                reference       = {(idx === selectedTaskIdx && this.selectedTaskRef) || null}
                            />
                        </Fragment>
                    ))}

                    {!processing && filteredTasks.length === 0 && 
                        <Fragment>
                            <h3 className="mb-4">No tasks found.</h3>
                            <p>
                                Please change filter criteria or 
                                <Button 
                                    size        = "sm" 
                                    variant     = "primary" 
                                    label       = "Add New Task" 
                                    icon        = "plus" 
                                    className   = "ml-2"
                                    onClick     = {() => this.addTaskInputRef.current.focus()} 
                                />
                            </p>
                        </Fragment>
                    }

                    {processing && 
                        <Spinner />}
                </TasklistShow.StyledTasks>

                {deleting && <Modal
                    type                = "confirmDelete"
                    text                = {`You are going to delete task ${selectedTaskIdx && data.tasks[selectedTaskIdx] ? data.tasks[selectedTaskIdx].title : null}. Are you sure?`}
                    successText         = "You have successfully deleted selected task"
                    onConfirm           = {this.confirmDeleteTaskHandler.bind(this, data.tasks[selectedTaskIdx])}
                    onConfirmConfirm    = {() => this.setState({ selectedTaskIdx: null, deleting: false })}
                    onCancel            = {() => this.setState({ deleting: false })}
                />}

            </Fragment>
        );
    }

    componentDidMount() {
        this.getTasklist();
    }

    componentDidUpdate(prevProps, prevState) {
        const { startDate, endDate, selectedPriority, showLate, showDone, sortBy } = this.state;

        if (showLate            !== prevState.showLate          || 
            showDone            !== prevState.showDone          ||
            startDate           !== prevState.startDate         ||
            endDate             !== prevState.endDate           ||
            selectedPriority    !== prevState.selectedPriority
        ) {
            this.getTasklist();
        }

        if (sortBy !== prevState.sortBy) {
            this.setState(state => {
                const { data, filteredTasks } = state;
    
                this.sort(data.tasks);
                this.sort(filteredTasks);
    
                return { data: data, filteredTasks: filteredTasks };
            });    
        }

        if (sortBy.indexOf('expires_at') === 0) {
            if (this.selectedTaskRef.current) {
                this.selectedTaskRef.current.scrollIntoView(cfg.scrollOpts);
            } else if (sortBy !== prevState.sortBy) {
                this.currentMonthHeadingRef.current.scrollIntoView(cfg.scrollOpts);
            }
        }
    }

    getTasklist() {
        const { startDate, endDate, showDone, showLate, selectedPriority, sortBy } = this.state;
        
        const queryString = qs.stringify({
            startDate   : startDate && startDate.format(cfg.dateFormat),
            endDate     : endDate && endDate.format(cfg.dateFormat),
            showDone    : +showDone,
            showLate    : +showLate,
            priority    : selectedPriority.map(p => p.value),
            sortBy      : sortBy
        });

        http.get(`/tasklists/${this.tasklistId}?${queryString}`)
            .then(res => {
                this.setState({ data: res.data, filteredTasks: res.data.tasks });
            })
            .catch(err => {})
            .finally(() => this.setState({ processing: false }));
    }

    hasTasks() {
        return this.state.data && this.state.data.tasks.length > 0;
    }

    onTaskHeaderClick(taskIdx) {
        this.setState(state => ({
            selectedTaskIdx: state.selectedTaskIdx === taskIdx ? null : taskIdx
        }));
    }

    taskDoneChangeHandler(idx, task) {
        http.put(`/tasks/${task.id}`, JSON.stringify({ done: task.done }))
            .then(() => {
                this.setState(state => {
                    const { data, showDone } = state;

                    if (showDone) {
                        data.tasks[idx] = task;
                    } else {
                        data.tasks.splice(idx, 1);
                    }

                    return { data: data, selectedTaskIdx: null };
                });        
            });
    }

    confirmDeleteTaskHandler(task, idx) {
        const successCb = state => {
            const { data, selectedTaskIdx } = state;
            
            data.tasks = data.tasks.filter((t, i) => i !== selectedTaskIdx);
            
            return { selectedTaskIdx: null, data: data, filteredTasks: data.tasks };
        };

        if (task.id) {
            http.delete(`/tasks/${task.id}`)
                .then(res => {
                    this.setState(successCb);            
                })
                .catch(err => {
                    throw new Error();
                });
        } else {
            this.setState(successCb);
        }
    }

    priorityChangeHandler(selectedOpts) {
        if (selectedOpts.length === Object.values(this.priorities).length) {
            selectedOpts = [];
        }

        this.setState({ selectedPriority: selectedOpts });
    }

    createTaskHandler(taskTitle) {
        this.setState(state => {
            const { data } = state;
        
            const task = { 
                title       : taskTitle, 
                tasklist_id : this.tasklistId, 
                expires_at  : moment().format(cfg.dateFormat), 
                priority    : '', 
                notes       : '' 
            };
    
            data.tasks.unshift(task);
            
            return { data: data, filteredTasks: data.tasks, selectedTaskIdx: 0 };
        });
    }

    taskUpdateHandler(task) {
        this.setState(state => {
            const { data, selectedTaskIdx } = state;
            const tasks = data.tasks;
            
            tasks.splice(selectedTaskIdx, 1);
            tasks.unshift(task);
            this.sort(tasks);
            data.tasks = tasks;

            return { data: data, filteredTasks: data.tasks, selectedTaskIdx: tasks.findIndex(t => t.id === task.id) };
        });
    }

    sort(tasks) {
        const { sortBy } = this.state;
        const direction = sortBy.indexOf('asc') >= 0 ? 'ASC' : 'DESC';
        const fn = (sortBy.indexOf('priority') === 0 ? this.sortByPriority : this.sortByDate).bind(this, direction);
    
        tasks.sort(fn);
    }
    
    sortByPriority(direction, a, b) {
        let priorities = [].concat(this.priorities);

        if (direction === 'ASC') {
            priorities.reverse();
        }

        priorities = priorities.map(p => p.value);

        const   priorityA   = priorities.indexOf(a.priority),
                priorityB   = priorities.indexOf(b.priority);
    
        return priorityA > priorityB ? 
                    -1 : ( priorityA < priorityB ? 
                        1 : ( new Date(a.expires_at) >= new Date(b.expires_at) ? 
                            -1 : 1 ) );
    }

    sortByDate(direction, a, b) {
        const   priorities  = this.priorities.map(p => p.value),
                dateA       = new Date( direction === 'DESC' ? a.expires_at : b.expires_at ),
                dateB       = new Date( direction === 'DESC' ? b.expires_at : a.expires_at );

        return dateA > dateB ?
                    -1 : ( dateA < dateB ?
                        1 : ( priorities.indexOf(a.priority) >= priorities.indexOf(b.priority) ?
                            -1 : 1 ) )
    }
}