# Multisubstance Online Timeline Follow-Back

The [timeline follow-back](https://en.wikipedia.org/wiki/Timeline_Followback_Method_Assessment_(Alcohol)) is a method for retrospectively ascertaining recent alcohol and other drug use patterns developed by [Linda C. and Mark B. Sobell](#Credits). This web-based timeline form was developed for the [MGH Center for Addiction Medicine](http://www.mghaddictionmedicine.com/) and is designed for use with [REDCap](https://www.project-redcap.org/) databases in clinical research.

A major revision in Typescript was completed in 2024 by Ivy Zhu. The original application was developed by Michael Pascale.

![TLFB Application Screenshot](https://github.com/user-attachments/assets/67d3ff2f-f43f-485c-ac8a-c0b3d0f13d41)


## Prerequisites

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

## Credits

Sobell L.C., Sobell M.B. (1992) Timeline Follow-Back.

Adapted from the timeline follow-back application developed for the [Adolescent Brain Cognitive Development](https://github.com/ABCD-STUDY/timeline-followback) study. 

Made possible with [FullCalendar](https://fullcalendar.io/), [Bulma](https://bulma.io/), TypeScript and Webpack.

## References

Lisdahl, K. M., Sher, K. J., Conway, K. P., Gonzalez, R., Feldstein Ewing, S. W., Nixon, S. J., Tapert, S., Bartsch, H., Goldstein, R. Z., & Heitzeg, M. (2018). _Adolescent brain cognitive development (ABCD) study: Overview of substance use assessment methods_. Developmental Cognitive Neuroscience, 32, 80–96. https://doi.org/10.1016/j.dcn.2018.02.007

Nova Southeastern University. (n.d.). _Timeline Followback Forms and Related Materials_. NSU Guided Self-Change. Retrieved August 9, 2021, from https://www.nova.edu/gsc/forms/timeline-followback-forms.html

Robinson, S. M., Sobell, L. C., Sobell, M. B., & Leo, G. I. (2014). _Reliability of the Timeline Followback for cocaine, cannabis, and cigarette use_. Psychology of Addictive Behaviors, 28(1), 154–162. https://doi.org/10.1037/a0030992

Sobell, L. C., Brown, J., Leo, G. I., & Sobell, M. B. (1996). _The reliability of the Alcohol Timeline Followback when administered by telephone and by computer_. Drug and Alcohol Dependence, 42(1), 49–54. https://doi.org/10.1016/0376-8716(96)01263-X

Sobell, L. C., & Sobell, M. B. (1992). _Timeline Follow-Back_. In R. Z. Litten & J. P. Allen (Eds.), Measuring Alcohol Consumption: Psychosocial and Biochemical Methods (pp. 41–72). Humana Press. https://doi.org/10.1007/978-1-4612-0357-5_3


---
Source code is copyright (c) 2024, Ivy Zhu and Michael Pascale and distributed under the MIT License.
