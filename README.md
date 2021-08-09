# Multisubstance Online Timeline Follow-Back

The timeline follow-back is a method for retrospectively ascertaining recent alcohol and other drug use patterns developed by Linda and Mark Sobell.

## Prerequisites

Download the following libraries. Rename accordingly and place the files under `lib/`.


- `bulma-0.9.2.min.css`
- `fullcalendar-5.8.0.css`
- `fullcalendar-5.8.0.js`
- `jquery-3.6.0.min.js`
- `dayjs-1.10.6.min.js`


## Configuration

This project makes use of [composer](https://getcomposer.org/) to manage PHP dependencies. Run `composer install` to install dependencies to `vendor/`.

Create a `config.ini` in the top level directory with the following contents for each project.
```ini
[40165] # REDCAP Project ID
redcap[uri]='https://redcap.example.org/redcap/api/'
redcap[key]='Y3L1AZNBLS4TBUQLLFR5I5632M1HP5DN'
redcap[arm]=1

# The event in which to look for subject-level data.
events[screen]='screening_visit_arm_1' 

# Record of the study visit.
forms[visit]='visitstart'   
# Timeline follow-back instrument.
forms[tlfb]='tlfb_scoring_module'

# Study ID field.
fields[secondary_id]='visitstart_studyid'
# Date-of-Birth field.
fields[dob]='dob'
# Date of the study visit.
fields[start]='visitstart_starttime'
# Whether the participant showed up for the visit.
fields[show]='visitstart_ptshowed'

# The default number of days to look back.
timeline[days]=90
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

Nova Southeastern University. (n.d.). _Timeline Followback Forms and Related Materials_. NSU. Retrieved August 9, 2021, from https://www.nova.edu/gsc/forms/timeline-followback-forms.html

Robinson, S. M., Sobell, L. C., Sobell, M. B., & Leo, G. I. (2014). _Reliability of the Timeline Followback for cocaine, cannabis, and cigarette use_. Psychology of Addictive Behaviors, 28(1), 154–162. https://doi.org/10.1037/a0030992

Sobell, L. C., Brown, J., Leo, G. I., & Sobell, M. B. (1996). _The reliability of the Alcohol Timeline Followback when administered by telephone and by computer_. Drug and Alcohol Dependence, 42(1), 49–54. https://doi.org/10.1016/0376-8716(96)01263-X

Sobell, L. C., & Sobell, M. B. (1992). _Timeline Follow-Back_. In R. Z. Litten & J. P. Allen (Eds.), Measuring Alcohol Consumption: Psychosocial and Biochemical Methods (pp. 41–72). Humana Press. https://doi.org/10.1007/978-1-4612-0357-5_3


---
Source code is copyright (c) 2021, Michael Pascale and distributed under the MIT License.