<?php
if (empty($_GET) or !isset($_GET['subject'], $_GET['event'], $_GET['start'], $_GET['end'], $_GET['staff'])) {
  $chr_query = $_SERVER['QUERY_STRING'];
  header("Location: login.php?$chr_query");
}

$arr_config     = parse_ini_file('config.ini', true);

require_once 'php/util.php';
require_once 'php/errors.php';

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>Timeline Follow-Back</title>
  <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
  <link rel="stylesheet" href="lib/fullcalendar-5.8.0.css" />
  <link rel="stylesheet" href="lib/bulma-0.9.2.min.css" />
  <link rel="stylesheet" href="css/loading.css" />
  <script src="lib/dayjs-1.10.6.min.js"></script>
  <script src="lib/dayjs-duration-1.10.6.min.js"></script>
  <script src="lib/dayjs-customParseFormat-1.10.6.min.js"></script>
  <script src="lib/fullcalendar-5.8.0.js"></script>
  <script src="lib/jquery-3.6.0.min.js"></script>
  <script>
    const EVENT_NAME = "<?php echo $_GET['event']; ?>";
    const SECONDARY_ID = "<?php echo $_GET['subject']; ?>";
    const LAST_VISIT = "<?php echo $_GET['start']; ?>";
    const DEFAULT_DAYS = "<?php echo $arr_config[$_GET['pid']]['days']; ?>";
    var DATE_FROM = dayjs("<?php echo $_GET['start']; ?>");
    var DATE_TO = dayjs("<?php echo $_GET['end']; ?>");
    var KEY_FIELD = "<?php
      if (isset($arr_config[$_GET['pid']]['keyfield']))
        echo $arr_config[$_GET['pid']]['keyfield'];
      else
        echo 'record_id';
    ?>";
    var INSTRUMENT = "<?php
      if (isset($arr_config[$_GET['pid']]['instrument']))
        echo $arr_config[$_GET['pid']]['instrument'];
      else
        echo 'tlfb';
    ?>";
    const ENABLE_SAVE = <?php echo $arr_config['save'] ? 'true' : 'false'; ?>;

  </script>
  <script src="calculate.js"></script>
  <script src="index.js"></script>
</head>

<body>
  <section class="section">
    <div class="level">
      <div class="level-left">
        <div class="level-item is-flex is-flex-direction-column is-align-items-start">
          <div class="is-flex is-align-items-baseline">
            <h1 class="title"><span id="days"></span>-day Timeline for <?php echo $_GET['subject']; ?></h1>
            <p class="subtitle ml-2">
              at <?php echo $arr_config[$_GET['pid']]['events'][$_GET['event']]; ?>
            </p>
          </div>
          <p>
            <span id="date-from"></span>&nbsp;to&nbsp;
            <span id="date-to"></span>&nbsp;
          </p>
        </div>
        <div class="level-item">

        </div>
      </div>
      <div class="level-right is-align-self-baseline">
        <span id="time"></span>
      </div>
    </div>

    <div class="level">
      <div class="level-left">

        <div class="level-item control">
          <button class=" button" id="open-substance-list">Edit Substance List</button>
        </div>


          <div class="level-item control">
            <button class="button" id="mode-key-event">Add Key Dates</button>
          </div>
          <div class="level-item control">
            <button class="button" id="mode-substance-event">Add Substance Use Events</button>
          </div>


        <div class="level-item field has-addons">
          <div class="control"><div class="button is-static">Import Data</div></div>
          <div class="control"><button class="button" id="open-upload">JSON</button></div>
          <div class="control"><button class="button" id="open-upload-csv" disabled>CSV</button></div>
        </div>

      </div>

      <div class="level-right">
        <button class="level-item button" id="open-summary">View Summary</button>
      </div>
    </div>

    <div id="calendar"></div>
  </section>

  <p id="debug"></p>

  <?php include 'modal-summary.php'; ?>
  <?php include 'modal-substance-list.php'; ?>
  <?php include 'modal-substance-event.php'; ?>
  <?php include 'modal-key-event.php'; ?>
  <?php include 'modal-upload.php'; ?>

  <div id="loading" class="modal">
    <div class="modal-background"></div>
    <div class="loading-spinner"></div>
  </div>

  <footer class="footer">
    <div class="content has-text-centered">
      <p>For internal use only. Do not access without authorization.</p>
      <p>
        Maintained by Michael Pascale <<a href="mailto:mppascale@mgh.harvard.edu">mppascale@mgh.harvard.edu</a>>. The source code is licensed
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
      </p>
    </div>
  </footer>

</body>

</html>