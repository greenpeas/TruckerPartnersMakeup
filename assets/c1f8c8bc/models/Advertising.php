<?php

/**
 * This is the model class for table "advertising".
 *
 * The followings are the available columns in table 'advertising':
 * @property integer $id
 * @property string $title
 * @property string $file_name
 * @property string $target_url
 * @property integer $is_active
 */
class Advertising extends CActiveRecord {

    public $image;
    public $banner_url;
    
    const WIDGET_POS_TOP = 1;
    const WIDGET_POS_LEFT1 = 2;
    const WIDGET_POS_LEFT2 = 3;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'advertising';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('is_active', 'numerical', 'integerOnly' => true),
            array('title, target_url', 'length', 'max' => 250),
            array('file_name', 'length', 'max' => 100),
            array('title', 'safe'),
            array('image', 'file', 'types'=>'jpg, gif, png', 'allowEmpty'=>true, 'safe' => false),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, title, file_name, target_url, is_active, image', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id'          => 'ID',
            'title'       => 'Banner title',
            'target_url'  => 'Target Url',
            'is_active'   => 'Is active',
            'image'       => 'Banner image',
        );
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     *
     * Typical usecase:
     * - Initialize the model fields with values from filter form.
     * - Execute this method to get CActiveDataProvider instance which will filter
     * models according to data in model fields.
     * - Pass data provider to CGridView, CListView or any similar widget.
     *
     * @return CActiveDataProvider the data provider that can return the models
     * based on the search/filter conditions.
     */
    public function search() {
        // @todo Please modify the following code to remove attributes that should not be searched.

        $criteria = new CDbCriteria;

        $criteria->compare('id', $this->id);
        $criteria->compare('title', $this->title, true);
        $criteria->compare('target_url', $this->target_url, true);
        $criteria->compare('is_active', $this->is_active);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Advertising the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }
    
    protected function beforeValidate() {
        if(!empty($this->image)){
            $this->file_name = $this->id.'.'.$this->image->extensionName;
            if(!$this->image->saveAs($_SERVER['DOCUMENT_ROOT'].DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR.'banners'.DIRECTORY_SEPARATOR.$this->file_name)){
                $this->addError('image', 'Unable to save the image');
            }
        }
        
        return parent::beforeValidate();
    }
    
    protected function afterFind() {
        
        $this->banner_url = Yii::app()->baseUrl.'/uploads/banners/'.$this->file_name;
        
        return parent::afterFind();
    }

}
