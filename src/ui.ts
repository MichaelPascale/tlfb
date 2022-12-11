/* ui.ts
 *
 * Maintained by Michael Pascale <mppascale@mgh.harvard.edu>
 * Last modified: 2022-12-09
 */

interface CustomElements {
    subject: string,
    event: string
}

function update_elements (elements: CustomElements) {

    const arr_keys = Object.keys(elements);
    for (const str_key in arr_keys) {
        switch (str_key) {
            case 'subject':
                $('#subject').text('for '.concat(elements.subject));
                break;

            case 'event':
                $('#event').text('at '.concat(elements.event));
                break;
            
            default:
                alert('update_elements(): invalid element id '.concat(str_key))
        }
    }
        
}