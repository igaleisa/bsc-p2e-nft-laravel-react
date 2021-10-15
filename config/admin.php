<?php
return [

    /*
    |--------------------------------------------------------------------------
    | Default admin user
    |--------------------------------------------------------------------------
    |
    | Default user will be created at project installation/deployment
    |
    */

    'admin_name' => env('ADMIN_NAME', ''),
    'admin_email' => env('ADMIN_EMAIL', ''),
    'admin_password' => env('ADMIN_PASSWORD', ''),
    'admin_role' => env('ADMIN_ROLE', ''),
    'web_url' => env('APP_URL', ''),
    'metadata_url' => env('MIX_UMBL_METADATA_URI', ''),
    'storage_url' => env('MIX_UMBL_STORAGE_URI', ''),
];