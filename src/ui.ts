/* ui.ts
 *
 * Maintained by Michael Pascale <mppascale@mgh.harvard.edu>
 * Last modified: 2023-02-01
 */

function activate_mode_button(id: string | null) {
    // Mark the current mode button active by outlining it.
    document.querySelectorAll('#navbar-content button').forEach((x: Element) => {
        if (x.id == id) {
            x.classList.remove('btn-link');
            x.classList.add('btn-outline-primary');
        } else {
            x.classList.remove('btn-outline-primary');
            x.classList.add('btn-link');
        }
    });
}

function deactivate_all() {
    activate_mode_button(null);
}

function click_mode_button(evt: Event) {

    if (evt.target == null || !(evt.target instanceof Element))
        return false;

    // If the button is in a dropdown, find the main dropdown button instead.
    if (evt.target.classList.contains('dropdown-item')) {
        const button = evt.target.closest('.nav-item.dropdown')?.querySelector('button');
        
        if (button == null)
            throw new Error(`Could not find dropdown button relative to ${evt.target.id}.`);
        
        activate_mode_button(button.id);
    } else {
        activate_mode_button(evt.target.id);
    }
    
}

function modal_confirmation(title: string, body: string | NodeList = '', confirm = 'Confirm', cancel = 'Cancel'): boolean {

    const modal = new bootstrap.Modal('#confirm-danger-modal');


    set_inner('confirm-danger-title',   title);
    set_inner('confirm-danger-body',    body);
    set_inner('confirm-danger-confirm', confirm);
    set_inner('confirm-danger-cancel',  cancel);
    modal.show();
    
    return true;
}

function set_inner(id: string, text: string | NodeList) {
    const element = document.getElementById(id);
    
    if (element == null)
        throw new Error(`Failed to select element #${id}.`)

    if (text instanceof NodeList)
        text.forEach(x => element.appendChild(x));
    else
        element.innerText = text;
}

// modal_confirmation('Confirm Event Deletion', '15 calendar events will be deleted.', 'Delete Events')
