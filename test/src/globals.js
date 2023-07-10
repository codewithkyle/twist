class Example extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
            <h1>Example</h1>
            <p>Example text</p>
        `;
    }
}
customElements.define('example-component', Example);
