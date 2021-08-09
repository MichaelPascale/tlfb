<!-- Begin Session Login Modal Dialogue -->
<div id="modal-login" class="modal is-active">
  <div class="modal-background"></div>
    <div class="modal-card">

      <header class="modal-card-head">
        <p class="modal-card-title">Begin Timeline Follow-Back</p>
      </header>

      <section class="modal-card-body">
        <div class="content">
          <article id="login-error" class="message is-danger <?php if (!$failed) echo 'is-hidden'?>">
            <div class="message-body">
              <p id="login-error-message"><?php echo $failed_reason?></p>
            </div>
          </article>

          <p>To begin the session, please confirm the following information.</p>

          <table class="table">
            <thead>
              <th>Study</th>
              <th>Event</th>
              <th>Participant ID</th>
            </thead>
            <tbody>
              <tr>
                <td><?php if ($pid) echo $config[$pid]['name'] ?></td>
                <td><?php if ($event_info) echo $event_info->event_name ?></td>
                <td><?php if ($record_secondary_id) echo $record_secondary_id ?></td>
              </tr>
            </tbody>
          </table>

          <p class="mt-5">Verify the participant's date of birth and sign off with your credentials.

          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Pt DOB</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input class="input" id="login-dob" type="date" required <?php if ($failed) echo 'disabled'?>>
                </div>
                <p class="help">Participant's date of birth.</p>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Staff</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input class="input" id="login-username" type="text" placeholder="REDCap Username" required <?php if ($failed) echo 'disabled'?>>
                </div>
                <p class="help">Username of the administering research staff.</p>
              </div>
            </div>
          </div>

          <p class="mt-5">Before starting the session, close any uneccessary tabs. Do not reload or close your browser during the session. Data will not be saved until the final submit.</p>
          <p class="mt-5">Click "Start" once you have verified that the above information is correct.</p>
        </div>
      </section>
      
      <footer class="modal-card-foot">
        <button id="close-login" class="button is-link is-fullwidth" <?php if ($failed) echo 'disabled'?>>Start</button>
      </footer>

    </div>
</div>