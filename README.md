# CAM Multisubstance Timeline Followback



## Configuration

This project makes use of [composer](https://getcomposer.org/) to manage PHP dependencies. Run `composer install` to install dependencies to `vendor/`.

The application expects a `substances.json` in the top level directory. This object will have properties `category`, a list of objects with strings `id` and `label`, and `substance`, a dictionary of substance lists organized by category ID where each substance object has a string `label`, optional string array `units`, and optional string `alt`.

The application also expects a `studies.json` in the top level directory. This will be a list of objects containing the string `name`, number `days`, string array `sessions`, and the REDCap API key coressponding to the study `token`.

## Credits

Adapted from the timeline-followback application developed for the [Adolescent Brain Cognitive Development](https://github.com/ABCD-STUDY/timeline-followback) study. 


Made possible with [FullCalendar](https://fullcalendar.io/), [jQuery](https://jquery.com/), [Guzzle](https://docs.guzzlephp.org/en/stable/), [Bulma](https://bulma.io/), and [Material Design Icons](https://github.com/google/material-design-icons).