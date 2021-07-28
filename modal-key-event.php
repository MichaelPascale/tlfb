<!-- Add Key Date Modal Dialogue -->
<div id="modal-key-event" class="modal">
  <div class="modal-background"></div>
  <form id="form-key-event">
  <div class="modal-card">

    <header class="modal-card-head">
      <p class="modal-card-title">Key Date</p>
      <p class="subtitle" id="key-event-date"></p>
    </header>

    <section class="modal-card-body">
      <div class="content">

        <p>A key date is any significant or memorable event which occured during the time period. Use these to jog your memory.</p>

        <div class="field">
          <label class="label">What happened on this date?</label>
          <div class="control">
            <input id="key-event-text" class="input" type="text" placeholder="e.g. friend's birthday" required>
          </div>
        </div>

      </div>
    </section>

    <footer class="modal-card-foot">
      <button id="remove-key-event" class="button is-fullwidth is-hidden">Remove from Timeline</button>
      <button id="add-key-event" class="button is-success is-fullwidth" type="submit">Add to Timeline</button>
    </footer>

  </div>
  </form>
  <button id="close-key-event" class="modal-close is-large" aria-label="close"></button>
</div>