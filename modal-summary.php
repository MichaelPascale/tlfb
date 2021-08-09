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

          <!-- Initial visit -->
          <tbody>
            <tr><td>Total number of days alcohol consumed in past 90 days</td><td id="tlfb_etoh_total_days_90"></td></tr>
            <tr><td>Total number of days alcohol consumed in past 30 days</td><td id="tlfb_etoh_total_days_30"></td></tr>
            <tr><td>Total number of standard drinks consumed in past 90 days</td><td id="tlfb_etoh_total_units_90"></td></tr>
            <tr><td>Total number of standard drinks consumed in past 30 days</td><td id="tlfb_etoh_total_units_30"></td></tr>
            <tr><td>Average days/week alcohol consumed over the past 90 days</td><td id="tlfb_etoh_avg_days_90"></td></tr>
            <tr><td>Average days/week alcohol consumed over the past 30 days</td><td id="tlfb_etoh_avg_days_30"></td></tr>
            <tr><td>Average drinks/week of alcohol consumed over the past 90 days</td><td id="tlfb_etoh_avg_units_90"></td></tr>
            <tr><td>Average drinks/week of alcohol consumed over the past 30 days</td><td id="tlfb_etoh_avg_units_30"></td></tr>
            <tr><td>Average drinks/drinking day over the past 90 days</td><td id="tlfb_etoh_avg_unitsday_90"></td></tr>
            <tr><td>Average drinks/drinking day over the past 30 days</td><td id="tlfb_etoh_avg_unitsday_30"></td></tr>
            <tr><td>Days since last alcohol use</td><td id="tlfb_etoh_last_use"></td></tr>
            <tr><td>Total number of days cannabis consumed in past 90 days</td><td id="tlfb_mj_total_days_90"></td></tr>
            <tr><td>Total number of days cannabis consumed in past 30 days</td><td id="tlfb_mj_total_days_30"></td></tr>
            <tr><td>Total number of times cannabis consumed in past 90 days</td><td id="tlfb_mj_total_units_90"></td></tr>
            <tr><td>Total number of times cannabis consumed in past 30 days</td><td id="tlfb_mj_total_units_30"></td></tr>
            <tr><td>Average days/week cannabis consumed over the past 90 days</td><td id="tlfb_mj_avg_days_90"></td></tr>
            <tr><td>Average days/week cannabis consumed over the past 30 days</td><td id="tlfb_mj_avg_days_30"></td></tr>
            <tr><td>Average times/week of cannabis consumed over the past 90 days</td><td id="tlfb_mj_avg_units_90"></td></tr>
            <tr><td>Average times/week of cannabis consumed over the past 30 days</td><td id="tlfb_mj_avg_units_30"></td></tr>
            <tr><td>Average times/cannabis use day over the past 90 days</td><td id="tlfb_mj_avg_unitsday_90"></td></tr>
            <tr><td>Average times/cannabis use day over the past 30 days</td><td id="tlfb_mj_avg_unitsday_30"></td></tr>
            <tr><td>Days since last cannabis use</td><td id="tlfb_mj_last_use"></td></tr>
            <tr><td>Total number of days nicotine consumed in past 90 days</td><td id="tlfb_nic_total_days_90"></td></tr>
            <tr><td>Total number of days nicotine consumed in past 30 days</td><td id="tlfb_nic_total_days_30"></td></tr>
            <tr><td>Total number of times nicotine consumed in past 90 days</td><td id="tlfb_nic_total_units_90"></td></tr>
            <tr><td>Total number of times nicotine consumed in past 30 days</td><td id="tlfb_nic_total_units_30"></td></tr>
            <tr><td>Average days/week nicotine consumed over the past 90 days</td><td id="tlfb_nic_avg_days_90"></td></tr>
            <tr><td>Average days/week nicotine consumed over the past 30 days</td><td id="tlfb_nic_avg_days_30"></td></tr>
            <tr><td>Average times/week of nicotine consumed over the past 90 days</td><td id="tlfb_nic_avg_units_90"></td></tr>
            <tr><td>Average times/week of nicotine consumed over the past 30 days</td><td id="tlfb_nic_avg_units_30"></td></tr>
            <tr><td>Average times/nicotine use day over the past 90 days</td><td id="tlfb_nic_avg_unitsday_90"></td></tr>
            <tr><td>Average times/nicotine use day over the past 30 days</td><td id="tlfb_nic_avg_unitsday_30"></td></tr>
            <tr><td>Days since last nicotine use</td><td id="tlfb_nic_last_use"></td></tr>
            <tr><td>Total number of days stimulants consumed in past 90 days</td><td id="tlfb_stim_total_days_90"></td></tr>
            <tr><td>Total number of days stimulants consumed in past 30 days</td><td id="tlfb_stim_total_days_30"></td></tr>
            <tr><td>Total number of times stimulants consumed in past 90 days</td><td id="tlfb_stim_total_units_90"></td></tr>
            <tr><td>Total number of times stimulants consumed in past 30 days</td><td id="tlfb_stim_total_units_30"></td></tr>
            <tr><td>Average days/week stimulants consumed over the past 90 days</td><td id="tlfb_stim_avg_days_90"></td></tr>
            <tr><td>Average days/week stimulants consumed over the past 30 days</td><td id="tlfb_stim_avg_days_30"></td></tr>
            <tr><td>Average times/week of stimulants consumed over the past 90 days</td><td id="tlfb_stim_avg_units_90"></td></tr>
            <tr><td>Average times/week of stimulants consumed over the past 30 days</td><td id="tlfb_stim_avg_units_30"></td></tr>
            <tr><td>Average times/stimulant use day over the past 90 days</td><td id="tlfb_stim_avg_unitsday_90"></td></tr>
            <tr><td>Average times/stimulant use day over the past 30 days</td><td id="tlfb_stim_avg_unitsday_30"></td></tr>
            <tr><td>Days since last stimulants use</td><td id="tlfb_stim_last_use"></td></tr>
            <tr><td>Total number of days cocaine consumed in past 90 days</td><td id="tlfb_coc_total_days_90"></td></tr>
            <tr><td>Total number of days cocaine consumed in past 30 days</td><td id="tlfb_coc_total_days_30"></td></tr>
            <tr><td>Total number of times cocaine consumed in past 90 days</td><td id="tlfb_coc_total_units_90"></td></tr>
            <tr><td>Total number of times cocaine consumed in past 30 days</td><td id="tlfb_coc_total_units_30"></td></tr>
            <tr><td>Average days/week cocaine consumed over the past 90 days</td><td id="tlfb_coc_avg_days_90"></td></tr>
            <tr><td>Average days/week cocaine consumed over the past 30 days</td><td id="tlfb_coc_avg_days_30"></td></tr>
            <tr><td>Average times/week of cocaine consumed over the past 90 days</td><td id="tlfb_coc_avg_units_90"></td></tr>
            <tr><td>Average times/week of cocaine consumed over the past 30 days</td><td id="tlfb_coc_avg_units_30"></td></tr>
            <tr><td>Average times/cocaine use day over the past 90 days</td><td id="tlfb_coc_avg_unitsday_90"></td></tr>
            <tr><td>Average times/cocaine use day over the past 30 days</td><td id="tlfb_coc_avg_unitsday_30"></td></tr>
            <tr><td>Days since last cocaine use</td><td id="tlfb_coc_last_use"></td></tr>
            <tr><td>Total number of days opiates consumed in past 90 days</td><td id="tlfb_opi_total_days_90"></td></tr>
            <tr><td>Total number of days opiates consumed in past 30 days</td><td id="tlfb_opi_total_days_30"></td></tr>
            <tr><td>Total number of times opiates consumed in past 90 days</td><td id="tlfb_opi_total_units_90"></td></tr>
            <tr><td>Total number of times opiates consumed in past 30 days</td><td id="tlfb_opi_total_units_30"></td></tr>
            <tr><td>Average days/week opiates consumed over the past 90 days</td><td id="tlfb_opi_avg_days_90"></td></tr>
            <tr><td>Average days/week opiates consumed over the past 30 days</td><td id="tlfb_opi_avg_days_30"></td></tr>
            <tr><td>Average times/week of opiates consumed over the past 90 days</td><td id="tlfb_opi_avg_units_90"></td></tr>
            <tr><td>Average times/week of opiates consumed over the past 30 days</td><td id="tlfb_opi_avg_units_30"></td></tr>
            <tr><td>Average times/opiate use day over the past 90 days</td><td id="tlfb_opi_avg_unitsday_90"></td></tr>
            <tr><td>Average times/opiate use day over the past 30 days</td><td id="tlfb_opi_avg_unitsday_30"></td></tr>
            <tr><td>Days since last opiates use</td><td id="tlfb_opi_last_use"></td></tr>
            <tr><td>Total number of days hallucinogens consumed in past 90 days</td><td id="tlfb_hall_total_days_90"></td></tr>
            <tr><td>Total number of days hallucinogens consumed in past 30 days</td><td id="tlfb_hall_total_days_30"></td></tr>
            <tr><td>Total number of times hallucinogens consumed in past 90 days</td><td id="tlfb_hall_total_units_90"></td></tr>
            <tr><td>Total number of times hallucinogens consumed in past 30 days</td><td id="tlfb_hall_total_units_30"></td></tr>
            <tr><td>Average days/week hallucinogens consumed over the past 90 days</td><td id="tlfb_hall_avg_days_90"></td></tr>
            <tr><td>Average days/week hallucinogens consumed over the past 30 days</td><td id="tlfb_hall_avg_days_30"></td></tr>
            <tr><td>Average times/week of hallucinogens consumed over the past 90 days</td><td id="tlfb_hall_avg_units_90"></td></tr>
            <tr><td>Average times/week of hallucinogens consumed over the past 30 days</td><td id="tlfb_hall_avg_units_30"></td></tr>
            <tr><td>Average times/hallucinogen use day over the past 90 days</td><td id="tlfb_hall_avg_unitsday_90"></td></tr>
            <tr><td>Average times/hallucinogen use day over the past 30 days</td><td id="tlfb_hall_avg_unitsday_30"></td></tr>
            <tr><td>Days since last hallucinogens use</td><td id="tlfb_hall_last_use"></td></tr>
            <tr><td>Total number of days dissociative drugs consumed in past 90 days</td><td id="tlfb_diss_total_days_90"></td></tr>
            <tr><td>Total number of days dissociative drugs consumed in past 30 days</td><td id="tlfb_diss_total_days_30"></td></tr>
            <tr><td>Total number of times dissociative drugs consumed in past 90 days</td><td id="tlfb_diss_total_units_90"></td></tr>
            <tr><td>Total number of times dissociative drugs consumed in past 30 days</td><td id="tlfb_diss_total_units_30"></td></tr>
            <tr><td>Average days/week dissociative drugs consumed over the past 90 days</td><td id="tlfb_diss_avg_days_90"></td></tr>
            <tr><td>Average days/week dissociative drugs consumed over the past 30 days</td><td id="tlfb_diss_avg_days_30"></td></tr>
            <tr><td>Average times/week of dissociative drugs consumed over the past 90 days</td><td id="tlfb_diss_avg_units_90"></td></tr>
            <tr><td>Average times/week of dissociative drugs consumed over the past 30 days</td><td id="tlfb_diss_avg_units_30"></td></tr>
            <tr><td>Average times/dissociative drug use day over the past 90 days</td><td id="tlfb_diss_avg_unitsday_90"></td></tr>
            <tr><td>Average times/dissociative drug use day over the past 30 days</td><td id="tlfb_diss_avg_unitsday_30"></td></tr>
            <tr><td>Days since last dissociative drugs use</td><td id="tlfb_diss_last_use"></td></tr>
            <tr><td>Total number of days inhalants consumed in past 90 days</td><td id="tlfb_inh_total_days_90"></td></tr>
            <tr><td>Total number of days inhalants consumed in past 30 days</td><td id="tlfb_inh_total_days_30"></td></tr>
            <tr><td>Total number of times inhalants consumed in past 90 days</td><td id="tlfb_inh_total_units_90"></td></tr>
            <tr><td>Total number of times inhalants consumed in past 30 days</td><td id="tlfb_inh_total_units_30"></td></tr>
            <tr><td>Average days/week inhalants consumed over the past 90 days</td><td id="tlfb_inh_avg_days_90"></td></tr>
            <tr><td>Average days/week inhalants consumed over the past 30 days</td><td id="tlfb_inh_avg_days_30"></td></tr>
            <tr><td>Average times/week of inhalants consumed over the past 90 days</td><td id="tlfb_inh_avg_units_90"></td></tr>
            <tr><td>Average times/week of inhalants consumed over the past 30 days</td><td id="tlfb_inh_avg_units_30"></td></tr>
            <tr><td>Average times/inhalant use day over the past 90 days</td><td id="tlfb_inh_avg_unitsday_90"></td></tr>
            <tr><td>Average times/inhalant use day over the past 30 days</td><td id="tlfb_inh_avg_unitsday_30"></td></tr>
            <tr><td>Days since last inhalants use</td><td id="tlfb_inh_last_use"></td></tr>
            <tr><td>Total number of days sedatives, hypnotics, or anxiolytics consumed in past 90 days</td><td id="tlfb_sdh_total_days_90"></td></tr>
            <tr><td>Total number of days sedatives, hypnotics, or anxiolytics consumed in past 30 days</td><td id="tlfb_sdh_total_days_30"></td></tr>
            <tr><td>Total number of times sedatives, hypnotics, or anxiolytics consumed in past 90 days</td><td id="tlfb_sdh_total_units_90"></td></tr>
            <tr><td>Total number of times sedatives, hypnotics, or anxiolytics consumed in past 30 days</td><td id="tlfb_sdh_total_units_30"></td></tr>
            <tr><td>Average days/week sedatives, hypnotics, or anxiolytics consumed over the past 90 days</td><td id="tlfb_sdh_avg_days_90"></td></tr>
            <tr><td>Average days/week sedatives, hypnotics, or anxiolytics consumed over the past 30 days</td><td id="tlfb_sdh_avg_days_30"></td></tr>
            <tr><td>Average times/week of sedatives, hypnotics, or anxiolytics consumed over the past 90 days</td><td id="tlfb_sdh_avg_units_90"></td></tr>
            <tr><td>Average times/week of sedatives, hypnotics, or anxiolytics consumed over the past 30 days</td><td id="tlfb_sdh_avg_units_30"></td></tr>
            <tr><td>Average times/sedative, anxiolytics, hypnotics use day over the past 90 days</td><td id="tlfb_sdh_avg_unitsday_90"></td></tr>
            <tr><td>Average times/sedatives, hypnotics, anxiolytics use day over the past 30 days</td><td id="tlfb_sdh_avg_unitsday_30"></td></tr>
            <tr><td>Days since last sedatives, hypnotics, or anxiolytics use</td><td id="tlfb_sdh_last_use"></td></tr>
            <tr><td>Total number of days other drugs (not classified above) consumed in past 90 days</td><td id="tlfb_misc_total_days_90"></td></tr>
            <tr><td>Total number of days other drugs (not classified above) consumed in past 30 days</td><td id="tlfb_misc_total_days_30"></td></tr>
            <tr><td>Total number of times other drugs (not classified above) consumed in past 90 days</td><td id="tlfb_misc_total_units_90"></td></tr>
            <tr><td>Total number of times other drugs (not classified above) consumed in past 30 days</td><td id="tlfb_misc_total_units_30"></td></tr>
            <tr><td>Average days/week other drugs (not classified above) consumed over the past 90 days</td><td id="tlfb_misc_avg_days_90"></td></tr>
            <tr><td>Average days/week other drugs (not classified above) consumed over the past 30 days</td><td id="tlfb_misc_avg_days_30"></td></tr>
            <tr><td>Average times/week of other drugs (not classified above) consumed over the past 90 days</td><td id="tlfb_misc_avg_units_90"></td></tr>
            <tr><td>Average times/week of other drugs (not classified above) consumed over the past 30 days</td><td id="tlfb_misc_avg_units_30"></td></tr>
            <tr><td>Average times/miscellaneous drug use day over the past 90 days</td><td id="tlfb_misc_avg_unitsday_90"></td></tr>
            <tr><td>Average times/miscellaneous drug use day over the past 30 days</td><td id="tlfb_misc_avg_unitsday_30"></td></tr>
            <tr><td>Days since last other drugs (not classified above) use</td><td id="tlfb_misc_last_use"></td></tr>
          </tbody>
          
          <!-- Followup visits -->
          <tbody>
            <tr><td>Total number of days alcohol consumed since last visit</td><td id="tlfb_etoh_total_days_fu"></td></tr>
            <tr><td>Total number of standard drinks consumed since last visit</td><td id="tlfb_etoh_total_units_fu"></td></tr>
            <tr><td>Average days/week alcohol consumed since last visit</td><td id="tlfb_etoh_avg_days_fu"></td></tr>
            <tr><td>Average drinks/week of alcohol consumed since last visit</td><td id="tlfb_etoh_avg_units_fu"></td></tr>
            <tr><td>Average drinks/drinking day since last visit</td><td id="tlfb_etoh_avg_unitsday_fu"></td></tr>
            <tr><td>Days since last alcohol use:</td><td id="tlfb_etoh_last_use_fu"></td></tr>
            <tr><td>Total number of days cannabis consumed since last visit</td><td id="tlfb_mj_total_days_fu"></td></tr>
            <tr><td>Total number of times cannabis consumed since last visit</td><td id="tlfb_mj_total_units_fu"></td></tr>
            <tr><td>Average days/week cannabis consumed since last visit</td><td id="tlfb_mj_avg_days_fu"></td></tr>
            <tr><td>Average times/week of cannabis consumed since last visit</td><td id="tlfb_mj_avg_units_fu"></td></tr>
            <tr><td>Average times/cannabis use day since last visit</td><td id="tlfb_mj_avg_unitsday_fu"></td></tr>
            <tr><td>Days since last cannabis use:</td><td id="tlfb_mj_last_use_fu"></td></tr>
            <tr><td>Total number of days nicotine consumed since last visit</td><td id="tlfb_nic_total_days_fu"></td></tr>
            <tr><td>Total number of times nicotine consumed since last visit</td><td id="tlfb_nic_total_units_fu"></td></tr>
            <tr><td>Average days/week nicotine consumed since last visit</td><td id="tlfb_nic_avg_days_fu"></td></tr>
            <tr><td>Average times/week of nicotine consumed since last visit</td><td id="tlfb_nic_avg_units_fu"></td></tr>
            <tr><td>Average times/nicotine use day since last visit</td><td id="tlfb_nic_avg_unitsday_fu"></td></tr>
            <tr><td>Days since last nicotine use:</td><td id="tlfb_nic_last_use_fu"></td></tr>
            <tr><td>Total number of days stimulants consumed since last visit</td><td id="tlfb_stim_total_days_fu"></td></tr>
            <tr><td>Total number of times stimulants consumed since last visit</td><td id="tlfb_stim_total_units_fu"></td></tr>
            <tr><td>Average days/week stimulants consumed since last visit</td><td id="tlfb_stim_avg_days_fu"></td></tr>
            <tr><td>Average times/week of stimulants consumed since last visit</td><td id="tlfb_stim_avg_units_fu"></td></tr>
            <tr><td>Average times/stimulant use day since last visit</td><td id="tlfb_stim_avg_unitsday_fu"></td></tr>
            <tr><td>Days since last stimulants use:</td><td id="tlfb_stim_last_use_fu"></td></tr>
            <tr><td>Total number of days cocaine consumed since last visit</td><td id="tlfb_coc_total_days_fu"></td></tr>
            <tr><td>Total number of times cocaine consumed since last visit</td><td id="tlfb_coc_total_units_fu"></td></tr>
            <tr><td>Average days/week cocaine consumed since last visit</td><td id="tlfb_coc_avg_days_fu"></td></tr>
            <tr><td>Average times/week of cocaine consumed since last visit</td><td id="tlfb_coc_avg_units_fu"></td></tr>
            <tr><td>Average times/cocaine use day since last visit</td><td id="tlfb_coc_avg_unitsday_fu"></td></tr>
            <tr><td>Days since last cocaine use:</td><td id="tlfb_coc_last_use_fu"></td></tr>
            <tr><td>Total number of days opiates consumed since last visit</td><td id="tlfb_opi_total_days_fu"></td></tr>
            <tr><td>Total number of times opiates consumed since last visit</td><td id="tlfb_opi_total_units_fu"></td></tr>
            <tr><td>Average days/week opiates consumed since last visit</td><td id="tlfb_opi_avg_days_fu"></td></tr>
            <tr><td>Average times/week of opiates consumed since last visit</td><td id="tlfb_opi_avg_units_fu"></td></tr>
            <tr><td>Average times/opiate use day since last visit</td><td id="tlfb_opi_avg_unitsday_fu"></td></tr>
            <tr><td>Days since last opiates use:</td><td id="tlfb_opi_last_use_fu"></td></tr>
            <tr><td>Total number of days hallucinogens consumed since last visit</td><td id="tlfb_hall_total_days_fu"></td></tr>
            <tr><td>Total number of times hallucinogens consumed since last visit</td><td id="tlfb_hall_total_units_fu"></td></tr>
            <tr><td>Average days/week hallucinogens consumed since last visit</td><td id="tlfb_hall_avg_days_fu"></td></tr>
            <tr><td>Average times/week of hallucinogens consumed since last visit</td><td id="tlfb_hall_avg_units_fu"></td></tr>
            <tr><td>Average times/hallucinogen use day since last visit</td><td id="tlfb_hall_avg_unitsday_fu"></td></tr>
            <tr><td>Days since last hallucinogens use:</td><td id="tlfb_hall_last_use_fu"></td></tr>
            <tr><td>Total number of days dissociative drugs consumed since last visit</td><td id="tlfb_diss_total_days_fu"></td></tr>
            <tr><td>Total number of times dissociative drugs consumed since last visit</td><td id="tlfb_diss_total_units_fu"></td></tr>
            <tr><td>Average days/week dissociative drugs consumed since last visit</td><td id="tlfb_diss_avg_days_fu"></td></tr>
            <tr><td>Average times/week of dissociative drugs consumed since last visit</td><td id="tlfb_diss_avg_units_fu"></td></tr>
            <tr><td>Average times/dissociative drug use day since last visit</td><td id="tlfb_diss_avg_unitsday_fu"></td></tr>
            <tr><td>Days since last dissociative drugs use:</td><td id="tlfb_diss_last_use_fu"></td></tr>
            <tr><td>Total number of days inhalants consumed since last visit</td><td id="tlfb_inh_total_days_fu"></td></tr>
            <tr><td>Total number of times inhalants consumed since last visit</td><td id="tlfb_inh_total_units_fu"></td></tr>
            <tr><td>Average days/week inhalants consumed since last visit</td><td id="tlfb_inh_avg_days_fu"></td></tr>
            <tr><td>Average times/week of inhalants consumed since last visit</td><td id="tlfb_inh_avg_units_fu"></td></tr>
            <tr><td>Average times/inhalant use day since last visit</td><td id="tlfb_inh_avg_unitsday_fu"></td></tr>
            <tr><td>Days since last inhalants use:</td><td id="tlfb_inh_last_use_fu"></td></tr>
            <tr><td>Total number of days sedatives, hypnotics, or anxiolytics consumed since last visit</td><td id="tlfb_sdh_total_days_fu"></td></tr>
            <tr><td>Total number of times sedatives, hypnotics, or anxiolytics consumed since last visit</td><td id="tlfb_sdh_total_units_fu"></td></tr>
            <tr><td>Average days/week sedatives, hypnotics, or anxiolytics consumed since last visit</td><td id="tlfb_sdh_avg_days_fu"></td></tr>
            <tr><td>Average times/week of sedatives, hypnotics, or anxiolytics consumed since last visit</td><td id="tlfb_sdh_avg_units_fu"></td></tr>
            <tr><td>Average times/sedative, anxiolytics, hypnotics use day since last visit</td><td id="tlfb_sdh_avg_unitsday_fu"></td></tr>
            <tr><td>Days since last sedatives, hypnotics, or anxiolytics use:</td><td id="tlfb_sdh_last_use_fu"></td></tr>
            <tr><td>Total number of days other drugs (not classified above) consumed since last visit</td><td id="tlfb_misc_total_days_fu"></td></tr>
            <tr><td>Total number of times other drugs (not classified above) consumed since last visit</td><td id="tlfb_misc_total_units_fu"></td></tr>
            <tr><td>Average days/week other drugs (not classified above) consumed since last visit</td><td id="tlfb_misc_avg_days_fu"></td></tr>
            <tr><td>Average times/week of other drugs (not classified above) consumed since last visit</td><td id="tlfb_misc_avg_units_fu"></td></tr>
            <tr><td>Average times/miscellaneous drug use day since last visit</td><td id="tlfb_misc_avg_unitsday_fu"></td></tr>
            <tr><td>Days since last other drugs (not classified above) use:</td><td id="tlfb_misc_last_use_fu"></td></tr></tbody>
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
