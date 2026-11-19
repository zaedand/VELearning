<?php

namespace App\Enums;

enum VideoStatus: string
{
    case Uploading = 'uploading';
    case Ready = 'ready';
    case Failed = 'failed';
}
