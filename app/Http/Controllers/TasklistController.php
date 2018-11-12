<?php

namespace App\Http\Controllers;

use App\Tasklist;
use Illuminate\Http\Request;
use App\Http\Resources\TasklistResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Input;
use Carbon\Carbon;
use App\Task;
use App\Http\Requests\TasklistStoreRequest;

class TasklistController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $itemsPerPage = (int)Input::get('perPage') ?? 3;
        
        $res = Tasklist::with(['tasks' => function($q) {
            $q->select(['title', 'done', 'tasklist_id', 'expires_at'])
              ->orderByExpiresAt()
              ->orderByPriority()
              ->futureOrUnfinished();
        }])
        ->where('user_id', Auth::id())
        ->paginate($itemsPerPage);
        
        return TasklistResource::collection($res);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TasklistStoreRequest $req)
    {
        $tasklist = new Tasklist();
        $tasklist->fill([
            'name' => Input::get('name'),
            'user_id' => Auth::id()
        ]);
        $tasklist->save();        
        
        return new TasklistResource($tasklist->load('tasks'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Tasklist  $tasklist
     * @param  int $id Tasklist id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $req, int $id)
    {
        $sortBy = Input::get('sortBy');
        
        $params = [
            'startDate'     => Input::get('startDate'),
            'endDate'       => Input::get('endDate'),
            'showDone'      => Input::get('showDone'),
            'showLate'      => Input::get('showLate'),
            'priority'      => Input::get('priority'),
            'sortBy'        => $sortBy ? substr($sortBy, 0, strrpos($sortBy, '_')) : 'expires_at',
            'sortDirection' => $sortBy ? substr($sortBy, strrpos($sortBy, '_') + 1 ) : 'asc'
        ];

        return new TasklistResource(
            Tasklist::with(['tasks' => function($q) use ($params) {
                $q->where(function($q) use ($params) {
                    
                    if ($params['startDate'] || $params['endDate']) {
                        
                        $q->where(function($q) use ($params) {
                            if ($params['startDate']) {
                                if ($params['endDate']) {
                                    $q->whereBetween('expires_at', [$params['startDate'], $params['endDate']]);
                                } else {
                                    $q->where('expires_at', '>=', $params['startDate']);
                                }
                            } else {
                                $q->where('expires_at', '<=', $params['endDate']);
                            }
                            if (!$params['showDone']) {
                                $q->whereNull('done');                               
                            }
                        });
                        
                        if ($params['showLate']) {
                            $q->orWhere(function($q) {
                                $q->where('expires_at', '<', date('Y-m-d'))->whereNull('done');
                            });
                        }  
                        
                    } else {
                        if (!$params['showDone']) {
                            $q->whereNull('done');                            
                        }
                        
                        if (!$params['showLate']) {
                            $q->where('expires_at', '>=', date('Y-m-d'));
                        }
                    }
                });
                
                if ($params['priority']) {
                    $q->whereIn('priority', $params['priority']);
                }
                
                if ($params['sortBy'] === 'priority') {
                    $q->orderByPriority( $params['sortDirection'] );
                } else {
                    $q->orderBy('expires_at', $params['sortDirection']);
                }
                
            }])->find($id)
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Tasklist  $tasklist
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Tasklist $tasklist)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $id)
    {
        Tasklist::destroy($id);
    }
}
