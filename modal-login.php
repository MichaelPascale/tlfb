<!-- Begin Session Login Modal Dialogue -->
<div id="modal-login" class="modal <?php if (!$loggedIn) echo "is-active" ?>">
  <div class="modal-background"></div>
  <form method="post">
    <div class="modal-card">

      <header class="modal-card-head">
        <p class="modal-card-title">Begin Session</p>
      </header>

      <section class="modal-card-body">
        <div class="content">
          <article class="message is-danger <?php if (!$failedLogin) echo 'is-hidden'?>">
            <div class="message-body">
              <p>Failed to verify participant against information in REDCap. Please try again.</p>
            </div>
          </article>
          <article class="message is-danger <?php if (!$visitNotStarted) echo 'is-hidden'?>">
            <div class="message-body">
              <p>A start-of-visit form has not been filled or is marked as a no-show for the selected event. Please check the database and try again.</p>
            </div>
          </article>
          <article class="message is-danger <?php if (!$recordExists) echo 'is-hidden'?>">
            <div class="message-body">
              <p>A record already exists in the REDCap database for the selected event. Please check the database and try again.</p>
            </div>
          </article>

          <p>To begin the session, please confirm and authenticate with the following information.</p>

          <div class="field">
            <label class="label">Study</label>
            <div class="control">
              <div class="select">
                <select id="login-study" name="study" required>
                  <?php
                    foreach($studies as $s) echo "<option value=\"$s->id\">$s->name</option>";
                  ?>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">Event</label>
            <div class="control">
              <div class="select">
                <select id="login-redcap-event" name="event" required>

                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">Participant ID</label>
            <div class="control">
              <input class="input" id="login-participant" type="text" placeholder="MM_XXX" name="participant" required>
            </div>
          </div>

          <div class="field">
            <label class="label">Date of Birth</label>
            <div class="control">
              <input class="input" id="login-dob" type="date" name="dob" required>
            </div>
          </div>

          <p>Do not reload this tab or close your browser window during the session or changes could be lost. Close any unecessary tabs before starting the session.</p>

        </div>
      </section>
      
      <footer class="modal-card-foot">
        <button class="button is-success is-fullwidth" type="submit">Start</button>
      </footer>

    </div>
  </form>
</div>