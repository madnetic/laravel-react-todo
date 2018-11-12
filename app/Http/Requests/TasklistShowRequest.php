<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Task;

class TasklistShowRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'startDate' => 'date_format:Y-m-d',
            'endDate'   => 'date_format:Y-m-d|after:startDate',
            'priority'  => sprintf('in:%s', implode(',', Task::getPriorities())),
            'showDone'  => 'boolean',
            'showLate'  => 'boolean',
            'sortBy'    => 'in:expires_at_asc,expires_at_desc,priority_asc,priority_desc'
        ];
    }
}
