<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $table = 'driver_profiles';
    
    protected $fillable = [
        'driver_id',
        'date',
        'delays_minutes',
        'behavioral_problems',
        'violations_count',
        'accidents_count',
        'rating',
    ];
}
