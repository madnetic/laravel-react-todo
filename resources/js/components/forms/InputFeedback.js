import React, {
    Component
}                   from 'react';

import FormControl  from 'react-bootstrap/lib/FormControl';
import FormGroup    from 'react-bootstrap/lib/FormGroup';
import FormRow      from 'react-bootstrap/lib/Row';
import FormCol      from 'react-bootstrap/lib/Col';

export default class InputFeedback extends Component {
    render() {
        const { valid, text, horizontal, setSubmitted, timeout } = this.props;

        if (setSubmitted) {
            this.setSubmittedTimeout = setTimeout(setSubmitted, timeout || 3000);
        }
    
        const feedback = <FormControl.Feedback type={valid ? 'valid' : 'invalid'} style={{ display: 'block' }}>{text}</FormControl.Feedback>
    
        return (
            <FormGroup as={horizontal && FormRow}>
                {horizontal ? (
                    <FormCol sm={{ span: 9, offset: 3 }}>
                        {feedback}             
                    </FormCol>
                ) : feedback}
            </FormGroup>
        );    
    }

    componentWillUnmount() {
        clearTimeout(this.setSubmittedTimeout);
    }
}