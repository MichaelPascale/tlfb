<?php

$arr_config     = yaml_parse_file('config.yml');

$chr_pr_pid     = 'default';
$chr_pr_event   = null;
$chr_pr_record  = null;
$chr_pr_subject = null;
$chr_pr_start   = null;
$chr_pr_end     = null;

// REDCap Project
if(!empty($_GET['pid'])) {
  $chr_pr_pid = $_GET['pid'];
  assert(array_key_exists($chr_pr_pid, $arr_config));
}

// REDCap Event
if(!empty($_GET['event'])) {
  $chr_pr_event = $_GET['event'];
  assert(array_key_exists($chr_pr_event, $arr_config[$chr_pr_pid]['events']));
}

// REDCap Record
if(!empty($_GET['record'])) $chr_pr_record = $_GET['record'];

// Subject ID
if(!empty($_GET['subject'])) $chr_pr_subject = $_GET['subject'];

// End Date
if(!empty($_GET['end'])) $chr_pr_end = $_GET['end'];

// Start Date
if(!empty($_GET['start'])) $chr_pr_start = $_GET['start'];

?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Timeline-Followback</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/@mdi/font@6.5.95/css/materialdesignicons.min.css">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="lib/dayjs-1.10.6.min.js"></script>
    <script src="lib/dayjs-duration-1.10.6.min.js"></script>
    <script src="lib/jquery-3.6.0.min.js"></script>
    <style>
        #application {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }

        #login {
          background-color: palegoldenrod;
        }
    </style>
    <script>
      const fn_validate = function (evt) {

        const chr_subject = $('#subject').val();
        const dat_start = dayjs($('#start').val());
        const dat_end = dayjs($('#end').val());

        if (!chr_subject.match(/^[A-Z\d]{5}$/)) {
          $('#help-subject').text('Subject ID must be 5 character alphanumeric.').show();
          return false;
        } else {
          $('#help-subject').hide();
        }

        if (dat_start.isValid() && dat_end.isValid() && !dat_start.isBefore(dat_end)) {
          $('#help-date').text('Start date must be before end date.').show();
          return false;
        } else {
          $('#help-date').hide();
        }

        return true;
      }

      // Provide X days before end date.
      const fn_suggest_date = function (evt) {

        const int_days = <?php echo $arr_config[$chr_pr_pid]['days']; ?>;
        const dat_start = dayjs($('#start').val());
        const dat_end = dayjs($('#end').val());

        if (dat_end.isValid()) {
          $('#suggest-date-30').text(`30 days before ${dat_end.format('YYYY-MM-DD')} is ${dat_end.subtract(30, 'days').format('YYYY-MM-DD')}.`).show();
          $('#suggest-date-90').text(`90 days before ${dat_end.format('YYYY-MM-DD')} is ${dat_end.subtract(90, 'days').format('YYYY-MM-DD')}.`).show();

          if(dat_start.isValid())
            $('#suggest-date').text(`Start and end dates are ${dat_end.diff(dat_start, 'days')} days apart.`)
        } else {
          $('#suggest-date-30').hide();
          $('#suggest-date-90').hide();
        }
      }

      $(document).ready(function () {
        $('#login-form').submit(function(evt){
          $('#submit').attr('disabled', true);

          if (fn_validate(evt))
            return;
          
          evt.preventDefault();
          $('#submit').removeClass('is-info').addClass('is-danger');

          setTimeout(function(){
            $('#submit').attr('disabled', false).addClass('is-info').removeClass('is-danger');
          }, 100);
        }).change(fn_validate).change(fn_suggest_date);


        if ($('#end').val() == '') {
          const int_days = <?php echo $arr_config[$chr_pr_pid]['days']; ?>;
          const dat_end = dayjs().subtract(1, 'day');
          $('#end').val(dat_end.format('YYYY-MM-DD'))
          
          if ($('#start').val() == '')
            $('#start').val(dat_end.subtract(int_days, 'days').format('YYYY-MM-DD'))
        }

        fn_suggest_date();
      })


    </script>
</head>

