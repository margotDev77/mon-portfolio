
export default class Loader {
    constructor(divCanvasCssSelector) {
        this.divCanvas = document.querySelector(divCanvasCssSelector);
        this.loaderDiv = document.createElement("div");
        this.loaderDiv.className = "loader";
    }

    add() {
        if (this.divCanvas) {
            this.divCanvas.appendChild(this.loaderDiv);
        }
    }

    remove() {
        if (this.loaderDiv && this.loaderDiv.parentNode) {
            this.loaderDiv.parentNode.removeChild(this.loaderDiv);
        }
    }
}
