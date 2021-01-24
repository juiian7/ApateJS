

class ApateConfig {
    constructor(width, height, scale, parentHtmlElementSelector) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.parentSelector = parentHtmlElementSelector;
        this.useUI = false;
    }
}
export var apateConfig = new ApateConfig(128, 128, 4, 'body');