<body>
    <div id="application">
    <div id="login" class="is-flex-grow-1 is-clipped">
        <div class="is-flex is-flex-direction-column is-justify-content-space-around is-overlay" style="position: absolute;">
            <div class="card mx-auto">
                <header class="card-header">
                    <p class="card-header-title is-justify-content-center">New Timeline Followback Session</p>
                </header>
                <div class="card-content">
                    <form id="login-form" action="/index.php" method="get">

                        <p class="has-text-centered mb-5">
                          <?php echo $arr_config[$chr_pr_pid]['name']; ?>
                        </p>

                        <!-- Subject Identifier -->
                        <div class="field">
                          <label class="label">Subject Identifier</label>
                          <div class="control has-icons-left">
                            <input
                              id="subject" name="subject"
                              class="input is-success"
                              type="text" 
                              placeholder="E2A4M"
                              required 
                              <?php if (!is_null($chr_pr_subject)) echo 'disabled value="'. $chr_pr_subject . '"'?>
                            >
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-card-account-details mdi-24px"></i>
                            </span>
                          </div>
                          <p id="help-subject" class="help is-danger" style="display: none;"></p>
                        </div>

                        <!-- Study Event -->
                        <?php if ( array_key_exists('events', $arr_config[$chr_pr_pid]) and count($arr_config[$chr_pr_pid]['events']) > 0 ) { ?>
                          <div class="field">
                            <label class="label">Study Event</label>
                            <div class="control has-icons-left">
                              <div class="select is-fullwidth">
                                <select id="event" name="event" <?php if (!is_null($chr_pr_event)) echo 'disabled'?> >
                                  <?php foreach($arr_config[$chr_pr_pid]['events'] as $opt_evtid => $opt_evtname) {
                                    if ($opt_evtid == $chr_pr_event)
                                      echo '<option selected value="' . $opt_evtid . '">' . $opt_evtname . '</option>';
                                    else
                                      echo '<option value="' . $opt_evtid . '">' . $opt_evtname . '</option>';
                                  }?>
                                </select>
                              </div>
                              <div class="icon is-small is-left">
                                <i class="mdi mdi-clipboard-list mdi-24px"></i>
                              </div>
                            </div>
                          </div>
                        <?php } ?>

                        <!-- Start Date -->
                        <div class="field">
                          <label class="label">Start Date</label>
                          <div class="control has-icons-left">
                            <input id="start" name="start" class="input is-success" type="date" required 
                              <?php if (!is_null($chr_pr_start)) echo 'value="'. $chr_pr_start . '"'?>
                            >
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-calendar-arrow-left mdi-24px"></i>
                            </span>
                          </div>
                          <p id="help-date" class="help is-danger" style="display: none;"></p>
                        </div>


                        <!-- End Date -->
                        <div class="field">
                          <label class="label">End Date</label>
                          <div class="control has-icons-left">
                            <input id="end" name="end" class="input is-success" type="date" required 
                              <?php if (!is_null($chr_pr_end)) echo 'value="'. $chr_pr_end . '"'?>
                            >
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-calendar-arrow-right mdi-24px"></i>
                            </span>
                          </div>
                          <p class="help"><b id="suggest-date"></b></p>
                          <p id="suggest-date-30" class="help"></p>
                          <p id="suggest-date-90" class="help"></p>
                        </div>

                        <!-- Staff -->
                        <div class="field">
                          <label class="label">Research Staff</label>
                          <div class="control has-icons-left">
                            <input id="staff" name="staff" class="input is-success" type="text" placeholder="Username" required>
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-bank mdi-24px"></i>
                            </span>
                          </div>
                        </div>

                        <input type="hidden" name="pid" value="<?php echo $chr_pr_pid; ?>">
                        <input type="hidden" name="record" value="<?php echo $chr_pr_record; ?>">
                    </form>
                </div>
                <footer class="card-footer">
                    <div class="card-footer-item">
                        <button id="submit" type="submit" form="login-form" class="button is-info is-fullwidth">
                            <span>Enter</span>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    </div>
    <footer class="footer p-2 mb-0">
        <div class="content has-text-centered">
            <p class="is-size-7"> For internal use only. Unauthorized access is prohibited.<br> Copyright &copy; 2022. All rights reserved. Maintained by Michael Pascale &lt;<a href="mailto:mppascale@mgh.harvard.edu">mppascale@mgh.harvard.edu</a>&gt;. Source code is MIT licensed. </p>
        </div>
    </footer>
    </div>
</body>

</html>