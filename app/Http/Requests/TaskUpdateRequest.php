<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskUpdateRequest extends FormRequest
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
            'title'         => 'string|min:3|max:99',
            'priority'      => 'in:low,medium,high',
            'notes'         => 'string|nullable|max:999',
            'expires_at'    => 'date_format:Y-m-d|after_or_equal:today',
            'done'          => 'boolean'
        ];
    }
}
