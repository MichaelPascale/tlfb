<!-- Add Key Date Modal Dialogue -->
<div id="modal-upload" class="modal">
  <div class="modal-background"></div>
  <form id="form-upload">
  <div class="modal-card">

    <header class="modal-card-head">
      <p class="modal-card-title">Import events from a previous calendar session</p>
      <p class="subtitle" id="upload-date"></p>
    </header>

    <section class="modal-card-body">
      <div class="content">

        <p>Modify a previous timeline entry or finish a partial entry by uploading the JSON data file.</p>

        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <input id="upload-data" class="file-input" type="file" name="upload-data" accept=".json" required>
            <span class="file-cta">
              <span class="file-icon">
                <i class="mdi mdi-file-upload mdi-24px"></i>
              </span>
              <span class="file-label">
                Choose a file…
              </span>
            </span>
            <span id="filename-upload" class="file-name">
              *.json
            </span>
          </label>
        </div>
        <p class="help mx-1">Older data files may not import properly.</p>

        <pre id="upload-out" class="m-5">
   Subject: <span id="upload-out-subject"></span>
     Event: <span id="upload-out-event"></span>

     Start: <span id="upload-out-start"></span>
       End: <span id="upload-out-end"></span>

  # Events: <span id="upload-out-events"></span>

  Earliest: <span id="upload-out-earliest"></span>
    Latest: <span id="upload-out-latest"></span>

Substances: <span id="upload-out-substances"></span>
        </pre>

      </div>
    </section>

    <footer class="modal-card-foot">
      <button id="add-upload" class="button is-success is-fullwidth" type="submit" disabled>Import Events</button>
    </footer>

  </div>
  </form>
  <button id="close-upload" class="modal-close is-large" aria-label="close"></button>
</div>