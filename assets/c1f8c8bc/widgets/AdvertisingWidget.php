<?php 

class AdvertisingWidget extends HWidget
{
    public $id;
    public $template = "application.modules.advertising.widgets.views.advertising_";
    
    public function run() 
    {
        if(!ModuleEnabled::model()->findByPk('advertising')) { return; }
        
        Yii::import('application.modules.advertising.models.*');
        
        $ad = Advertising::model()->findByPk($this->id,'is_active=1');
        
        if($ad) {
            $this->render($this->template.$ad->id,array('ad'=>$ad));
        }
    }
}