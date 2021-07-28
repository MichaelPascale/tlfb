<?php

function error_handler ($sev, $msg, $file, $line) {
    echo '<h1>Server Error.</h1>';
    echo '<p>Please forward the following information to a developer.';
    echo "<pre>At line $line of $file:</pre>";
    echo "<pre>$msg</pre>";
}

function exception_handler ($e) {
  echo '<h1>Server Exception.</h1>';
  echo '<p>Please forward the following information to a developer.';
  echo '<pre>At line '.$e->getLine().' of '.$e->getFile().':</pre>';
  echo '<pre>'.$e->getMessage().'</pre>';
  echo '<pre>'.$e->getTraceAsString().'</pre>';
}

set_error_handler('error_handler');
set_exception_handler('exception_handler');

?>