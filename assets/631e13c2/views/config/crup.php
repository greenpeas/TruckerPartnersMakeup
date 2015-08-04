<div class="panel panel-default">
    <div class="panel-heading"><?php echo Yii::t('AdvertisingModule.base', 'Create/Update banner'); ?></div>
    <div class="panel-body">
        <?php
        $form = $this->beginWidget('CActiveForm', array(
            'id' => 'banner-form',
            'enableAjaxValidation' => false,
            'htmlOptions' => array('enctype' => 'multipart/form-data'),
        ));
        ?>

        <?php echo $form->errorSummary($model); ?>

        <div class="form-group">
            <?php echo $form->labelEx($model, 'title'); ?>
            <?php echo $form->textField($model, 'title', array('class' => 'form-control')); ?>
            <?php echo $form->error($model, 'title'); ?>
        </div>
        <div class="form-group">
            <?php echo $form->labelEx($model, 'image'); ?>
            <?php echo $form->fileField($model, 'image', array('class' => 'form-control')); ?>
            <?php echo $form->error($model, 'image'); ?>
        </div>
        <div class="form-group">
            <?php echo $form->labelEx($model, 'target_url'); ?>
            <?php echo $form->textField($model, 'target_url', array('class' => 'form-control')); ?>
            <?php echo $form->error($model, 'target_url'); ?>
        </div>
        
        <div class="form-group">
            <?php echo $form->labelEx($model, 'is_active'); ?>
            <div class="form-group">
                <div class="checkbox">
                    <label>
                        <?php echo $form->checkBox($model, 'is_active'); ?> <?php echo $model->getAttributeLabel('is_active'); ?>
                    </label>
                </div>
            </div>
            <?php echo $form->error($model, 'is_active'); ?>
        </div>
        <hr>
        <?php echo CHtml::submitButton(Yii::t('AdvertisingModule.base', 'Save'), array('class' => 'btn btn-primary')); ?>
        <a class="btn btn-default" href="<?php echo $this->createUrl('//advertising/config'); ?>"><?php echo Yii::t('AdminModule.base', 'Back to config'); ?></a>
        <a class="btn btn-default" href="<?php echo $this->createUrl('//admin/module'); ?>"><?php echo Yii::t('AdminModule.base', 'Back to modules'); ?></a>
        <?php $this->endWidget(); ?>
    </div>
</div>
