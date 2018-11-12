<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection as BaseAnonymousResourceCollection;
use Illuminate\Pagination\AbstractPaginator;

class AnonymousResourceCollection extends BaseAnonymousResourceCollection {
    public function toResponse($request)
    {
        return $this->resource instanceof AbstractPaginator
            ? (new PaginatedResourceResponse($this))->toResponse($request)
            : parent::toResponse($request);
    }    
}