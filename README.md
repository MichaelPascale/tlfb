# Multisubstance Timeline Followback


## Configuration

This project makes use of [composer](https://getcomposer.org/) to manage PHP dependencies. Run `composer install` to install dependencies to `vendor/`.

Create a `config.ini` in the top level directory with the following contents for each project.
```ini
[40165] # REDCAP Project ID
redcap_uri='https://redcap.example.org/redcap/api/'
redcap_key='Y3L1AZNBLS4TBUQLLFR5I5632M1HP5DN'
redcap_event_screen='screening_visit_arm_1'
redcap_secondary_id='studyid'
```

Also present should be a `studies.json` and `substances.json`.

## `studies.json`

```jsonc
{
    "40165": {
        "name": "Study Name (to Display)",
       // List of events at which the form will be administered. 
        "redcap_events": [
            "visit1_baseline_arm_1",
            "visit2_2wk_arm_1",
            "visit3_4wk_arm_1",
            "visit4_6wk_arm_1",
            "visit5_8wk_arm_1",
        ],
        // Default number of days back to look at each event.
        "days": [90, 30, 30, 30, 30],
        "forms": {
            // Visit start instrument.
            "startofvisit": "visitstart",
            // Instrument to which screen scores will be saved.
            "screen": "tlfb_screen_scoring",
            // Instrument to which followup scores will be saved.
            "followup": "tlfb_followup_scoring"
        },
        "variables": {
            // Visit date and time.
            "starttime": "visitstart_starttime",
            // Did the patient show up to the visit?
            "ptshowed": "visitstart_ptshow"
        }
    }
}
```

## `substances.json`

```jsonc
{
    "category": [
        {
            "id": "Category ID",
            "label": "Category Name"
        }
    ],
    "substance": {
        "Category ID": [
            {
                "label": "Substance Name",
                "alt": "Alternative Names",
                "units": [
                    "Unit labels, e.g. 'mg'"
                ],
                "notes": "Prompt to display in the notes field"

            }
        ]
    }
}

```
## Credits

Adapted from the timeline-followback application developed for the [Adolescent Brain Cognitive Development](https://github.com/ABCD-STUDY/timeline-followback) study. 


Made possible with [FullCalendar](https://fullcalendar.io/), [jQuery](https://jquery.com/), [Guzzle](https://docs.guzzlephp.org/en/stable/), [Day.js](https://day.js.org/), [Bulma](https://bulma.io/), and [Material Design Icons](https://github.com/google/material-design-icons).

---
Copyright (c) 2021, Michael Pascale. All rights reserved.