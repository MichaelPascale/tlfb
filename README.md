# Multisubstance Online Timeline Follow-Back

The [timeline follow-back](https://en.wikipedia.org/wiki/Timeline_Followback_Method_Assessment_(Alcohol)) is a method for retrospectively ascertaining recent alcohol and other drug use patterns developed by [Linda C. and Mark B. Sobell](#Credits). This web-based timeline form has beed developed for the [MGH Center for Addiction Medicine](http://www.mghaddictionmedicine.com/) and is designed for use with [REDCap](https://www.project-redcap.org/) databases in clinical research.


## Prerequisites

Download the following libraries. Rename accordingly and place the files under `lib/`.

- `bulma-0.9.2.min.css`
- `materialdesignicons-6.5.95.min.css`
- `fullcalendar-5.8.0.css`
- `fullcalendar-5.8.0.js`
- `fullcalendar-rrule-5.8.0.js` (plugin)
- `jquery-3.6.0.min.js`
- `dayjs-1.10.6.min.js`
- `dayjs-duration-1.10.6.min.js` (plugin)
- `dayjs-customParseFormat-1.10.6.min.js` (plugin)
- `rrule-2.7.1.min.js`

A REDCap database must have scoring instrument to store the summarized results of the timeline follow-back. Upload `instrument.csv` to your database.


## Configuration

Create a `config.ini` in the top level directory with the following contents.
```ini
save=true                       # Whether to save a backup copy of data on the server.
debug=false                     # Whether to display debugging information on the calendar.

[default]                       # Default settings for when no REDCap project is specified.
name="Default Configuration"    # Project name.
days=30                         # The number of days that should be visible by default.
events[v0]="Baseline Visit"     # Map each REDCap event (e.g. v0) to a user friendly name to appear in the dropdown.

# For each REDCap Project...
[38762]                         # The REDCap PID.
name="Vaping Study"
days=90
events[v0_screening_arm_2]="Visit 0 / Screening Visit"
events[v1_baseline_arm_2]="Visit 1 / Baseline Visit"
events[v2_4wk_arm_2]="Visit 2 / 4 Weeks"
```

Also present should be a `substances.json`.


### `substances.json`

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

Sobell L.C., Sobell M.B. (1992) Timeline Follow-Back.

Adapted from the timeline follow-back application developed for the [Adolescent Brain Cognitive Development](https://github.com/ABCD-STUDY/timeline-followback) study. 

Made possible with [FullCalendar](https://fullcalendar.io/), [jQuery](https://jquery.com/), [Guzzle](https://docs.guzzlephp.org/en/stable/), [Day.js](https://day.js.org/), [Bulma](https://bulma.io/), and [Material Design Icons](https://github.com/google/material-design-icons).


## References

Lisdahl, K. M., Sher, K. J., Conway, K. P., Gonzalez, R., Feldstein Ewing, S. W., Nixon, S. J., Tapert, S., Bartsch, H., Goldstein, R. Z., & Heitzeg, M. (2018). _Adolescent brain cognitive development (ABCD) study: Overview of substance use assessment methods_. Developmental Cognitive Neuroscience, 32, 80–96. https://doi.org/10.1016/j.dcn.2018.02.007

Nova Southeastern University. (n.d.). _Timeline Followback Forms and Related Materials_. NSU Guided Self-Change. Retrieved August 9, 2021, from https://www.nova.edu/gsc/forms/timeline-followback-forms.html

Robinson, S. M., Sobell, L. C., Sobell, M. B., & Leo, G. I. (2014). _Reliability of the Timeline Followback for cocaine, cannabis, and cigarette use_. Psychology of Addictive Behaviors, 28(1), 154–162. https://doi.org/10.1037/a0030992

Sobell, L. C., Brown, J., Leo, G. I., & Sobell, M. B. (1996). _The reliability of the Alcohol Timeline Followback when administered by telephone and by computer_. Drug and Alcohol Dependence, 42(1), 49–54. https://doi.org/10.1016/0376-8716(96)01263-X

Sobell, L. C., & Sobell, M. B. (1992). _Timeline Follow-Back_. In R. Z. Litten & J. P. Allen (Eds.), Measuring Alcohol Consumption: Psychosocial and Biochemical Methods (pp. 41–72). Humana Press. https://doi.org/10.1007/978-1-4612-0357-5_3


---
Source code is copyright (c) 2021, Michael Pascale and distributed under the MIT License.