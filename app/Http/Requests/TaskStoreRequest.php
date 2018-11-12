<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Task;

class TaskStoreRequest extends FormRequest
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
            'title'         => 'required|string|min:3|max:99',
            'priority'      => sprintf('required|in:%s', implode(',', Task::getPriorities())),
            'notes'         => 'string|nullable|max:999',
            'expires_at'    => 'required|date_format:Y-m-d|after_or_equal:today',
            'tasklist_id'   => 'required|integer|exists:tasklists,id'
        ];
    }
}
