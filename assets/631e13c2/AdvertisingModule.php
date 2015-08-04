<?php

class AdvertisingModule extends HWebModule
{
    
    private $_assetsUrl;

    public function init()
    {
        
        $this->setImport(array(
            'advertising.models.*',
            'advertising.widgets.*',
        ));
        $this->_assetsUrl = Yii::app()->getAssetManager()->publish(Yii::getPathOfAlias('application.modules.advertising'));
        
    }
    
    /**
     * Returns a url string of an ajax spinner for use when the widget starts
     * up and is waiting for the AJAX call to return.
     * 
     * @return string - the url of the ajax spinner
     */
    public static function getSpinner()
    {
//        return $this->_assetsUrl . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . 'loader.gif';
    }
    
    /**
     * On build of the TopMenu, check if module is enabled
     * When enabled add a menu item
     *
     * @param type $event
     */
    public static function onTopMenuInit($event)
    {

//        $event->sender->addItem(array(
//            'label'     => Yii::t('AdvertisingModule.base', 'News'),
//            'url'       => Yii::app()->createUrl('//rssnews/rss/index', array()),
//            'icon'      => '<i class="fa fa-rss"></i>',
//            'isActive'  => (Yii::app()->controller->module && Yii::app()->controller->module->id == 'rssnews'),
//            'sortOrder' => 300,
//        ));
    }

    public static function onLeftMenuInit($event)
    {

//        $event->sender->addItem(array(
//            'label'     => Yii::t('RssnewsModule.base', 'News'),
//            'url'       => Yii::app()->createUrl('//rssnews/rss/index', array()),
//            'icon'      => 'news-link',
//            'isActive'  => (Yii::app()->controller->module && Yii::app()->controller->module->id == 'rssnews'),
//            'sortOrder' => 300,
//        ));
    }

    public function getConfigUrl()
    {
        return Yii::app()->createUrl('//advertising/config/index');
    }
}
