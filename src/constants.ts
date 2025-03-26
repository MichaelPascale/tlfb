/* constants.ts
 * 
 * Defines various constants used elsewhere.
 * 
 * Copyright (c) 2024, Michael Pascale <mppascale@mgh.harvard.edu>
 * Last modified: 2025-03-26
 */

export const VERSION = '3.0.0';

// Time conversion factors.
export const CVT_MS_S = 1000;
export const CVT_S_MIN  = 60;
export const CVT_MIN_HR = 60;
export const CVT_HR_DAY = 24;
export const CVT_MS_DAY = CVT_MS_S * CVT_S_MIN * CVT_MIN_HR * CVT_HR_DAY;

// Time conversion factors accounting for DST setback.
export const CVT_HR_DAY_DST = 25;
export const CVT_MS_DAY_DST = CVT_MS_S * CVT_S_MIN * CVT_MIN_HR * CVT_HR_DAY_DST;

// The calendar height will be set to window.innerHeight - CAL_HEIGHT_DIFF.
export const CAL_HEIGHT_DIFF = 205;


export const COLOR_WHITE  = '#FFFFFF';
export const COLOR_TEXT   = '#15141A';

export const COLOR_PURPLE = '#485FC7';
export const COLOR_ORANGE = '#E67975';
export const COLOR_YELLOW = '#F7DBA7';
export const COLOR_GREEN  = '#041F1E';
export const COLOR_BROWN  = '#5A352A';

// Regular Expressions for input validation.
export const RGX_INTEGER = /^\d+$/;
export const RGX_WORD    = /^\w+$/;
export const RGX_DATE    = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
