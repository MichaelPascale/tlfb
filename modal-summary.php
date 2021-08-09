<!-- Timeline Summary Modal Dialogue -->
<div id="modal-summary" class="modal">
  <div class="modal-background"></div>
  <form id="form-summary">
  <div class="modal-card" style="width: 80vw;">

    <header class="modal-card-head">
      <p class="modal-card-title">Timeline Summary</p>
    </header>

    <section class="modal-card-body">
      <div class="content">
	<p><a id="summary-download">Click here to download the raw data.</a> This should be saved as a backup for all participants. Once the data has been saved, click "Submit to REDCap". Scores will be calculated upon submission.</p>
        <pre id="summary-summary"></pre>
        <table class="table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>

          <tbody>
            <tr><td>Total number of days alcohol consumed</td><td id="tlfb_etoh_total_days"></td></tr>
            <tr><td>Total number of standard drinks consumed</td><td id="tlfb_etoh_total_units"></td></tr>
            <tr><td>Average days/week alcohol consumed</td><td id="tlfb_etoh_avg_days"></td></tr>
            <tr><td>Average drinks/week of alcohol consumed</td><td id="tlfb_etoh_avg_units"></td></tr>
            <tr><td>Average drinks/drinking day</td><td id="tlfb_etoh_avg_unitsday"></td></tr>
            <tr><td>Days since last alcohol use</td><td id="tlfb_etoh_last_use"></td></tr>
            <tr><td>Total number of days cannabis consumed</td><td id="tlfb_mj_total_days"></td></tr>
            <tr><td>Total number of times cannabis consumed</td><td id="tlfb_mj_total_units"></td></tr>
            <tr><td>Average days/week cannabis consumed</td><td id="tlfb_mj_avg_days"></td></tr>
            <tr><td>Average times/week of cannabis consumed</td><td id="tlfb_mj_avg_units"></td></tr>
            <tr><td>Average times/cannabis use day</td><td id="tlfb_mj_avg_unitsday"></td></tr>
            <tr><td>Days since last cannabis use</td><td id="tlfb_mj_last_use"></td></tr>
            <tr><td>Total number of days nicotine consumed</td><td id="tlfb_nic_total_days"></td></tr>
            <tr><td>Total number of times nicotine consumed</td><td id="tlfb_nic_total_units"></td></tr>
            <tr><td>Average days/week nicotine consumed</td><td id="tlfb_nic_avg_days"></td></tr>
            <tr><td>Average times/week of nicotine consumed</td><td id="tlfb_nic_avg_units"></td></tr>
            <tr><td>Average times/nicotine use day</td><td id="tlfb_nic_avg_unitsday"></td></tr>
            <tr><td>Days since last nicotine use</td><td id="tlfb_nic_last_use"></td></tr>
          
          </tbody>

        </table>
        <p><a id="summary-download">Download Raw Data</a></p>
      </div>
    </section>

    <footer class="modal-card-foot">
      <button id="save-summary" class="button is-success is-fullwidth" type="submit">Save and Submit to REDCap</button>
    </footer>

  </div>
  </form>
  <button id="close-summary" class="modal-close is-large" aria-label="close"></button>
</div>
