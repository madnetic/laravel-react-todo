import React, { 
    Component, 
    Fragment 
}                       from 'react';
import PropTypes        from 'prop-types';

import moment           from 'moment';
import * as cn          from 'classnames';
import styled           from 'styled-components';
import Card             from 'react-bootstrap/lib/Card';
import Badge            from 'react-bootstrap/lib/Badge';

import cfg              from '../../config';
import { taskSchema }   from '../../validation/props';
import Checkbox         from '../forms/Checkbox';
import TaskEdit         from './TaskEdit';

export default class Task extends Component {
    static propTypes = {
        task            : taskSchema,
        selected        : PropTypes.bool,
        reference       : PropTypes.object,
        onDelete        : PropTypes.func.isRequired,
        onUpdate        : PropTypes.func.isRequired,
        onDoneChange    : PropTypes.func.isRequired,
    };

    static defaultProps = {
        task            : null,
        selected        : false,
        reference       : null,
        onDelete        : () => {},
        onUpdate        : () => {},
        onDoneChange    : () => {}
    };

    static StyledCard = styled(Card)`
        &.selected {
            border-top-width    : 5px;
            border-bottom-width : 5px;
            transition          : all 0.1s ease-in;
        }`;

    render() {
        const { task, selected, onDelete, onUpdate, onDoneChange, onHeaderClick, reference, ...props } = this.props;

        const today     = moment(), 
              tomorrow  = moment().add(1, 'days'),
              expiresAt = task.expires_at;

        let dueDate, isLate = false;

        if (typeof expiresAt === 'undefined') {
            dueDate = null;
        }
        else if (today.isSame(expiresAt, 'day')) {
            dueDate = 'today';
        }
        else if (tomorrow.isSame(expiresAt, 'day')) {
            dueDate = 'tomorrow';
        }
        else {
            if (today.isAfter(expiresAt)) {
                isLate = true;
            }
            dueDate = task.expires_at.format ? task.expires_at.format(cfg.dateFormat) : task.expires_at;
        }

        return (
            <Task.StyledCard className={cn('mb-1 w-100', {
                'danger'    : task.priority === 'high', 
                'warning'   : task.priority === 'medium',
                'info'      : task.priority === 'low',
                'done'      : task.done,
                'selected'  : selected
            })} {...props}>
                <Card.Body>
                    <div ref={reference} className="d-flex" onClick={onHeaderClick}>                                    
                        <div style={{ flexGrow: 1, fontWeight: selected ? 'bold' : 'normal' }}>
                            <Checkbox
                                name            = {`doneToggle${task.id}`}
                                variant         = "success" 
                                checked         = {task.done} 
                                label           = {task.title} 
                                onChange        = {this.onDoneChange.bind(this)} 
                                containerStyle  = {{ textDecoration: task.done ? 'line-through' : 'inherit' }}
                                disabled        = {!task.id}
                                inline 
                            />
                        </div>
                        <div>
                            {!task.done && isLate && 
                                <i className="fa fa-exclamation-circle text-danger mr-2"></i>}

                            {dueDate && (
                                <Badge variant={
                                    !task.done && isLate ? 
                                        'danger' : (dueDate === 'today' ? 
                                            'success' : (dueDate === 'tomorrow' 
                                                ? 'info' : 'light'))}>{dueDate}</Badge>
                            )}

                            <i className="fa fa-bars ml-3"></i>
                        </div>
                    </div>
                    {selected && (
                        <Fragment>
                            <hr />
                            <TaskEdit task={task} onDelete={onDelete} onUpdate={onUpdate} />
                        </Fragment>
                    )}
                </Card.Body>
            </Task.StyledCard>
        );
    }

    onDoneChange() {
        const task = this.props.task;
        task.done = !task.done;
        this.props.onDoneChange(task);
    }
}