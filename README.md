# Multisubstance Online Timeline Follow-Back

The [timeline follow-back](https://en.wikipedia.org/wiki/Timeline_Followback_Method_Assessment_(Alcohol)) is a method for retrospectively ascertaining recent alcohol and other drug use patterns developed by [Linda C. and Mark B. Sobell](#Credits). This web-based timeline form was developed for the [MGH Center for Addiction Medicine](http://www.mghaddictionmedicine.com/) and is designed for use with [REDCap](https://www.project-redcap.org/) databases in clinical research.

A major revision in Typescript was completed in 2024 by Ivy Zhu. The original application was developed by Michael Pascale.

![TLFB Application Screenshot](https://github.com/user-attachments/assets/67d3ff2f-f43f-485c-ac8a-c0b3d0f13d41)

This software is open source and available without warranty under the terms of the MIT License, which you may find in the LICENSE file. See this [primer on open-source software](https://washu.edu/policies/guide-to-legal-and-ethical-use-of-software/) from WashU if this is not something you are familiar with.

## Prerequisites

You may run the web application on your own local machine or you will need to self host this application on a static web server. Your institution may have this capacity and may also have rules governing the use of software.

Download and copy the following libraries to the `static/` directory.

- `bulma.min.css` ([Bulma](https://bulma.io/) v0.9.4)
- `fonts/material-icons.css` ([Material Design Icons](https://pictogrammers.com/library/mdi/) v7.0.96)

You'll also need to install [Node.js](https://nodejs.org/en) which provides `npm` (Node Package Manager). You'll need this to install TypeScript and Webpack.

On MacOS, the easist way to install Node is with [`brew`](https://brew.sh/) (Homebrew). Alternatively, you can use [`nvm`](https://github.com/nvm-sh/nvm) (Node Version Manager).

```bash
brew install node@18
```

Using `npm`, we can now automatically install all the packages listed in `package.json`.

```bash
npm install
```

## Running the App

The application consists of what you see in `index.html` and the TypeScript under `src/`.

We won't be using the TypeScript compiler `tsc` directly. Instead, Webpack will compile and then bundle all of our code into a single JavaScript file under `static/tlfb-v3-bundle.js`.

### For development purposes

`webpack-dev-server` provides hot reload each time you save a TypeScript file. See the `head` of `index.html` to correct the path, then run `webpack`.

```bash
npx webpack serve
```

This will start the development server, and you should be able to open the webpage by going to`localhost:8080` in your web browser.

### To bundle for production

See the `head` of `index.html` to correct the script paths, then run `webpack`.

```bash
npx webpack
```

This will create the final bundle under `static/tlfb-v3-bundle.js`.

Simply copy `index.html` and the `static/` directory onto your production webserver.

## REDCap Compatibility

For accuracy and efficiency, the timeline followback settings can be autofilled using data from REDCap passed in the [URL query string](https://en.wikipedia.org/wiki/Query_string).

Add a Project Bookmark to the REDCap sidebar in your project settings. Using an "advanced link" will allow you to customize the fields using Smart Variables. Alternatively, you can embed a link in any form of your REDCap project. For the REDCap Event and Record ID to autofill correctly, bookmark must be clicked from within a specific record and event.

For example, your project bookmark URL might look like:
  
```
   https://your-web-server.example.com/tlfb/?record=[record-name]&pid=[project-id]&event=[event-name]&subject=[study_level_arm_1][record_subject_id]&start=[tlfb_start_date]&end=[tlfb_end_date]&keyfield=[record_id]&staff=[tlfb_compby]
```

The application accepts `record`, `pid`, `event`, `subject`, `start`, `end`, `keyfield`, and `staff` in the query string.

- `start` and `end` define the calendar date range visible for the user to fill in and should be passed in YYYY-MM-DD format. You can use calculated fields to determine the appropriate date range.
- `keyfield` is the study-specific subject identifier _field name_ (e.g. "subject_id"), if your study uses a subject identifier that is separate from the record identifier. The app collects the subject field name because this is not a standard redcap feature. `subject` is the _actual_ subject identifier (e.g. "S472"). In contrast, the REDCap Record ID (`record`) must exist in all REDCap projets.

Current versions (v3.0.0+) run entirely in client side JavaScript and do not transmit information [^1]. The downloaded CSV may be processed and, optionally, manually imported to a REDCap instrument.

If the data is to be imported into REDCap, a repeating instrument will be necessary to capture each substance use event. An example form is provided in this [REDCap Instrument ZIP](https://github.com/user-attachments/files/20190265/TimelineFollowback_2025-03-06_1446.zip). Alternatively, you may elect to use your own software to summarize the exported CSV.

## Data Export and Download

After the researcher has completed the procedure, the calendar must be downloaded from the application to be saved temporarily on the researcher's computer. Two export formats are available. Both formats include the metadata passed in via the query string (or modified in the TLFB Properties window), the application version, and the list of substance use events and key events.

### CSV Format

This tabular format include the session metadata in a header. With some modification, the CSV can be uploaded to a [REDCap repeating instrument](https://github.com/user-attachments/files/20190265/TimelineFollowback_2025-03-06_1446.zip). Alternatively, the data file may be stored separately for processing by custom software.

![CSV Format Example](https://github.com/user-attachments/assets/b4bfbfad-33c9-47fc-897a-c0b42260f26f)

### JSON Format

Data may also be exported in JSON format.

<details>
<summary>Click to expand an example of data stored in JSON format.</summary>

```jsonc
{
    "subject": "TEST_001",
    "event": "visit_4_arm_1",
    "pid": "0",
    "start": "2025-04-01",
    "end": "2025-04-30",
    "staff": "research assistant",
    "record": "1",
    "keyfield": "subject_id",
    "datetime": "2025-05-14T15:06:09.304Z",
    "appversion": "3.0.1",
    "events": [
        {
            "_eid": 1,
            "_gid": 1,
            "_title": "Smoked Cannabis 5x | 4 hits",
            "_date": "2025-04-01T00:00:00.000Z",
            "_type": "use",
            "_category": "cb",
            "_substance": "Cannabis",
            "_methodType": "Bowls",
            "_methodTypeOther": null,
            "_method": "Smoked Cannabis",
            "_methodOther": null,
            "_times": 5,
            "_amount": 4,
            "_units": "hits",
            "_unitsOther": null,
            "_note": ""
        },
        // Additional substance use events...
        {
            "_eid": 76,
            "_gid": 51,
            "_title": "Vaped Cannabis 6x | 2 hits",
            "_date": "2025-04-29T00:00:00.000Z",
            "_type": "use",
            "_category": "cb",
            "_substance": "Cannabis",
            "_methodType": "Vape pen",
            "_methodTypeOther": null,
            "_method": "Vaped Cannabis",
            "_methodOther": null,
            "_times": 6,
            "_amount": 2,
            "_units": "hits",
            "_unitsOther": null,
            "_note": ""
        }
    ]
}
```

</details>

## Credits

Sobell L.C., Sobell M.B. (1992) Timeline Follow-Back.

Adapted from the timeline follow-back application developed for the [Adolescent Brain Cognitive Development](https://github.com/ABCD-STUDY/timeline-followback) study. See also [another application by the University of Washington](https://depts.washington.edu/abrc/tlfb/calendar.cgi).

Made possible with [FullCalendar](https://fullcalendar.io/), [Bulma](https://bulma.io/), TypeScript and Webpack.

## References

Lisdahl, K. M., Sher, K. J., Conway, K. P., Gonzalez, R., Feldstein Ewing, S. W., Nixon, S. J., Tapert, S., Bartsch, H., Goldstein, R. Z., & Heitzeg, M. (2018). _Adolescent brain cognitive development (ABCD) study: Overview of substance use assessment methods_. Developmental Cognitive Neuroscience, 32, 80–96. https://doi.org/10.1016/j.dcn.2018.02.007

Nova Southeastern University. (n.d.). _Timeline Followback Forms and Related Materials_. NSU Guided Self-Change. Retrieved August 9, 2021, from https://www.nova.edu/gsc/forms/timeline-followback-forms.html

Robinson, S. M., Sobell, L. C., Sobell, M. B., & Leo, G. I. (2014). _Reliability of the Timeline Followback for cocaine, cannabis, and cigarette use_. Psychology of Addictive Behaviors, 28(1), 154–162. https://doi.org/10.1037/a0030992

Sobell, L. C., Brown, J., Leo, G. I., & Sobell, M. B. (1996). _The reliability of the Alcohol Timeline Followback when administered by telephone and by computer_. Drug and Alcohol Dependence, 42(1), 49–54. https://doi.org/10.1016/0376-8716(96)01263-X

Sobell, L. C., & Sobell, M. B. (1992). _Timeline Follow-Back_. In R. Z. Litten & J. P. Allen (Eds.), Measuring Alcohol Consumption: Psychosocial and Biochemical Methods (pp. 41–72). Humana Press. https://doi.org/10.1007/978-1-4612-0357-5_3


---
Source code is copyright (c) 2024, Ivy Zhu and Michael Pascale and distributed under the MIT License.

[^1]: Previous versions of the application used the REDCap API to load data into REDCap (See the ABCD study's PHP application) and therefore required data to be transmitted to the webserver. The current version runs in the web browser and does not store data nor transmit data to the server.
