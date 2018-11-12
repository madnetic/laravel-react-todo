import React, { 
    Component, 
    Fragment 
}                   from 'react';
import PropTypes    from 'prop-types';

import { Link }     from 'react-router-dom';
import * as cn      from 'classnames';
import Card         from 'react-bootstrap/lib/Card';

import Progress     from '../common/Progress';
import Button       from '../common/Button';

export default class Tasklist extends Component {
    static propTypes = {
        tasklist    : PropTypes.shape({
            name: PropTypes.string.isRequired
        }),
        className   : PropTypes.string,
        onDelete    : PropTypes.func.isRequired,
        onMouseOver : PropTypes.func,
        onMouseOut  : PropTypes.func
    };

    static defaultProps = {
        tasklist    : null,
        className   : null,
        onDelete    : () => {},
        onMouseOver : () => {},
        onMouseOut  : () => {}
    };

    constructor(props) {
        super(props);

        this.state = { hovered: false };
    }

    render() {
        const { className, tasklist, onDelete } = this.props;
        const { hovered }                       = this.state;

        return (
            <Card
                className   = {className}
                onMouseOver = {this.mouseOverHandler.bind(this)}
                onMouseOut  = {this.mouseOutHandler.bind(this)}
                style       = {{ minHeight: '17rem' }}
            >
                <Card.Body>
                    <Progress
                        now         = {tasklist.tasks.filter(t => t.done).length}
                        max         = {tasklist.tasks.length}
                        className   = "mb-3"
                        label       = "%now%/%max%"
                    />
                    
                    <Card.Title>{tasklist.name.toUpperCase()}</Card.Title>
                    
                    {tasklist.tasks.length > 0 ? (
                        <Fragment>
                            <ul>
                                {tasklist.tasks.slice(0, 3).map((t, idx) => 
                                    <li key={idx} className={'task' + (t.done ? ' done' : '')}>{t.title}</li>
                                )}
                            </ul>
                            {tasklist.tasks.length > 3 &&
                                <span className="text-right">... and {tasklist.tasks.length - 3} more</span>}
                        </Fragment>
                    ) : (
                        <Fragment>
                            <p>This list is empty.</p>
                            <Button variant="default" label="Add Task" icon="plus" className="btn-sm"/>
                        </Fragment>
                    )}

                    <Link to={`tasklist/${tasklist.id}`} className="position-absolute" style={{ top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}/>
                </Card.Body>
                <Card.Footer className="text-right" style={{ zIndex: 999 }}>
                    <Button 
                        variant     = "danger" 
                        icon        = "trash" 
                        className   = {cn('btn-sm', { 'btn-outline-danger': !hovered, 'btn-outline-light': hovered })} 
                        onClick     = {onDelete}
                    />
                </Card.Footer>
            </Card>
        );    
    }

    mouseOverHandler() {
        this.props.onMouseOver();
        this.setState({ hovered: true });
    }

    mouseOutHandler() {
        this.props.onMouseOut();
        this.setState({ hovered: false });
    }
}