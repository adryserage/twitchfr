<?php
session_start();

/********** error reporting *************/
error_reporting(E_ALL);
ini_set('display_errors', 'on');

ini_set('xdebug.default_enable', 'on');
ini_set('xdebug.show_local_vars', 1);
ini_set('xdebug.var_display_max_depth', 7);
ini_set('xdebug.var_display_max_children', 256);
ini_set('xdebug.var_display_max_data', 1024);
/**************************************/


require_once __DIR__.'/Application/Controller/Autoloader.php';

use Vigas\Application\Controller\Autoloader;
use Vigas\Application\Application;

Autoloader::register();

Application::initializeApplication();
Application::setPDOconnection();
Application::getController();

