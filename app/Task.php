<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Task extends Model
{
    const PRIORITY_LOW      = 'low';
    const PRIORITY_MEDIUM   = 'medium';
    const PRIORITY_HIGH     = 'high';
    
    protected $fillable = ['title', 'notes', 'expires_at', 'priority', 'done', 'tasklist_id'];
    protected $hidden = ['tasklist_id'];
    
    static public function getPriorities($desc = false) {
        $priorities = [
            Task::PRIORITY_LOW,
            Task::PRIORITY_MEDIUM,
            Task::PRIORITY_HIGH
        ];
        return $desc ? array_reverse($priorities) : $priorities;
    }
    
    public function tasklist(): BelongsTo
    {
        return $this->belongsTo(Tasklist::class);
    }
    
    public function getNotesAttribute() {
        return (string)$this->attributes['notes'];
    }
    
    public function getDoneAttribute() {
        return (bool)$this->attributes['done'];
    }
    
    public function setDoneAttribute($done) {
        $this->attributes['done'] = $done ? 1 : null;
    }
    
    public function scopeFutureOrUnfinished(Builder $q): Builder {
        return $q->where('expires_at', '>=', date('Y-m-d'))->orWhereNull('done');
    }
    
    public function scopeOrderByExpiresAt(Builder $q): Builder {
        return $q
            ->orderByRaw('CASE WHEN expires_at = DATE(NOW()) THEN 0 ELSE 1 END')
            ->orderBy('expires_at');
    }

    public function scopeOrderByPriority(Builder $q, $direction = 'asc'): Builder {
        return $q->orderByRaw(
            sprintf(
                "FIELD(priority, '%s')", 
                implode("','", Task::getPriorities($direction === 'desc'))
            )
        );
    }
}
