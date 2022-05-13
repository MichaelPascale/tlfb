<?php

function error_handler ($sev, $msg, $file, $line) {
    echo '<h1>Server Error.</h1>';
    echo '<p>Please forward the following information to a developer.';
    echo "<pre>At line $line of $file:</pre>";
    echo "<pre>$msg</pre>";
}

function exception_handler ($e) {

  ob_clean();
?>
  <!DOCTYPE html>
  <html>

  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Timeline-Followback - Server Error</title>
      <link rel="stylesheet" href="lib/bulma-0.9.2.min.css"/>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  </head>

  <body>
    <section class="hero is-warning is-fullheight">
      <div class="hero-head">
          <div class="container mt-6">
              <h1 class="subtitle">
                  Timeline-Followback Application
              </h1>
          </div>
      </div>
      <div class="hero-body">
          <div class="container">
              <h1 class="title has-text-centered">
                  Server Error
              </h1>
              <p class="has-text-centered">
                <?php echo $e->getMessage(); ?>
              </p>
              <details class="mt-5 mx-7">
                  <summary class=" has-text-centered">Details</summary>
                  <p>Please forward the following information to a developer.</p>
                  <p class="mt-3">At line <?php echo $e->getLine(); ?> of <?php echo $e->getFile(); ?>...</p>
                  <p><?php echo $e->getTraceAsString(); ?></p>
              </details>
          </div>
      </div>
    </section>
  </body>

  </html>
  
<?php
  ob_end_flush();
}

set_error_handler('error_handler');
set_exception_handler('exception_handler');

?>