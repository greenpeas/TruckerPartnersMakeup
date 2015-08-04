<?php

/**
 * Defines the configure actions.
 *
 * @package humhub.modules.birthday.controllers
 * @author Sebastian Stumpf
 */
class ConfigController extends Controller
{

    public $subLayout = "application.modules_core.admin.views._layout";

    /**
     * @return array action filters
     */
    public function filters()
    {
        return array(
            'accessControl', // perform access control for CRUD operations
        );
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules()
    {
        return array(
            array('allow',
                'expression' => 'Yii::app()->user->isAdmin()',
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    /**
     * Configuration Action for Super Admins
     */
    
    

    public function actionIndex()
    {
        $ads = new Advertising();
        $ads->unsetAttributes();
        $this->render('index', array('ads' => $ads));
    }
    
    public function actionCrup($id)
    {
        $model = Advertising::model()->findByPk($id);
        if(!$model) {
            throw new CHttpException(404,'Item not found');
        }
        
        if(isset($_POST['Advertising']))
        {
            $model->attributes=$_POST['Advertising'];
            $model->image = CUploadedFile::getInstance($model,'image');
            if($model->save())
            {
                $this->redirect(Yii::app()->createUrl('//advertising/config'));
            }
        }
        
        $this->render('crup', array('model' => $model));
    }
}

?>
