import React, { 
    Component 
}                       from 'react';
import PropTypes        from 'prop-types';

import { Formik }       from 'formik';
import * as yup         from 'yup';
import moment           from 'moment';
import Form             from 'react-bootstrap/lib/Form';

import http             from '../../services/http';
import Button           from '../common/Button';
import Input            from '../forms/Input';
import Select           from '../forms/Select';
import DateField        from '../forms/DateField';
import Submit           from '../forms/Submit';
import InputFeedback    from '../forms/InputFeedback';
import { taskSchema }   from '../../validation/forms';

const validationSchema = yup.object(taskSchema);

export default class TaskEdit extends Component {
    static propTypes = {
        task        : PropTypes.shape({
            title: PropTypes.string.isRequired
        }),
        onDelete    : PropTypes.func.isRequired,
        onUpdate    : PropTypes.func.isRequired
    };

    static defaultProps = {
        task        : null,
        onDelete    : () => {},
        onUpdate    : () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            deleting    : false,
            submitted   : false,
            submitError : null
        };
    }

    render() {
        const { task }                    = this.props;
        const { deleting, submitted, submitError }  = this.state;

        return (
            <Formik
                initialValues       = {task}
                validationSchema    = {validationSchema}
                onSubmit            = {this.onSubmit.bind(this)}
                enableReinitialize
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    setFieldTouched,
                    isSubmitting
                }) => (
                    <Form className="d-flex flex-wrap" onSubmit={handleSubmit}>
                        <div className="pr-5">
                            <DateField 
                                name        = "dueDate"
                                label       = "Due Date"
                                value       = {values.expires_at} 
                                minDate     = {moment()}
                                error       = {touched.expires_at && errors.expires_at}
                                onChange    = {val => setFieldValue('expires_at', val)}
                                onBlur      = {() => setFieldTouched('expires_at')}
                            />
                            <Select 
                                name        = "priority" 
                                label       = "Priority" 
                                value       = {values.priority}
                                values      = {['low', 'medium', 'high']}
                                error       = {touched.priority && errors.priority}
                                onChange    = {e => { handleChange(e); handleBlur(e); }}
                            />
                        </div>

                        <div>
                            <Input
                                type        = "textarea"
                                name        = "notes"
                                label       = "Notes"
                                value       = {values.notes}
                                rows        = {5}
                                cols        = {40}
                                error       = {touched.notes && errors.notes}
                                onChange    = {handleChange}
                                onBlur      = {handleBlur}
                            />
                        </div>

                        <Submit icon="save" processing={isSubmitting} disabled={Object.keys(touched).length === 0 || Object.keys(errors).length > 0}>
                            <Button
                                variant     = "danger" 
                                icon        = "trash" 
                                label       = "Delete" 
                                className   = "px-5" 
                                onClick     = {this.deleteHandler.bind(this)} 
                                processing  = {deleting}
                            />
                        </Submit>

                        {submitted && (
                            <InputFeedback 
                                valid           = {!submitError} 
                                text            = {submitError ? submitError : 'Task has been successfully saved'} 
                                setSubmitted    = {this.setSubmitted.bind(this)}
                            />
                        )}
                    </Form>                        
                )}
            </Formik>
        );
    }

    onSubmit(values, { setSubmitting }) {
        const { task, onUpdate } = this.props;

        values['tasklist_id'] = task.tasklist_id;

        let route = '/tasks';
        let method;
        if (this.props.task.id) {
            method = 'PUT';
            route += `/${this.props.task.id}`;
        } else {
            method = 'POST';
        }
        http.request(route, { method: method, data: JSON.stringify(values) })
            .then(res => {
                onUpdate(res.data);
            })
            .catch(err => {
                this.setState({ submitError: 'An error occurred.' });
            })
            .finally(() => {
                setSubmitting(false);
                this.setSubmitted(true);
            });
    }

    deleteHandler() {
        const { task, onDelete } = this.props;

        this.setState({ deleting: true });
        onDelete(task);
        this.setState({ deleting: false });
    }

    setSubmitted(submitted) {        
        const newState = submitted ? { submitted: true } : { submitted: false, submitError: null }; 

        this.setState(newState);
    }
}