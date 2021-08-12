<?php 

require_once 'php/util.php';
require_once 'php/redcap.php';
require_once 'auth.php';

$config = parse_ini_file('config.ini', true);

try {
    // throw new Exception('An error prevented the last save attempt. Please try again.');

    // if (empty($_POST))
    //     throw new Exception('No arguments provided.');
    // if (count($_POST) != 4)
    //     throw new Exception('Four arguments are expected.');
    
    $pid = $_POST['pid'];
    $event = $_POST['event'];
    $record = $_POST['record'];

    $username = $_POST['username'];
    $secondary = $_POST['secondary'];

    $from = $_POST['from'];
    $to = $_POST['to'];

    $raw = $_POST['raw'];
    $summary = $_POST['summary'];


    $filename = "$secondary-$record-$event-$to";
    if(!preg_match('/^[\w-]+$/', $filename))
        throw new Exception('Illegal filename.');
    
    $filename = "data/$filename.json";
    // if(file_exists($filename))
    //     throw new Exception('File exists.');

    if(!file_put_contents($filename, $raw))
        throw new Exception('Could not write to file.');


    $redcap = new REDCapAPI($config[$pid]['redcap']['uri'], $config[$pid]['redcap']['key']);

    if ($redcap->verify_form_complete($record, $event, $config[$pid]['forms']['tlfb']))
        throw new Exception('A timeline record already exists in REDCap for the selected event. Please check the database and try again.');

    $redcap->import($record, $event, [
            'tlfb_days' => $_POST['days'],

            'tlfb_etoh_total_days' => $summary['tlfb_etoh_total_days'],
            'tlfb_mj_total_days' => $summary['tlfb_mj_total_days'],
            'tlfb_nic_total_days' => $summary['tlfb_nic_total_days'],

            'tlfb_etoh_total_units' => $summary['tlfb_etoh_total_units'],
            'tlfb_mj_total_units' => $summary['tlfb_mj_total_units'],
            'tlfb_nic_total_units' => $summary['tlfb_nic_total_units'],

            'tlfb_etoh_avg_unitsday' => $summary['tlfb_etoh_avg_unitsday'],
            'tlfb_mj_avg_unitsday' => $summary['tlfb_mj_avg_unitsday'],
            'tlfb_nic_avg_unitsday' => $summary['tlfb_nic_avg_unitsday'],

            'tlfb_etoh_avg_units' => $summary['tlfb_etoh_avg_units'],
            'tlfb_mj_avg_units' => $summary['tlfb_mj_avg_units'],
            'tlfb_nic_avg_units' => $summary['tlfb_nic_avg_units'],

            'tlfb_etoh_avg_days' => $summary['tlfb_etoh_avg_days'],
            'tlfb_mj_avg_days' => $summary['tlfb_mj_avg_days'],
            'tlfb_nic_avg_days' => $summary['tlfb_nic_avg_days'],

            'tlfb_etoh_last_use' => $summary['tlfb_etoh_last_use'],
            'tlfb_mj_last_use' => $summary['tlfb_mj_last_use'],
            'tlfb_nic_last_use' => $summary['tlfb_nic_last_use'],

            'tlfb_compby' => $username,
            'tlfb_date' => $to,
            $config[$pid]['forms']['tlfb'].'_complete' => 1
    ]);

    http_response_code(200);
} catch (Exception $e) {
    echo $e->getMessage();
    http_response_code(400);
    exit();
}

?>
