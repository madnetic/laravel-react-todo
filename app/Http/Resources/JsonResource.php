<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource as BaseJsonResource;

class JsonResource extends BaseJsonResource {
    public static function collection($resource)
    {
        return new AnonymousResourceCollection($resource, get_called_class());
    }
}