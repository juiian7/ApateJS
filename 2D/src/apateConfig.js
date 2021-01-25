export default class ApateConfig {
    constructor(width, height, scale, parentHtmlElementSelector) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.parentSelector = parentHtmlElementSelector;
        this.useUI = false;
    }
}
