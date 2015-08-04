<div class="panel panel-default">
    <div class="panel-heading"><?php echo Yii::t('AdvertisingModule.base', '<strong>Advertising<strong> manage'); ?></div>
    <div class="panel-body">

        <?php
        $this->widget('zii.widgets.grid.CGridView', array(
            'dataProvider' => $ads->search(),
            'itemsCssClass' => 'table table-hover',
            'enableSorting' => false,
            'template'=>'{items}',
            'columns'      => array(
                array(
                    'header'=>'Banner',
                    'type'=>'raw',
                    'value'=>'!empty($data->file_name)?"<img src=\"".$data->banner_url."\" style=\"height:30px; width:auto;\">":"no baner"',
                ),
                'title',
                'target_url',
                array(
                    'name' => 'is_active',
                    'value' => '$data->is_active?"yes":"no"',
                ),
                array(
                    'class' => 'CButtonColumn',
                    'template' => '{update}',
                    'htmlOptions' => array('width' => '90px'),
                    'buttons' => array
                        (
                        'update' => array
                            (
                            'label' => '<i class="fa fa-pencil"></i>',
                            'imageUrl' => false,
                            'url' => 'Yii::app()->createUrl("//advertising/config/crup", array("id"=>$data->id));',
                            'options' => array(
                                'style' => 'margin-right: 3px',
                                'class' => 'btn btn-primary btn-xs',
                                'data-toggle' => 'tooltip',
                                'data-placement' => 'top',
                                'title' => '',
                                'data-original-title' => Yii::t('AdvertisingModule.views_user_index', 'Edit banner'),
                            ),
                        ),
                    ),
                ),
            ),
        ));
        ?>

    </div>
</div>


