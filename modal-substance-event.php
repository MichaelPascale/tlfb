<!-- Add Substance Use Event Modal Dialogue -->
<div id="modal-substance-event" class="modal">
  <div class="modal-background"></div>
  <form id="form-substance-event">
  <div class="modal-card">

    <header class="modal-card-head">
      <p class="modal-card-title">Substance Use Event</p>
      <p id="substance-event-date">Date</p>
    </header>

    <section class="modal-card-body">
      <div class="content">

        <div class="field is-grouped">
          <div class="control">
            <label class="label">Substance</label>
            <div class="select">
              <select id="substance-event-substance" required>
                <option>Alcohol</option>
              </select>
            </div>
          </div>

          <div class="control">
            <label class="label">No. Times Used on This Date</label>
            <input id="substance-event-occasions" class="input" type="number" min="1" max="500" step="1" value="0" required>
          </div>
        </div>

        <div id="substance-event-amount-section" class="field is-grouped">
          <div class="control">
            <label class="label">Average Amount Used Each Time</label>
            <input id="substance-event-amount" class="input" type="number" min="0" max="1000000" step="any" value="0.00">
          </div>
          <div class="control">
            <label class="label">Units</label>
            <div class="select">
              <select id="substance-event-units">
                <option>mg</option>
              </select>
            </div>
          </div>
          <div class="control">
            <label class="label">Units (Other)</label>
            <input id="substance-event-units-other" class="input" type="text" disabled>
          </div>
        </div>

        <div id="substance-event-other-section" class="field">
          <div class="control">
            <label class="label">Notes</label>
            <input id="substance-event-notes" class="input" type="text">
          </div>
        </div>

        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" id="substance-event-recurring"> Recurring Event
            </label>
          </div>
        </div>

        <div id="substance-event-recurring-section" class="field is-grouped">
          <div class="control">
            <label class="label">Days on Which to Repeat</label>
            <select id="substance-event-recur-on" multiple>
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
          </div>
          <div class="control">
            <label class="label">Repeat Until</label>
            <input id="substance-event-recur-until" class="input" type="date">
          </div>
        </div>





      </div>
    </section>

    <footer class="modal-card-foot">
      <button id="remove-substance-event" class="button is-fullwidth is-hidden">Remove from Timeline</button>
      <button id="add-substance-event" class="button is-success is-fullwidth" type="submit">Add to Timeline</button>
    </footer>

  </div>
  </form>
  <button id="close-substance-event" class="modal-close is-large" aria-label="close"></button>
</div>