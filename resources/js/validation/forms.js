import * as yup from 'yup';

export const getValidationErrors = (errors) => {
    return errors.inner.reduce((errors, error) => {
        return {
          ...errors,
          [error.path]: error.errors[0],
        }
    }, {});
}

export function validate(values) {
    const schema = this.getValidationSchema(values);
    
    try {
        schema.validateSync(values, { abortEarly: false });
        return {};
    } catch (err) {
        return getValidationErrors(err);
    }
}

export const emailSchema = 
    yup.string()
        .email('E-mail format is invalid.')
        .min(6, 'E-mail address is too short.')
        .max(99, 'E-mail address is too long.')
        .required('This field is required.');

export const passwordSchema = 
    yup.string()
        .min(8, 'Password is too short.')
        .max(50, 'Password is too long.')
        .required('This field is required.');

let dateMin = new Date;
dateMin.setDate(dateMin.getDate() - 1);

export const taskSchema = {
    title: yup.string()
        .min(3, 'Title is too short.')
        .max(99, 'Title is too long.')
        .required('This field is required.'),

    notes: yup.string()
        .max(999, 'Input is too long.')
        .notRequired(),

    priority: yup.string()
        .matches(/(low|medium|high)/, 'Chosen value is not allowed.')
        .required('This field is required.'),
        
    expires_at: yup.date()
        .required('This field is required.')
};
