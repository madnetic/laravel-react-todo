<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\PaginatedResourceResponse as BasePaginatedResourceResponse;
use Illuminate\Support\Arr;

class PaginatedResourceResponse extends BasePaginatedResourceResponse {
    protected function paginationInformation($request)
    {
        $paginated = $this->resource->resource->toArray();
        
        return [
            'meta' => $this->meta($paginated)
        ];
    }
    
    protected function meta($paginated)
    {
        return Arr::except($paginated, [
            'data',
            'first_page_url',
            'last_page_url',
            'prev_page_url',
            'next_page_url',
            'path'
        ]);
    }
}