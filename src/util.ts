/* util.ts
 *
 * Miscellanous helper functions
 *
 * Copyright (c) 2023, Michael Pascale <mppascale@mgh.harvard.edu>
 * Last modified: 2023-07-27
 */

// Set the InnerText of an element.
export function set_inner(id: string, text: string | NodeList) {
    const element = document.getElementById(id);
    
    if (element == null)
        throw new Error(`Failed to select element #${id}.`)

    if (text instanceof NodeList)
        text.forEach(x => element.appendChild(x));
    else
        element.innerText = text;
}

export function find_parent_modal(el: Element) {
    const modal = el.closest('.modal');

    if (modal == null)
        throw Error(`find_parent_modal: No modal found in ancestry of ${el}.`);

    return modal;
}
