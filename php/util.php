<?php

function find_by_property($arr, $prop, $val) {
    foreach ($arr as $obj) {
        if ($obj->$prop == $val) {
            return $obj;
        }
    }

    return false;
}

function fn_rc_validate_authkey($chr_uri, $chr_authkey) {
    $arr_data = array(
        'authkey' => $chr_authkey,
        'format' => 'json'
    );

    $session = curl_init();

    curl_setopt($session, CURLOPT_URL, $chr_uri);
    curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($session, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($session, CURLOPT_VERBOSE, 0);
    curl_setopt($session, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($session, CURLOPT_AUTOREFERER, true);
    curl_setopt($session, CURLOPT_MAXREDIRS, 10);
    curl_setopt($session, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($session, CURLOPT_FRESH_CONNECT, 1);
    curl_setopt($session, CURLOPT_POSTFIELDS, http_build_query($arr_data, '', '&'));

    $chr_out = curl_exec($session);
    curl_close($session);

    return json_decode($chr_out, true);
}

?>