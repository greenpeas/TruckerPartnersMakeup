<?php

class m150707_160000_initial extends ZDbMigration
{

    public function up()
    {
        $this->execute('DROP TABLE IF EXISTS `advertising`');
        
        $this->createTable('advertising', array(
            'id'=>'pk',
            'title'=>'varchar(250) NULL DEFAULT NULL',
            'file_name'=>'varchar(100) NULL DEFAULT NULL',
            'target_url'=>'varchar(250) NULL DEFAULT NULL',
            'is_active'=>'tinyint(1) NOT NULL DEFAULT 0',
        ));
        
        $this->insert('advertising', array('id'=>1,'title'=>null,'file_name'=>null,'target_url'=>null,'is_active'=>0));
        $this->insert('advertising', array('id'=>2,'title'=>null,'file_name'=>null,'target_url'=>null,'is_active'=>0));
        $this->insert('advertising', array('id'=>3,'title'=>null,'file_name'=>null,'target_url'=>null,'is_active'=>0));
        
    }

    public function down()
    {
        $this->execute('DROP TABLE IF EXISTS `advertising`');
    }
}
