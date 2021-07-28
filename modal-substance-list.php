<!-- Add Substance Use Event Modal Dialogue -->
<div id="modal-substance-list" class="modal">
  <div class="modal-background"></div>
  <form id="form-substance-list">
  <div class="modal-card">

    <header class="modal-card-head">
      <p class="modal-card-title">Substances Used</p>
      <p class="subtitle" id="substance-list-since">Since</p>
    </header>

    <section class="modal-card-body">
      <div id="substance-list" class="content">

      <p>Please select all substances used in the past <span id="substance-list-days"></span> days.</p>

      </div>
    </section>

    <footer class="modal-card-foot">
      <button id="save-substance-list" class="button is-success is-fullwidth" type="submit">Save List</button>
    </footer>

  </div>
  </form>
  <button id="close-substance-list" class="modal-close is-large" aria-label="close"></button>
</div>