import React, { 
    Component 
}                   from 'react';
import PropTypes    from 'prop-types';

import * as cn      from 'classnames';
import Card         from 'react-bootstrap/lib/Card';
import Form         from 'react-bootstrap/lib/Form';
import InputGroup   from 'react-bootstrap/lib/InputGroup';

export default class TaskCreate extends Component {
    static propTypes = {
        className   : PropTypes.string,
        reference   : PropTypes.object,
        onSetTitle  : PropTypes.func.isRequired
    };

    static defaultProps = {
        className   : null,
        reference   : null,
        onSetTitle  : () => {}
    };

    constructor(props) {
        super(props);

        this.state = { taskTitle: '' }
    }

    render() {
        const { onSetTitle, reference, className, ...props } = this.props;
        const { taskTitle } = this.state;

        return (
            <Card className={cn('border-0', { [className]: className })}>
                <Card.Body className="pt-2 pb-0 pb-sm-3">
                <Form onSubmit={e => e.preventDefault()}>
                    <Form.Group className="mb-0">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    <i className="fa fa-plus"></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control 
                                type        = "text" 
                                placeholder = "Add new task" 
                                minLength   = {3} 
                                maxLength   = {99} 
                                value       = {taskTitle}
                                ref         = {reference}
                                onChange    = {e => this.setState({ taskTitle: e.target.value })}
                                onKeyUp     = {this.keyUpHandler.bind(this)} 
                                {...props}
                            />
                        </InputGroup>
                    </Form.Group>
                </Form>
                </Card.Body>
            </Card>
        );
    }

    keyUpHandler(e) {
        const { onSetTitle }    = this.props;
        const { taskTitle }     = this.state;
        
        e.persist();

        if (e.keyCode === 13) {
            onSetTitle(taskTitle);
            this.setState({ taskTitle: '' });
        }
    }
}