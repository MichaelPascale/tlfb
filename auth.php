<?php 

require_once 'php/util.php';
require_once 'php/redcap.php';

$config = parse_ini_file('config.ini', true);

try {
    if (empty($_POST))
        throw new Exception('No arguments provided.');
    if (count($_POST) != 4)
        throw new Exception('Four arguments are expected.');
    
    $pid = $_POST['pid'];
    $redcap = new REDCapAPI($config[$pid]['redcap']['uri'], $config[$pid]['redcap']['key']);

    $username = $_POST['username'];
    $users = $redcap->request('user');
    if (!find_by_property($users, 'username', $username))
        throw new Exception('User is not a member of the requested REDCap repository.');
    
    $record = $_POST['record'];
    $dob = $_POST['dob'];
    if(!$redcap->verify_field($record, $config[$pid]['events']['screen'], $config[$pid]['fields']['dob'], $dob))
        throw new Exception('The patient could not be verified.');

    echo 'OK.';
    http_response_code(200);
} catch (Exception $e) {
    echo $e->getMessage();
    http_response_code(400);
}

?>
