<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    header("Access-Control-Allow-Headers: X-Requested-With");
    
    $str = file_get_contents('../outputs/data.json');
    header('Content-Type: application/json; charset=utf-8');
    echo($str);
?>