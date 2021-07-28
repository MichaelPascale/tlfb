<?php

require_once 'vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

require_once 'php/util.php';
require_once 'php/errors.php';
require_once 'php/redcap.php';

$studies = json_decode(file_get_contents('studies.json'));

$loggedIn = FALSE;        // Whether the session has begun.
$failedLogin = FALSE;     // Whether patient authentication was unsucessful.
$visitNotStarted = FALSE; // Whether the viststart form has been completed.
$recordExists = FALSE;    // Whether the event has an existing record in REDCap.
$lastRecordNotExist = FALSE; // Whether the previous event has an existing record.

if (!empty($_POST)) {
  $std = $_POST["study"];
  $evt =  $_POST["event"];
  $sid = $_POST["participant"];
  $dob = $_POST["dob"];

  $redcap = new REDCapAPI($_ENV['REDCAP_URI_'.$std], $_ENV['REDCAP_KEY_'.$std]);
  
  $study = find_by_property($studies, 'id', $std);
  $evt_index = array_search($evt, $study->redcap_events);
  $visit_type = $evt_index == 0 ? 'screen' : 'followup';
  $dateOfLastVisit = null;

  // Authenticate the patient with ID and DOB.
  if ($redcap->verify_patient($sid, $dob)) {
    // Check that the patient has been marked as present in the visit start form.
    if ($redcap->verify_form_complete($sid, $evt, $study->forms->startofvisit, "[{$study->variables->ptshowed}]='1'")) {
      // Check that the form for this visit has not yet been completed.
      // TODO: Utilize either the followup or screen form.
      if (!$redcap->verify_form_complete($sid, $evt, $study->forms->$visit_type, '')) {
        $loggedIn = TRUE;

        if ($visit_type == 'followup') {

          $visitstart = $redcap->request('record', [
            'events' => [$study->redcap_events[$evt_index - 1]],
            'fields' => [$study->variables->starttime]
          ]);
          
          // Check that the previous event has a record. Pass the date of the last visit to the client.
          if (count($visitstart) > 0  && $visitstart[0]->{$study->variables->starttime}) {
            $dateOfLastVisit = $visitstart[0]->{$study->variables->starttime};
          } else {
            $lastRecordNotExist = TRUE;
          }

        }

      } else {
        $recordExists = TRUE;
      }
    } else {
      $visitNotStarted = TRUE;
    }
  } else {
    $failedLogin = TRUE;
  }

}

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>CAM Timeline Followback</title>
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
    <link rel="stylesheet" href="lib/fullcalendar-5.8.0.css"/>
    <link rel="stylesheet" href="lib/bulma-0.9.2.min.css"/>
    <script src="lib/dayjs-1.10.6.min.js"></script>
    <script src="lib/fullcalendar-5.8.0.js"></script>
    <script src="lib/jquery-3.6.0.min.js"></script>
    <script>var POST = <?php echo json_encode($_POST);?></script>
    <script>var LAST_VISIT = <?php echo "'$dateOfLastVisit'"?></script>
    <script src="calculate.js"></script>
    <script src="index.js"></script>
  </head>
  <body>
    <section class="section">
      <article class="message is-warning <?php if (!$lastRecordNotExist) echo 'is-hidden'?>">
        <div class="message-body">
          <p>The previous event's start-of-visit form is incomplete for this participant. A calendar of 30 days will be used instead of days since the last visit.</p>
        </div>
      </article>

      <div class="level">
        <div class="level-left">
          <h1 class="level-item title">Timeline Followback <?php if ($loggedIn) echo "for ".$sid?></h1>
          <p class="level-item subtitle">
            <span id="days"></span>&nbsp;days,&emsp;
            <span id="date-from"></span>&nbsp;to&nbsp;
            <span id="date-to"></span>&nbsp;
            (<?php if ($loggedIn) echo $visit_type ?>)
          </p>
        </div>
        <div class="level-right">
          <button class="level-item button is-info" id="open-summary">View Summary</button>
        </div>
      </div>

      <div class="level">
        <div class="level-left">
          <button class="level-item button" id="open-substance-list">Edit Substance List</button>
          <button class="level-item button" id="mode-key-event">Add Key Dates</button>
          <button class="level-item button" id="mode-substance-event">Add Substance Use Events</button>
        </div>
        <div class="level-right">
          <span id="time"></span>
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

  </body>
</html>
