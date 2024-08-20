/* modal.ts
 *
 * The Modal class handles all of the modal forms used throughout the application.
 *
 * Copyright (c) 2024, Michael Pascale <mppascale@mgh.harvard.edu>
 * Last modified: 2023-07-27
 */

export class Modal {
    private _element: HTMLElement;
    private _form: HTMLFormElement | null;
    private _onsubmit: ((data: FormData) => void) | null = null;

    public constructor(id: string) {
        const el = document.getElementById(id)

        if (el == null)
            throw Error(`Modal(): Could not locate DOM element '#${id}'.`)
        
        if (!el.classList.contains('modal'))
            throw Error(`Modal(): '#${id}' is not of class 'modal'.`)
        
        this._element = el;
        this._form = this._element.querySelector('form');
        
        // Set up event handlers.
        this._element.querySelectorAll('.modal-close, .cancel-operation').forEach(x => x.addEventListener('click', () => this.close()));
        this._form?.addEventListener('submit', (devt) => {devt.preventDefault(); this.submit(devt);});
        
    }

    public reset() {
        console.log(`Modal.reset(): ${this._element.id}`)
        this._form?.reset();
    }

    public submit(devt: SubmitEvent) {
        console.log(`Modal.submit(): ${this._element.id}`)

        if (!this._form)
            throw Error(`Modal.submit(): Cannot submit modal with no descendant form ${this._element.id}.`)

        if (!this._onsubmit)
            throw Error(`Modal.submit(): Form submitted but no handler specified.`)

        const data = this.getFormData()
        const submit_button_value = (devt.submitter as HTMLFormElement).value

        if (submit_button_value)
            data.append('action', submit_button_value)

        this._onsubmit(data)

        return this.close();
    }

    public populateForm(data: {[name: string]: string}) {
        console.log(`Modal.populateForm(): ${this._element.id}`)

        if (!this._form)
            throw Error(`Modal.populateForm(): Cannot populate modal with no descendant form ${this._element.id}.`)

        for (const key in data) {
            if (!this._form.elements.namedItem(key))
                throw Error(`Modal.populateForm(): Named element '${key}' not found in form.`);
                
            (this._form.elements.namedItem(key) as HTMLInputElement).value = data[key];
        }

        return this;
    }

    public populateText(data: { [selector: string]: string }) {
        console.log(`Modal.populateText(): ${this._element.id}`);

        for (const selector in data) {
            const element = this._element.querySelector(selector);
            if (!element) {
                throw Error(`Modal.populateText(): Element not found for '${selector}'.`);
            }
            element.innerHTML = data[selector];
        }

        return this;
    }

    public setElementClass(data: { [selector: string]: [string, boolean] }) {
        console.log(`Modal.addElementClass(): ${this._element.id}`);

        for (const selector in data) {
            const element = this._element.querySelector(selector);
            if (!element) {
                throw Error(`Modal.addElementClass(): Element not found for '${selector}'.`);
            }
            
            if (data[selector][1])
                element.classList.add(data[selector][0]);
            else
                element.classList.remove(data[selector][0]);
        }

        return this;
    }

    public getFormData() {
        console.log(`Modal.getFormData(): ${this._element.id}`)

        if (!this._form)
         throw Error(`Modal.getFormData(): Cannot get form data for modal with no descendant form ${this._element.id}.`)

        return new FormData(this._form);
    }

    public open(onsubmit: ((data: FormData) => void) | null = null) {
        console.log(`Modal.open(): ${this._element.id}`)
        this._onsubmit = onsubmit;
        this._element.classList.add('is-active');
        return this;
    }

    public close() {
        console.log(`Modal.close(): ${this._element.id}`)
        this._element.classList.remove('is-active');
        this.reset();
        return this;
    }
}
