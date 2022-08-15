<?php 

require_once 'php/util.php';
//require_once 'auth.php';

$config = parse_ini_file('config.ini', true);

try {

    if (!$config['save'])
        throw new Exception("Save has been disabled.");

    if (empty($_POST))
         throw new Exception('No arguments provided.');

    if (count($_POST) != 2)
         throw new Exception("Project and raw data JSON are expected to be present in request." . var_dump($_POST));
    
    $chr_pid = $_POST['pid'];
    $chr_json = $_POST['json'];

    $arr_data = json_decode($chr_json, true);

    $chr_filename = 'TLFB-' .
        $arr_data['pid'] . '-' .
        $arr_data['subject'] . '-' .  
        $arr_data['event'] . '-' .
        $arr_data['start'] . '-' .
        $arr_data['end'];

    if(!preg_match('/^[\w-]+$/', $chr_filename))
        throw new Exception('Illegal filename.');
    
    $chr_path = "data/$chr_filename.json";

    if(file_exists($chr_path)) {

        echo 'File already exisits. An random string has been appended to the filename. Contact a developer if this is unintentional.';

        $chr_rand = bin2hex(random_bytes(4));
        $chr_path = str_replace('.json', "-$chr_rand.json", $chr_path);
    }

    if(!file_put_contents($chr_path, $chr_json))
        throw new Exception('Could not write to file.');


    // $redcap = new REDCapAPI($config[$chr_pid]['redcap']['uri'], $config[$chr_pid]['redcap']['key']);

    // if ($redcap->verify_form_complete($record, $event, $config[$chr_pid]['forms']['tlfb']))
    //     throw new Exception('A timeline record already exists in REDCap for the selected event. Please check the database and try again.');

    // $redcap->import($record, $event, [
    //         'tlfb_days' => $_POST['days'],

    //         'tlfb_etoh_total_days' => round($summary['tlfb_etoh_total_days'], 3),
    //         'tlfb_mj_total_days' => round($summary['tlfb_mj_total_days'], 3),
    //         'tlfb_nic_total_days' => round($summary['tlfb_nic_total_days'], 3),

    //         'tlfb_etoh_total_units' => round($summary['tlfb_etoh_total_units'], 3),
    //         'tlfb_mj_total_units' => round($summary['tlfb_mj_total_units'], 3),
    //         'tlfb_nic_total_units' => round($summary['tlfb_nic_total_units'], 3),

    //         'tlfb_etoh_avg_unitsday' => round($summary['tlfb_etoh_avg_unitsday'], 3),
    //         'tlfb_mj_avg_unitsday' => round($summary['tlfb_mj_avg_unitsday'], 3),
    //         'tlfb_nic_avg_unitsday' => round($summary['tlfb_nic_avg_unitsday'], 3),

    //         'tlfb_etoh_avg_units' => round($summary['tlfb_etoh_avg_units'], 3),
    //         'tlfb_mj_avg_units' => round($summary['tlfb_mj_avg_units'], 3),
    //         'tlfb_nic_avg_units' => round($summary['tlfb_nic_avg_units'], 3),

    //         'tlfb_etoh_avg_days' => round($summary['tlfb_etoh_avg_days'], 3),
    //         'tlfb_mj_avg_days' => round($summary['tlfb_mj_avg_days'], 3),
    //         'tlfb_nic_avg_days' => round($summary['tlfb_nic_avg_days'], 3),

    //         'tlfb_etoh_last_use' => round($summary['tlfb_etoh_last_use']),
    //         'tlfb_mj_last_use' => round($summary['tlfb_mj_last_use']),
    //         'tlfb_nic_last_use' => round($summary['tlfb_nic_last_use']),

    //         $config[$chr_pid]['fields']['signature'] ?? 'tlfb_compby' => $username,
    //         'tlfb_date' => $to,
    //         $config[$chr_pid]['forms']['tlfb'].'_complete' => 1
    // ]);

    http_response_code(200);
} catch (Exception $e) {
    echo $e->getMessage();
    http_response_code(400);
    exit();
}

?>
