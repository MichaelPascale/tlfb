<?php

function find_by_property($arr, $prop, $val) {
    foreach ($arr as $obj) {
        if ($obj->$prop == $val) {
            return $obj;
        }
    }

    return false;
}

?>