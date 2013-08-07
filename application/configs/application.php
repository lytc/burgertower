<?php

return [
    'facebook' => [
        'appId' => '282286475247846',
        'secret' => '9ccd871763a671f19bd574a26a6405a6'
    ],

    'view' => [
        'path' => $this->path . '/views',
        'layout' => 'default',
        'helpers' => [
            'javascriptTag' => [
                'assetStamp' => true
            ],
            'stylesheetTag' => [
                'assetStamp' => true
            ]
        ]
    ]
];