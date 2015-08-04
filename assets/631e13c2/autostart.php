<?php

Yii::app()->moduleManager->register(array(
    'id' => 'advertising',
    'class' => 'application.modules.advertising.AdvertisingModule',
    'import' => array(
        'application.modules.advertising.*',
    ),
    // Events to Catch 
    'events' => array(
        array('class' => 'TopMenuWidget', 'event' => 'onInit', 'callback' => array('AdvertisingModule', 'onTopMenuInit')),
        array('class' => 'LeftMenuWidget', 'event' => 'onInit', 'callback' => array('AdvertisingModule', 'onLeftMenuInit')),
    ),
));
?>