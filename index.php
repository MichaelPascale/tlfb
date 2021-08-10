<?php

require_once 'vendor/autoload.php';
require_once 'php/util.php';
require_once 'php/errors.php';
require_once 'php/redcap.php';

$config = parse_ini_file('config.ini', true);

$pid = null;
$event = null;
$record = null;

$failed = false;
$failed_reason = '';
$warning = false;
$warning_reason = '';

$pt = null;
$event_info = null;
$record_secondary_id = null;

$date_last_visit = null;


try {
  // Check URL Parameters
  if (empty($_GET) or !isset($_GET['pid'], $_GET['event'], $_GET['record']))
    throw new Exception('This application must be accessed from within a REDCap record with the link in the application menu.');

  $pid = $_GET['pid'];
  $event = $_GET['event'];
  $record = $_GET['record'];

  // Obtain information from REDCap.
  $redcap = new REDCapAPI($config[$pid]['redcap']['uri'], $config[$pid]['redcap']['key']);

  $project_info = $redcap->request('project');
  $events = $redcap->request('event');
  $event_info = find_by_property($events, 'unique_event_name', $event);
  $tlfb_events = $redcap->get_instrument_event_map($config[$pid]['redcap']['arm'], $config[$pid]['forms']['tlfb']);

  $pt = $redcap->get_patient(
    $record,
    $config[$pid]['events']['screen'],
    [$config[$pid]['fields']['secondary_id']]
  );

  $record_secondary_id = $pt->{$config[$pid]['fields']['secondary_id']};
  if (!$record_secondary_id)
    throw new Exception('A secondary ID is not available for this record. Please check that the participant has been assigned a study ID.');

  $evt_index = array_search($event, $tlfb_events);

  if (!$redcap->verify_field($record, $event, $config[$pid]['fields']['show'], 1))
    throw new Exception('A start-of-visit form has not yet been filled or is marked as a no-show for the selected event. Please check the database and try again.');

  if ($redcap->verify_form_complete($record, $event, $config[$pid]['forms']['tlfb']))
    throw new Exception('A timeline record already exists in REDCap for the selected event. Please check the database and try again.');

  
  if ($evt_index > 0) {
    $last_visit = $redcap->request('record', [
      'records' => [$record],
      'events' => [$tlfb_events[$evt_index - 1]],
      'fields' => [$config[$pid]['fields']['tlfb_date']]
    ]);
    
    // Check that the previous event has a record. Pass the date of the last visit to the client.
    if (count($last_visit) > 0  && $last_visit[0]->{$config[$pid]['fields']['tlfb_date']}) {
      $date_last_visit = substr($last_visit[0]->{$config[$pid]['fields']['tlfb_date']}, 0, 10);
    } else {
      $warning = true;
      $warning_reason .= "There is no previous timeline record. A default calendar of {$config[$pid]['timeline']['days']} days will be used.";
    }
  }

} catch (Exception $e) {
  $failed = true;
  $failed_reason .= $e->getMessage();
}


?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Timeline Follow-Back</title>
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
    <link rel="stylesheet" href="lib/fullcalendar-5.8.0.css"/>
    <link rel="stylesheet" href="lib/bulma-0.9.2.min.css"/>
    <link rel="stylesheet" href="css/loading.css"/>
    <script src="lib/dayjs-1.10.6.min.js"></script>
    <script src="lib/dayjs-duration-1.10.6.min.js"></script>
    <script src="lib/fullcalendar-5.8.0.js"></script>
    <script src="lib/jquery-3.6.0.min.js"></script>
    <script>const EVENT_NAME = <?php echo "'$event_info->event_name';"?></script>
    <script>const SECONDARY_ID = <?php echo "'$record_secondary_id';"?></script>
    <script>const LAST_VISIT = <?php echo "'$date_last_visit';"?></script>
    <script>const DAYS = <?php echo "'{$config[$pid]['timeline']['days']}';"?></script>
    <script src="calculate.js"></script>
    <script src="index.js"></script>
  </head>
  <body>
    <section class="section">
      <article class="message is-warning <?php if (!$warning) echo 'is-hidden'?>">
        <div class="message-body">
          <p><?php echo $warning_reason?></p>
        </div>
      </article>

      <div class="level">
        <div class="level-left">
          <div class="level-item is-flex is-flex-direction-column is-align-items-start">
            <div class="is-flex is-align-items-baseline">
            <h1 class="title"><span id="days"></span>-day Timeline for <?php if (!$failed) echo "$record_secondary_id"?></h1>
            <p class="subtitle ml-2">
              at <?php if (!$failed) echo "$event_info->event_name"?> 
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
        <div class="level-right">
          <span id="time"></span>
        </div>
      </div>

      <div class="level">
        <div class="level-left">
          <button class="level-item button" id="open-substance-list">Edit Substance List</button>

          <div class="level-item field has-addons">
              <div class="control">
                <button class="button" id="mode-key-event">Add Key Dates</button>
              </div>
              <div class="control">
                <button class="button" id="mode-substance-event">Add Substance Use Events</button>
              </div>
          </div>
        </div>

        <div class="level-right">
          <button class="level-item button is-link" id="open-summary">View Summary</button>
        </div>
      </div>

      <div id="calendar"></div>
    </section>

    <p id="debug"></p>

    <?php include 'modal-login.php'; ?>
    <?php include 'modal-summary.php'; ?>
    <?php include 'modal-substance-list.php'; ?>
    <?php include 'modal-substance-event.php'; ?>
    <?php include 'modal-key-event.php'; ?>

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
