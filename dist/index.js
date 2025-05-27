var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-chat/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.customButtonStyle = exports.customHoverStyle = exports.spinnerStyle = exports.customLinkStyle = exports.messageStyle = exports.imageStyle = exports.storageModalStyle = exports.messagePanelStyle = void 0;
    exports.messagePanelStyle = components_1.Styles.style({
        $nest: {
            '> *:first-child': {
                marginTop: 'auto'
            }
        }
    });
    exports.storageModalStyle = components_1.Styles.style({
        $nest: {
            '.modal > div:nth-child(2)': {
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            },
            'i-scom-storage': {
                display: 'block',
                width: '100%',
                height: 'calc(100% - 1.5rem)',
                overflow: 'hidden'
            }
        }
    });
    exports.imageStyle = components_1.Styles.style({
        transform: 'translateY(-100%)',
        $nest: {
            '&>img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
            }
        }
    });
    exports.messageStyle = components_1.Styles.style({
        $nest: {
            '> i-scom-markdown-editor:first-child .toastui-editor-contents p': {
                marginBlockStart: 0
            },
            '> i-scom-markdown-editor:last-child .toastui-editor-contents p': {
                marginBlockEnd: 0
            },
            '> i-label + i-scom-markdown-editor .toastui-editor-contents p': {
                marginBlockStart: 0
            }
        }
    });
    exports.customLinkStyle = components_1.Styles.style({
        $nest: {
            'i-link': {
                display: `inline !important`,
            },
            'img': {
                maxWidth: '100%'
            }
        }
    });
    const anim = components_1.Styles.keyframes({
        '0%, 80%, 100%': {
            transform: 'scale(1)',
            opacity: 0.5
        },
        '40%': {
            transform: 'scale(1.25)',
            opacity: 1
        }
    });
    exports.spinnerStyle = components_1.Styles.style({
        $nest: {
            '.typing i-icon': {
                animation: `${anim} 1.5s infinite`,
                margin: '0 2px'
            },
            '.typing i-icon:nth-child(1)': {
                animationDelay: '0s'
            },
            '.typing i-icon:nth-child(2)': {
                animationDelay: '0.2s'
            },
            '.typing i-icon:nth-child(3)': {
                animationDelay: '0.4s'
            }
        }
    });
    exports.customHoverStyle = components_1.Styles.style({
        $nest: {
            '&:hover > i-icon:first-child': {
                display: 'none'
            },
            '&:hover > i-icon:nth-child(2)': {
                display: 'block !important'
            }
        }
    });
    exports.customButtonStyle = components_1.Styles.style({
        $nest: {
            '> span': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                display: 'block'
            }
        }
    });
});
define("@scom/scom-chat/components/loadingSpinner.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoadingSpinner = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    let LoadingSpinner = class LoadingSpinner extends components_2.Module {
        init() {
            super.init();
        }
        setProperties(value) {
            this.pnlLoadingSpinner.height = value.height || '100%';
            this.pnlLoadingSpinner.top = value.top || 0;
            this.pnlLoadingSpinner.minHeight = value.minHeight == null ? 200 : value.minHeight;
            this.pnlLoadingSpinner.style.background = value.background || Theme.background.default;
            this.pnlLoadingSpinner.zIndex = value.zIndex || 899;
        }
        render() {
            return (this.$render("i-vstack", { id: "pnlLoadingSpinner", width: "100%", minHeight: 200, position: "absolute", bottom: 0, zIndex: 899, background: { color: Theme.background.main }, class: "i-loading-overlay", mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            height: 'calc(100% - 3.125rem)',
                            top: 0
                        }
                    }
                ] },
                this.$render("i-vstack", { horizontalAlignment: "center", verticalAlignment: "center", position: "absolute", top: "calc(50% - 0.75rem)", left: "calc(50% - 0.75rem)" },
                    this.$render("i-icon", { class: "i-loading-spinner_icon", name: "spinner", width: 24, height: 24, fill: Theme.colors.primary.main }))));
        }
    };
    LoadingSpinner = __decorate([
        (0, components_2.customElements)('i-scom-chat--loading-spinner')
    ], LoadingSpinner);
    exports.LoadingSpinner = LoadingSpinner;
});
define("@scom/scom-chat/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MediaType = void 0;
    var MediaType;
    (function (MediaType) {
        MediaType["Image"] = "image";
        MediaType["Video"] = "video";
    })(MediaType = exports.MediaType || (exports.MediaType = {}));
});
define("@scom/scom-chat/utils.ts", ["require", "exports", "@ijstech/components", "@scom/scom-chat/index.css.ts"], function (require, exports, components_3, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createContexts = exports.constructMessage = exports.groupMessage = exports.createLabelElements = exports.getEmbedElement = exports.getMessageTime = exports.getPublicIndexingRelay = exports.getUserProfile = exports.isDevEnv = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    function isDevEnv() {
        return components_3.application.store.env === 'dev';
    }
    exports.isDevEnv = isDevEnv;
    function getUserProfile() {
        return components_3.application.store.userProfile;
    }
    exports.getUserProfile = getUserProfile;
    function getPublicIndexingRelay() {
        return components_3.application.store.publicIndexingRelay;
    }
    exports.getPublicIndexingRelay = getPublicIndexingRelay;
    function getMessageTime(time) {
        const targetDate = components_3.moment.unix(time);
        const currentDate = (0, components_3.moment)(new Date());
        if (targetDate.year() < currentDate.year()) {
            return targetDate.format("DD MMM YYYY, hh:mm A");
        }
        if (targetDate.month() < currentDate.month() || targetDate.date() < currentDate.date()) {
            return targetDate.format("DD MMM, hh:mm A");
        }
        return targetDate.format("hh:mm A");
    }
    exports.getMessageTime = getMessageTime;
    function getThemeValues(theme) {
        if (!theme || typeof theme !== 'object')
            return null;
        let values = {};
        for (let prop in theme) {
            if (theme[prop])
                values[prop] = theme[prop];
        }
        return Object.keys(values).length ? values : null;
    }
    async function getEmbedElement(postData, parent, callback) {
        const { module, data } = postData;
        const elm = await components_3.application.createElement(module, true);
        if (!elm)
            throw new Error('not found');
        elm.parent = parent;
        if (elm.ready)
            await elm.ready();
        const builderTarget = elm.getConfigurators ? elm.getConfigurators().find((conf) => conf.target === 'Builders' || conf.target === 'Editor') : null;
        elm.maxWidth = '100%';
        elm.maxHeight = '100%';
        if (builderTarget?.setData && data.properties) {
            await builderTarget.setData(data.properties);
        }
        const { dark, light } = data.properties || {};
        let tag = {};
        const darkTheme = getThemeValues(dark);
        const lightTheme = getThemeValues(light);
        if (darkTheme) {
            tag['dark'] = darkTheme;
        }
        if (lightTheme) {
            tag['light'] = lightTheme;
        }
        tag = { ...tag, ...data.tag };
        if (builderTarget?.setTag && Object.keys(tag).length) {
            await builderTarget.setTag(tag);
        }
        if (callback)
            callback(elm);
        return elm;
    }
    exports.getEmbedElement = getEmbedElement;
    function createLabelElements(text, styles) {
        const linkRegex = /https?:\/\/\S+/gi;
        const elements = [];
        let match;
        const matches = [];
        const labelStyles = {
            display: 'inline',
            overflowWrap: 'break-word',
            font: { size: '0.875rem', weight: 400 },
            lineHeight: '1.25rem',
            padding: { right: '4px' },
            ...(styles || {})
        };
        while ((match = linkRegex.exec(text)) !== null) {
            matches.push({
                type: 'link',
                index: match.index,
                length: match[0].length,
                data: { url: match[0], caption: match[0] }
            });
        }
        matches.sort((a, b) => a.index - b.index);
        let lastIndex = 0;
        matches.forEach(match => {
            if (match.index > lastIndex) {
                const textContent = text.slice(lastIndex, match.index);
                if (textContent.trim().length > 0) {
                    elements.push(new components_3.Label(undefined, {
                        caption: textContent,
                        ...labelStyles
                    }));
                }
            }
            if (match.type === 'link') {
                const link = new components_3.Label(undefined, {
                    link: { href: match.data.url, target: '_blank' },
                    caption: match.data.caption,
                    ...labelStyles,
                    font: { color: Theme.colors.primary.main, size: '0.875rem', weight: 400 }
                });
                elements.push(link);
            }
            lastIndex = match.index + match.length;
        });
        if (lastIndex < text.length) {
            let textContent = text.slice(lastIndex);
            if (textContent.trim().length > 0) {
                elements.push(new components_3.Label(undefined, {
                    caption: textContent,
                    ...labelStyles
                }));
            }
        }
        return elements;
    }
    exports.createLabelElements = createLabelElements;
    function groupMessage(messages) {
        const groupedMessage = [];
        let pubKey;
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (pubKey !== msg.sender) {
                groupedMessage.push({
                    sender: msg.sender,
                    pubKey: msg.pubKey,
                    messages: []
                });
            }
            groupedMessage[groupedMessage.length - 1].messages.push({
                contentElements: msg.contentElements,
                createdAt: msg.createdAt
            });
            pubKey = msg.sender;
        }
        return groupedMessage;
    }
    exports.groupMessage = groupMessage;
    function createTextElement(text, isMarkdown = false) {
        return {
            module: isMarkdown ? '@scom/scom-markdown-editor' : null,
            data: {
                properties: {
                    content: text,
                },
                tag: {
                    width: '100%',
                    pt: 0,
                    pb: 0,
                    pl: 0,
                    pr: 0,
                },
            },
        };
    }
    function extractMediaFromContent(content, metadataByPubKeyMap, eventData) {
        const elements = [];
        let textContent = content.slice();
        if (textContent.trim().length > 0) {
            elements.push(createTextElement(textContent));
        }
        return elements;
    }
    function constructMessage(content, metadataByPubKeyMap) {
        const messageElementData = extractMediaFromContent(content, metadataByPubKeyMap);
        return messageElementData;
    }
    exports.constructMessage = constructMessage;
    function createContexts(contexts) {
        return {
            module: '@scom/page-button',
            data: {
                properties: {
                    linkButtons: contexts.map(context => {
                        const isLink = context.startsWith('http');
                        return {
                            caption: context,
                            maxWidth: '150px',
                            background: { color: 'transparent' },
                            border: { radius: '0.25rem', style: 'solid', color: Theme.divider, width: '1px' },
                            padding: { left: '0.5rem', right: '0.5rem' },
                            font: { size: '0.75rem' },
                            icon: { name: isLink ? 'link' : 'file', width: '0.875rem', height: '0.875rem', stack: { shrink: '0' } },
                            class: index_css_1.customButtonStyle,
                            onClick: async (target) => {
                                if (context.length <= 18)
                                    return;
                                const oldName = target.icon.name;
                                await components_3.application.copyToClipboard(context);
                                target.icon.name = "check";
                                target.icon.fill = Theme.colors.success.main;
                                setTimeout(() => {
                                    target.icon.name = oldName;
                                    target.icon.fill = Theme.text.primary;
                                }, 1600);
                            }
                        };
                    })
                },
                tag: {
                    width: '100%',
                    pt: 0,
                    pb: 0,
                    pl: 0,
                    pr: 0,
                },
            },
        };
    }
    exports.createContexts = createContexts;
});
define("@scom/scom-chat/components/mediaPreview.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-chat/interface.ts", "@scom/scom-chat/utils.ts"], function (require, exports, components_4, interface_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomChatMediaPreview = void 0;
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomChatMediaPreview = class ScomChatMediaPreview extends components_4.Module {
        addMedia(type, url) {
            if (type === interface_1.MediaType.Image) {
                this.addImage(url);
            }
            else {
                this.addVideo(url);
            }
        }
        addImage(url) {
            const img = document.createElement('img');
            img.src = url;
            img.style.minWidth = '9rem';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.display = 'block';
            this.pnlMediaPreview.appendChild(img);
        }
        addVideo(url) {
            const elementData = {
                module: '@scom/scom-video',
                data: {
                    properties: {
                        url: url,
                    },
                    tag: {
                        width: '100%'
                    },
                },
            };
            (0, utils_1.getEmbedElement)(elementData, this.pnlMediaPreview);
        }
        handleRemoveMedia() {
            if (this.onRemoveMedia)
                this.onRemoveMedia();
        }
        init() {
            super.init();
            const type = this.getAttribute('type', true);
            const url = this.getAttribute('url', true);
            if (type && url) {
                this.addMedia(type, url);
            }
        }
        render() {
            this.$render("i-panel", { id: "pnlMediaPreview", position: "relative", height: "9rem", width: "fit-content", overflow: "hidden", border: { radius: '1rem' }, margin: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                this.$render("i-hstack", { position: "absolute", width: "2rem", height: "2rem", top: "0.25rem", right: "0.25rem", border: { radius: '50%' }, horizontalAlignment: "center", verticalAlignment: "center", cursor: "pointer", zIndex: 1, background: { color: Theme.colors.secondary.main }, hover: { backgroundColor: Theme.action.hoverBackground }, onClick: this.handleRemoveMedia },
                    this.$render("i-icon", { width: "1rem", height: "1rem", name: 'times' })));
        }
    };
    ScomChatMediaPreview = __decorate([
        (0, components_4.customElements)('i-scom-chat--media-preview')
    ], ScomChatMediaPreview);
    exports.ScomChatMediaPreview = ScomChatMediaPreview;
});
define("@scom/scom-chat/model.ts", ["require", "exports", "@ijstech/components", "@scom/scom-chat/utils.ts"], function (require, exports, components_5, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    class Model {
        constructor() {
            this._extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'tiff', 'tif', 'mp4', 'webm', 'ogg', 'avi', 'mkv', 'mov', 'm3u8'];
            this._isGroup = false;
            this._isAIChat = false;
            this._isContextShown = false;
            this._widgetMap = new Map(); // eventId: module
        }
        get extensions() {
            return this._extensions;
        }
        get imageExtensions() {
            return this._extensions.slice(0, 8);
        }
        get interlocutor() {
            return this._data.interlocutor;
        }
        set interlocutor(value) {
            if (!this._data)
                this._data = { messages: [] };
            this._data.interlocutor = value || {};
        }
        get isGroup() {
            return this._isGroup;
        }
        set isGroup(value) {
            this._isGroup = value;
        }
        get isAIChat() {
            return this._isAIChat;
        }
        set isAIChat(value) {
            this._isAIChat = value;
        }
        get messages() {
            return this._data.messages;
        }
        set messages(value) {
            if (!this._data)
                this._data = { messages: [] };
            this._data.messages = value;
        }
        get metadataByPubKeyMap() {
            return this._data.metadataByPubKeyMap;
        }
        set metadataByPubKeyMap(map) {
            if (!this._data)
                this._data = { messages: [] };
            this._data.metadataByPubKeyMap = map;
        }
        get dataManager() {
            return components_5.application.store?.mainDataManager;
        }
        get widgetMap() {
            return this._widgetMap;
        }
        get isContextShown() {
            return this._isContextShown;
        }
        set isContextShown(value) {
            this._isContextShown = value;
        }
        getData() {
            return this._data;
        }
        async setData(value) {
            this._data = value;
        }
        async fetchPaymentReceiptInfo(paymentRequest) {
            const info = await this.dataManager.fetchPaymentReceiptInfo(paymentRequest);
            return info;
        }
        async sendTempMessage(receiverId, message, replyToEventId, widgetId) {
            const userProfile = (0, utils_2.getUserProfile)();
            await this.dataManager.sendPingRequest(userProfile.pubkey, (0, utils_2.getPublicIndexingRelay)());
            const event = await this.dataManager.sendTempMessage({
                receiverId,
                message,
                replyToEventId,
                widgetId
            });
            return event;
        }
    }
    exports.Model = Model;
});
define("@scom/scom-chat/components/messageComposer.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-storage", "@scom/scom-gif-picker", "@scom/scom-chat/components/mediaPreview.tsx", "@scom/scom-chat/index.css.ts", "@scom/scom-chat/interface.ts", "@scom/scom-chat/utils.ts"], function (require, exports, components_6, scom_storage_1, scom_gif_picker_1, mediaPreview_1, index_css_2, interface_2, utils_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomChatMessageComposer = void 0;
    const Theme = components_6.Styles.Theme.ThemeVars;
    let ScomChatMessageComposer = class ScomChatMessageComposer extends components_6.Module {
        constructor() {
            super(...arguments);
            this._isSending = false;
            this.addedContexts = [];
            this.contextEls = {};
            this.isPasting = false;
        }
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
            this.pnlContextWrap.visible = false; // this.model.isContextShown;
        }
        get isSending() {
            return this._isSending;
        }
        set isSending(value) {
            this._isSending = value;
        }
        proccessFile() {
            if (!this.scomStorage) {
                this.scomStorage = scom_storage_1.ScomStorage.getInstance();
                this.scomStorage.onCancel = () => {
                    this.scomStorage.closeModal();
                };
            }
            this.scomStorage.uploadMultiple = false;
            this.scomStorage.onUploadedFile = (path) => {
                const ext = path.split('.').pop().toLowerCase();
                if (this.model.extensions.includes(ext)) {
                    this.mediaUrl = path;
                    const type = this.model.imageExtensions.includes(ext) ? interface_2.MediaType.Image : interface_2.MediaType.Video;
                    this.addMedia(type, path);
                    this.scomStorage.closeModal();
                    this.pnlAttachment.visible = false;
                }
            };
            this.scomStorage.onOpen = (path) => {
                const ext = path.split('.').pop().toLowerCase();
                if (this.model.extensions.includes(ext)) {
                    this.mediaUrl = path;
                    const type = this.model.imageExtensions.includes(ext) ? interface_2.MediaType.Image : interface_2.MediaType.Video;
                    this.addMedia(type, path);
                    this.scomStorage.closeModal();
                    this.pnlAttachment.visible = false;
                }
            };
            this.scomStorage.openModal({
                width: 800,
                maxWidth: '100%',
                height: '90vh',
                overflow: 'hidden',
                zIndex: 1002,
                closeIcon: { width: '1rem', height: '1rem', name: 'times', fill: Theme.text.primary, margin: { bottom: '0.5rem' } },
                class: index_css_2.storageModalStyle
            });
            this.scomStorage.onShow();
        }
        handleAttachmentClick() {
            this.mdAttachment.visible = true;
        }
        handleEmojiClick() {
            this.emojiPicker.clearSearch();
            this.mdEmoji.visible = true;
        }
        handelGifClick() {
            if (!this.gifPicker) {
                this.gifPicker = new scom_gif_picker_1.ScomGifPicker();
                this.gifPicker.onGifSelected = this.onGifSelected.bind(this);
                this.gifPicker.onClose = () => this.gifPicker.closeModal();
            }
            const modal = this.gifPicker.openModal({
                maxWidth: '600px',
                height: '90vh',
                overflow: { y: 'auto' },
                padding: { top: 0, right: 0, left: 0, bottom: 0 },
                border: { radius: '1rem' },
                closeIcon: null,
                mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            showBackdrop: true,
                            popupPlacement: 'top',
                            position: 'fixed',
                            zIndex: 999,
                            maxWidth: '100%',
                            height: '100%',
                            width: '100%',
                            border: { radius: 0 }
                        }
                    }
                ],
                zIndex: 102,
                onOpen: this.gifPicker.show.bind(this.gifPicker),
                onClose: this.gifPicker.clear.bind(this.gifPicker)
            });
            modal.closeIcon = null;
            this.mdAttachment.visible = false;
        }
        handleKeyDown(target, event) {
            if (event.code === "KeyV" && (event.ctrlKey || event.shiftKey || event.metaKey)) {
                this.isPasting = true;
                return;
            }
            if (event.key === "Enter" && (event.ctrlKey || event.shiftKey || event.metaKey))
                return;
            if (event.key === "Enter") {
                event.preventDefault();
            }
            if (event.key !== "Enter")
                return;
            this.handleSubmit(target, event);
        }
        handleChanged(target, event) {
            if (!this.model.isContextShown)
                return;
            const value = target.value || '';
            if (this.isPasting) {
                this.isPasting = false;
                const imageRegex = /https?:\/\/[^\s{}]+/gi;
                const matches = value.match(imageRegex);
                if (matches) {
                    for (const context of matches) {
                        if (!this.addedContexts.includes(context)) {
                            this.addedContexts.push(context);
                            this.appendContext(context, true);
                        }
                    }
                    this.updateContext(true);
                }
            }
            else {
                for (const context of this.addedContexts) {
                    if (context.startsWith('http') && !value.includes(context)) {
                        this.handleRemoveContext(context);
                        this.addedContexts = this.addedContexts.filter(item => item !== context);
                    }
                }
            }
        }
        appendContext(value, isLink) {
            this.lblContextPlaceholder.visible = false;
            const elem = this.$render("i-hstack", { verticalAlignment: 'center', gap: '4px', border: { radius: '0.25rem', style: 'solid', color: Theme.divider, width: '1px' }, padding: { left: '0.5rem', right: '0.5rem', top: '0.15rem', bottom: '0.15rem' }, cursor: 'pointer', display: 'inline-flex', maxWidth: '200px', tag: value, class: !isLink ? index_css_2.customHoverStyle : '' },
                this.$render("i-icon", { name: isLink ? 'link' : 'file', width: '0.875rem', height: '0.875rem', stack: { shrink: '0' }, opacity: 0.5 }),
                this.$render("i-icon", { name: 'times', width: '0.875rem', height: '0.875rem', stack: { shrink: '0' }, opacity: 0.5, onClick: () => {
                        this.handleRemoveContext(value, true);
                        if (typeof this.onContextRemoved === 'function')
                            this.onContextRemoved(value);
                    }, visible: false }),
                this.$render("i-label", { caption: value, font: { size: '0.75rem' }, textOverflow: 'ellipsis' }));
            this.pnlContext.appendChild(elem);
            this.contextEls[value] = elem;
        }
        handleRemoveContext(value, isForced) {
            if (value && isForced) {
                const regex = new RegExp(`${value}`, 'g');
                this.edtMessage.value = this.edtMessage.value.replace(regex, '');
                this.addedContexts = this.addedContexts.filter(item => item !== value);
            }
            const el = this.contextEls[value];
            el?.remove();
            const hasChildren = this.pnlContext.firstElementChild;
            if (!hasChildren) {
                this.updateContext(false);
            }
            this.contextEls[value] = null;
        }
        updateContext(value) {
            this.lblContextPlaceholder.visible = !value;
            this.pnlContext.visible = value;
            this.pnlContext.margin = { left: value ? '0.25rem' : '0px' };
            if (!value) {
                for (const key in this.contextEls) {
                    this.contextEls[key]?.remove();
                }
                this.addedContexts = [];
                this.pnlContext.clearInnerHTML();
                this.contextEls = {};
            }
            this.pnlContextWrap.visible = !!this.addedContexts?.length;
        }
        addContext(value) {
            if (!this.addedContexts.includes(value)) {
                this.addedContexts.push(value);
                this.appendContext(value, false);
                this.updateContext(true);
            }
        }
        removeContext(value) {
            this.handleRemoveContext(value, true);
            if (typeof this.onContextRemoved === 'function')
                this.onContextRemoved(value);
        }
        async submitMessage(event) {
            const gifUrl = this.gifUrl;
            let message = this.edtMessage.value.trim();
            const urlRegex = /(?<!{)(https?:\/\/[^\s{}]+)(?!})/g;
            message = message.replace(urlRegex, (match) => `{${match}}`);
            let mediaUrls = [];
            if (this.mediaUrl)
                mediaUrls.push(this.mediaUrl);
            if (gifUrl)
                mediaUrls.push(gifUrl);
            if (!message.length && !mediaUrls.length)
                return;
            if (this.onSubmit)
                await this.onSubmit(message, mediaUrls, this.addedContexts, event);
            this.removeMedia();
            this.updateContext(false);
        }
        setMessage(message) {
            this.edtMessage.value = message;
            this.pnlSend.click();
        }
        async handleSubmit(target, event) {
            if (this.isSending)
                return;
            try {
                this.submitMessage(event);
                this.edtMessage.value = "";
                this.edtMessage.height = 'auto';
            }
            catch (err) {
                console.error(err);
            }
        }
        addMedia(type, url) {
            this.pnlPreview.clearInnerHTML();
            const mediaPreview = new mediaPreview_1.ScomChatMediaPreview(undefined, {
                type: type,
                url: url,
                onRemoveMedia: this.removeMedia.bind(this)
            });
            this.pnlPreview.appendChild(mediaPreview);
        }
        removeMedia() {
            this.mediaUrl = "";
            this.gifUrl = "";
            this.pnlPreview.clearInnerHTML();
            this.pnlPreview.visible = false;
            this.pnlAttachment.visible = (0, utils_3.isDevEnv)();
        }
        handleSelectedEmoji(value) {
            this.edtMessage.value = this.edtMessage.value + value;
        }
        onGifSelected(gif) {
            const url = gif.images.original.url;
            this.gifUrl = url;
            const smallUrl = gif.images.preview_webp.url;
            this.addMedia(interface_2.MediaType.Image, smallUrl);
            this.gifPicker.closeModal();
        }
        handleEdit() {
            if (typeof this.onEdit === 'function')
                this.onEdit();
        }
        init() {
            super.init();
            this.onEdit = this.getAttribute('onEdit', true) || this.onEdit;
            this.onContextRemoved = this.getAttribute('onContextRemoved', true) || this.onContextRemoved;
            this.onSubmit = this.getAttribute('onSubmit', true) || this.onSubmit;
            this.pnlAttachment.visible = (0, utils_3.isDevEnv)();
        }
        render() {
            return (this.$render("i-vstack", { background: { color: Theme.input.background }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }, border: { radius: '1rem' }, mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            padding: { top: '0.25rem', bottom: '0.25rem', left: '0.25rem', right: '0.25rem' }
                        }
                    }
                ] },
                this.$render("i-panel", { id: "pnlPreview", minHeight: "auto", visible: false }),
                this.$render("i-hstack", { id: "pnlContextWrap", verticalAlignment: 'center', display: 'inline-flex', margin: { top: '0.25rem' }, visible: false },
                    this.$render("i-hstack", { id: "pnlContextFixed", verticalAlignment: 'center', padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: '0.25rem', style: 'solid', color: Theme.divider, width: '1px' }, cursor: 'pointer', height: '100%', gap: "4px", display: 'inline-flex', visible: false },
                        this.$render("i-label", { caption: '@', font: { size: '0.875rem' }, opacity: 0.5 }),
                        this.$render("i-label", { id: "lblContextPlaceholder", caption: 'Add Context', font: { size: '0.75rem' } })),
                    this.$render("i-hstack", { id: "pnlContext", margin: { left: '0px' }, verticalAlignment: 'center', gap: '4px', height: '100%', wrap: 'wrap' })),
                this.$render("i-hstack", { width: "100%", verticalAlignment: "center", gap: "4px" },
                    this.$render("i-hstack", { id: "pnlAttachment", position: "relative", width: "2rem", height: "2rem", border: { radius: '50%' }, horizontalAlignment: "center", verticalAlignment: "center", cursor: "pointer", hover: { backgroundColor: "#C16FFF26" }, tooltip: { content: '$attachment', placement: 'top' }, onClick: this.handleAttachmentClick },
                        this.$render("i-icon", { width: "1rem", height: "1rem", name: 'paperclip', fill: "#C16FFF" }),
                        this.$render("i-modal", { id: "mdAttachment", maxWidth: "15rem", minWidth: "12.25rem", maxHeight: "27.5rem", popupPlacement: 'topLeft', showBackdrop: false, border: { radius: '1rem' }, boxShadow: 'rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px', padding: { top: 0, left: 0, right: 0, bottom: 0 }, margin: { bottom: '0.25rem' }, closeOnScrollChildFixed: true, overflow: { y: 'hidden' }, visible: false },
                            this.$render("i-vstack", null,
                                this.$render("i-hstack", { verticalAlignment: "center", width: "100%", padding: { top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }, border: { radius: '0.125rem' }, gap: "0.75rem", cursor: "pointer", hover: {
                                        fontColor: Theme.text.primary,
                                        backgroundColor: Theme.action.hoverBackground
                                    }, onClick: this.proccessFile, mediaQueries: [
                                        {
                                            maxWidth: '767px',
                                            properties: {
                                                padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }
                                            }
                                        }
                                    ] },
                                    this.$render("i-hstack", { width: "2rem", height: "2rem", horizontalAlignment: "center", verticalAlignment: "center", tooltip: { content: '$media', placement: 'top' } },
                                        this.$render("i-icon", { width: "1rem", height: "1rem", name: 'image', fill: "#C16FFF" })),
                                    this.$render("i-label", { caption: "$media", font: { color: Theme.colors.secondary.light, weight: 400, size: '0.875rem' } })),
                                this.$render("i-hstack", { verticalAlignment: "center", width: "100%", padding: { top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }, border: { radius: '0.125rem' }, gap: "0.75rem", cursor: "pointer", hover: {
                                        fontColor: Theme.text.primary,
                                        backgroundColor: Theme.action.hoverBackground
                                    }, onClick: this.handelGifClick, mediaQueries: [
                                        {
                                            maxWidth: '767px',
                                            properties: {
                                                padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }
                                            }
                                        }
                                    ] },
                                    this.$render("i-hstack", { width: "2rem", height: "2rem", horizontalAlignment: "center", verticalAlignment: "center", tooltip: { content: '$media', placement: 'top' } },
                                        this.$render("i-icon", { width: "1rem", height: "1rem", name: 'images', fill: "#C16FFF" })),
                                    this.$render("i-label", { caption: "$gif", font: { color: Theme.colors.secondary.light, weight: 400, size: '0.875rem' } }))))),
                    this.$render("i-hstack", { id: "pnlEdit", width: "2rem", height: "2rem", border: { radius: '50%' }, horizontalAlignment: "center", verticalAlignment: "center", cursor: "pointer", visible: false, hover: { backgroundColor: "#C16FFF26" }, tooltip: { content: '$emoji', placement: 'top' }, onClick: this.handleEdit },
                        this.$render("i-icon", { width: "1rem", height: "1rem", name: 'edit', fill: "#C16FFF" })),
                    this.$render("i-hstack", { width: "2rem", height: "2rem", position: "relative" },
                        this.$render("i-hstack", { width: "2rem", height: "2rem", border: { radius: '50%' }, horizontalAlignment: "center", verticalAlignment: "center", cursor: "pointer", hover: { backgroundColor: "#C16FFF26" }, tooltip: { content: '$emoji', placement: 'top' }, onClick: this.handleEmojiClick },
                            this.$render("i-icon", { width: "1rem", height: "1rem", name: 'smile', fill: "#C16FFF" })),
                        this.$render("i-modal", { id: "mdEmoji", width: "20rem", popupPlacement: 'topLeft', showBackdrop: false, border: { radius: '1rem' }, boxShadow: 'rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px', padding: { top: 0, left: 0, right: 0, bottom: 0 }, margin: { bottom: '0.25rem' }, closeOnScrollChildFixed: true, overflow: { y: 'hidden' }, visible: false },
                            this.$render("i-scom-emoji-picker", { id: "emojiPicker", onEmojiSelected: this.handleSelectedEmoji }))),
                    this.$render("i-hstack", { verticalAlignment: "center", stack: { grow: "1" } },
                        this.$render("i-input", { id: "edtMessage", width: "100%", height: "auto", maxHeight: 130, display: "flex", rows: 1, padding: { left: '0.25rem', right: '0.25rem' }, border: { style: 'none' }, placeholder: "$type_a_message", inputType: "textarea", resize: 'auto-grow', background: { color: 'transparent' }, onKeyDown: this.handleKeyDown, onChanged: this.handleChanged })),
                    this.$render("i-hstack", { id: "pnlSend", width: "2rem", height: "2rem", border: { radius: '50%' }, horizontalAlignment: "center", verticalAlignment: "center", cursor: "pointer", hover: { backgroundColor: "#C16FFF26" }, onClick: this.handleSubmit, tooltip: { content: '$send', placement: 'top' } },
                        this.$render("i-icon", { width: "1rem", height: "1rem", name: 'paper-plane', fill: "#C16FFF" })))));
        }
    };
    ScomChatMessageComposer = __decorate([
        (0, components_6.customElements)('i-scom-chat--message-composer')
    ], ScomChatMessageComposer);
    exports.ScomChatMessageComposer = ScomChatMessageComposer;
});
define("@scom/scom-chat/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_7.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fullPath
    };
});
define("@scom/scom-chat/language.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-chat/language.json.ts'/> 
    exports.default = {
        "en": {
            "restore_checkpoint": "Restore checkpoint",
            "redo_checkpoint": "Redo checkpoint"
        },
        "zh-hant": {
            "restore_checkpoint": "恢復檢查點",
            "redo_checkpoint": "重做檢查點"
        },
        "vi": {
            "restore_checkpoint": "Hoàn tác",
            "redo_checkpoint": "Làm lại"
        }
    };
});
define("@scom/scom-chat/components/thread.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-chat/utils.ts", "@scom/scom-chat/index.css.ts", "@scom/scom-chat/assets.ts", "@scom/scom-chat/language.json.ts"], function (require, exports, components_8, utils_4, index_css_3, assets_1, language_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomChatThreadMessage = exports.ScomChatThread = void 0;
    const Theme = components_8.Styles.Theme.ThemeVars;
    let ScomChatThread = class ScomChatThread extends components_8.Module {
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
        }
        clear() {
            this.pnlContent.clearInnerHTML();
        }
        toggleEnable(value) {
            const messages = this.pnlContent.querySelectorAll('i-scom-chat--thread-message');
            messages.forEach(message => {
                message.toggleEnable(value);
            });
        }
        addMessages(pubKey, info, showTime) {
            let isMyThread = pubKey === info.sender;
            this.pnlThread.padding = this.model.isGroup ? { left: '2.25rem', bottom: "1rem" } : { bottom: "1rem" };
            this.pnlThread.alignItems = isMyThread ? "end" : "start";
            this.pnlContent.alignItems = isMyThread ? "end" : "start";
            this.renderMessages(info, isMyThread, this.model.isGroup, showTime);
            if (info?.tag?.changeId)
                this.classList.add(`change-${info.tag.changeId}`);
        }
        async renderMessages(info, isMyThread, isGroup, showTime) {
            const messages = info.messages;
            let showUserInfo = isGroup && !isMyThread;
            for (let i = 0; i < messages.length; i++) {
                const showMessageTime = messages[i + 1] ? components_8.moment.unix(messages[i + 1].createdAt).diff(components_8.moment.unix(messages[i].createdAt)) > 60000 : (showTime ?? true);
                const threadMessage = new ScomChatThreadMessage(undefined, { width: '100%' });
                threadMessage.model = this.model;
                threadMessage.onContentRendered = this.onContentRendered;
                threadMessage.onRestore = this.onRestore;
                this.pnlContent.appendChild(threadMessage);
                await threadMessage.ready();
                threadMessage.isRestoreShown = info.isRestoreShown;
                threadMessage.tag = info.tag;
                threadMessage.setData(info.sender, info.pubKey, messages[i], isMyThread, showUserInfo);
                if (showMessageTime) {
                    const msgTime = (0, utils_4.getMessageTime)(messages[i].createdAt);
                    this.pnlContent.appendChild(this.$render("i-label", { caption: msgTime, font: { size: '0.8125rem', color: Theme.text.secondary }, lineHeight: "1.25rem" }));
                }
                if (this.onContentRendered)
                    this.onContentRendered();
                showUserInfo = false;
            }
        }
        init() {
            super.init();
        }
        render() {
            return (this.$render("i-vstack", { id: "pnlThread", width: "100%", padding: { bottom: "1rem" } },
                this.$render("i-vstack", { id: "pnlContent", gap: "0.5rem", width: "90%", mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                width: "95%"
                            }
                        }
                    ] })));
        }
    };
    ScomChatThread = __decorate([
        (0, components_8.customElements)('i-scom-chat--thread')
    ], ScomChatThread);
    exports.ScomChatThread = ScomChatThread;
    let ScomChatThreadMessage = class ScomChatThreadMessage extends components_8.Module {
        constructor() {
            super(...arguments);
            this._isRestoreShown = false;
        }
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
        }
        get isRestoreShown() {
            return this._isRestoreShown;
        }
        set isRestoreShown(value) {
            this._isRestoreShown = value;
            if (this.btnRestore)
                this.btnRestore.visible = value;
        }
        setData(sender, pubKey, message, isMyThread, showUserInfo) {
            this.pnlContainer.justifyContent = isMyThread ? 'end' : 'start';
            this.pnlMessage.border = { radius: isMyThread ? "16px 16px 2px 16px" : "16px 16px 16px 2px" };
            this.pnlMessage.background = { color: isMyThread ? "#B14FFF" : Theme.colors.secondary.main };
            if (showUserInfo) {
                const content = this.model.metadataByPubKeyMap[pubKey].content;
                this.pnlThreadMessage.prepend(this.renderAvatar(sender, content.picture));
                this.pnlMessage.appendChild(this.$render("i-label", { caption: content.display_name || content.name || "", font: { color: Theme.colors.info.main, weight: 600 }, margin: { bottom: '0.25rem' } }));
            }
            this.renderMessageContent(message, this.pnlMessage);
        }
        renderAvatar(sender, picture) {
            const url = picture || assets_1.default.fullPath('img/default_avatar.png');
            return (this.$render("i-panel", { width: "1.75rem", height: "1.75rem", position: "absolute", top: 0, left: "-2.25rem", overflow: "hidden" },
                this.$render("i-panel", { width: "100%", height: 0, overflow: "hidden", padding: { bottom: "100%" }, border: { radius: "50%" } },
                    this.$render("i-image", { class: index_css_3.imageStyle, position: "absolute", display: "block", width: "100%", height: "100%", top: "100%", left: 0, url: url, fallbackUrl: assets_1.default.fullPath('img/default_avatar.png'), cursor: "pointer", objectFit: "cover", onClick: () => this.viewUserProfile(sender) }))));
        }
        appendLabel(parent, text) {
            const splitted = text.split('\n');
            for (let i = 0; i < splitted.length; i++) {
                const elements = (0, utils_4.createLabelElements)(splitted[i], { overflowWrap: "anywhere", class: index_css_3.customLinkStyle });
                const panel = new components_8.Panel(undefined, { display: 'inline', minHeight: '1.5rem' });
                panel.append(...elements);
                parent.appendChild(panel);
            }
        }
        renderMessageContent(message, parent) {
            if (message.contentElements?.length) {
                for (let item of message.contentElements) {
                    if (item.category !== 'quotedPost') {
                        if (item.module) {
                            const pnlModule = new components_8.Panel();
                            parent.appendChild(pnlModule);
                            (0, utils_4.getEmbedElement)(item, pnlModule, async (elm) => {
                                pnlModule.minHeight = 'auto';
                                if (this.model.onEmbeddedElement)
                                    this.model.onEmbeddedElement(item.module, elm);
                                if (item.module === '@scom/scom-invoice') {
                                    const builderTarget = elm.getConfigurators().find((conf) => conf.target === 'Builders');
                                    const data = builderTarget.getData();
                                    if (data.paymentAddress) {
                                        let info = await this.model.fetchPaymentReceiptInfo(data?.paymentAddress);
                                        if (info.status === 'completed')
                                            elm.isPaid = true;
                                        if (info.tx)
                                            elm.tx = info.tx;
                                    }
                                }
                                else if (item.module === '@scom/scom-master-bot-command-widget') {
                                    console.log('conversation render scom master bot command widget', item);
                                    parent.overflow = 'unset';
                                    const scomMasterBotCommandWidget = elm;
                                    scomMasterBotCommandWidget.onExecute = async (command) => {
                                        const event = await this.model.sendTempMessage(this.model.interlocutor.id, command, null, '@scom/scom-master-bot-command-widget');
                                        const eventId = event.event.id;
                                        this.model.widgetMap.set(eventId, scomMasterBotCommandWidget);
                                    };
                                }
                                else if (item.module === 'checkout-message') {
                                    elm.setData(item.data.properties, message.createdAt);
                                }
                                if (this.onContentRendered)
                                    this.onContentRendered();
                            });
                            if (item.module !== '@scom/scom-markdown-editor' && item.module !== '@scom/page-button') {
                                this.pnlThreadMessage.stack = { grow: "1", shrink: "1", basis: "0" };
                            }
                        }
                        else {
                            let content = item?.data?.properties?.content || '';
                            this.appendLabel(this.pnlMessage, content);
                            if (this.onContentRendered)
                                this.onContentRendered();
                        }
                    }
                }
            }
        }
        viewUserProfile(pubKey) {
            if (pubKey) {
                window.open(`#!/p/${pubKey}`, '_self');
            }
        }
        async handleRestore(target) {
            const data = this.tag || {};
            data.type = target.tag;
            let result = false;
            if (typeof this.onRestore === 'function')
                result = await this.onRestore(data);
            if (result) {
                const isRestore = !data.type || data.type === 'restore';
                this.btnRestore.icon.name = isRestore ? 'redo-alt' : 'undo-alt';
                this.btnRestore.tooltip.content = isRestore ? '$redo_checkpoint' : '$restore_checkpoint';
                this.btnRestore.tag = isRestore ? 'redo' : 'restore';
            }
        }
        toggleEnable(value) {
            this.opacity = value ? 1 : 0.7;
            this.btnRestore.enabled = value;
            const buttons = this.pnlMessage.querySelectorAll('i-button');
            buttons.forEach(button => {
                button.enabled = value;
            });
        }
        init() {
            this.i18n.init({ ...language_json_1.default });
            super.init();
        }
        render() {
            return (this.$render("i-hstack", { id: "pnlContainer", width: "100%", gap: "0.25rem", stack: { grow: "1", shrink: "1", basis: "0" } },
                this.$render("i-hstack", { id: "pnlThreadMessage", position: "relative", maxWidth: "100%", stack: { shrink: "1" } },
                    this.$render("i-vstack", { id: "pnlMessage", class: index_css_3.messageStyle, maxWidth: "100%", padding: { top: "0.75rem", bottom: "0.75rem", left: "0.75rem", right: "0.75rem" }, lineHeight: "1.3125rem", overflow: "hidden", stack: { grow: "1", shrink: "1", basis: "0" }, gap: "0.5rem" }),
                    this.$render("i-button", { id: "btnRestore", border: { radius: '0.35rem', style: 'solid', color: Theme.divider, width: '1px' }, height: "1.5rem", width: "1.5rem", font: { size: '0.75rem' }, icon: { name: 'undo-alt', width: '0.675rem', height: '0.675rem', fill: Theme.text.primary, stack: { shrink: '0' } }, tooltip: { content: '$restore_checkpoint', placement: 'top' }, background: { color: Theme.background.default }, boxShadow: 'none', tag: "restore", bottom: "-0.75rem", right: "0px", visible: false, onClick: this.handleRestore }))));
        }
    };
    ScomChatThreadMessage = __decorate([
        (0, components_8.customElements)('i-scom-chat--thread-message')
    ], ScomChatThreadMessage);
    exports.ScomChatThreadMessage = ScomChatThreadMessage;
});
define("@scom/scom-chat/components/index.ts", ["require", "exports", "@scom/scom-chat/components/loadingSpinner.tsx", "@scom/scom-chat/components/mediaPreview.tsx", "@scom/scom-chat/components/messageComposer.tsx", "@scom/scom-chat/components/thread.tsx"], function (require, exports, loadingSpinner_1, mediaPreview_2, messageComposer_1, thread_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomChatThread = exports.ScomChatMessageComposer = exports.ScomChatMediaPreview = exports.LoadingSpinner = void 0;
    Object.defineProperty(exports, "LoadingSpinner", { enumerable: true, get: function () { return loadingSpinner_1.LoadingSpinner; } });
    Object.defineProperty(exports, "ScomChatMediaPreview", { enumerable: true, get: function () { return mediaPreview_2.ScomChatMediaPreview; } });
    Object.defineProperty(exports, "ScomChatMessageComposer", { enumerable: true, get: function () { return messageComposer_1.ScomChatMessageComposer; } });
    Object.defineProperty(exports, "ScomChatThread", { enumerable: true, get: function () { return thread_1.ScomChatThread; } });
});
define("@scom/scom-chat/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-chat/data.json.ts'/> 
    exports.default = {
        "hi": `Hello! How can I assist you today? ${String.fromCodePoint(0x1F60A)}`,
        "hello": `Hello! ${String.fromCodePoint(0x1F60A)} How are you doing today?`,
        "bye": "Bye! If you have any more questions or need assistance in the future, don't hesitate to reach out. Have a great day!",
        "goodbye": "Goodbye! It was nice chatting with you. Take care and feel free to come back if you need anything else. Have a wonderful day!",
        "joke": `Why couldn't the bicycle stand up by itself?\nBecause it was two-tired! ${String.fromCodePoint(0x1F604)}`,
        "funny one-liner": `"I told my wife she was drawing her eyebrows too high. She looked surprised." ${String.fromCodePoint(0x1F604)}`,
        "trending now": "1. Delhi Man Regrets Moving to Canada: A man from Delhi shared his disappointing experience of moving to Canada, stating that the Western lifestyle was not as fulfilling as he expected.\n\n2. Trending News in Telugu: TV9 Telugu is covering various trending news stories, including a complaint filed by an MP regarding the suppression of SC community representatives' rights and a red corner notice issued against certain individuals. Additionally, there is an ongoing investigation into betting apps and their promotion.\n\n3. Protests Against Liquor Prices: There are demands for the government to shut down belt shops due to allegations of illegal price fixing by liquor syndicates, leading to protests and arrests.\n\n4. Betting Apps Investigation: Police are increasing surveillance on individuals promoting betting apps, with potential legal actions against those involved.",
        "what is the largest mammal on earth?": "The blue whale.",
        "what is the fastest land animal?": "The cheetah",
        "what is the the only bird that can fly backward?": `The hummingbird! ${String.fromCodePoint(0x1F338)}${String.fromCodePoint(0x1F426)}`,
        "what is the most spoken language in the world?": `Mandarin Chinese! ${String.fromCodePoint(0x1F30F)}`,
        "what gets wetter the more it dries?": `A towel! ${String.fromCodePoint(0x1F9FA)}${String.fromCodePoint(0x1F4A6)}`,
    };
});
define("@scom/scom-chat", ["require", "exports", "@ijstech/components", "@scom/scom-chat/index.css.ts", "@scom/scom-chat/components/index.ts", "@scom/scom-chat/model.ts", "@scom/scom-chat/utils.ts", "@scom/scom-chat/data.json.ts"], function (require, exports, components_9, index_css_4, components_10, model_1, utils_5, data_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomChat = void 0;
    const Theme = components_9.Styles.Theme.ThemeVars;
    let ScomChat = class ScomChat extends components_9.Module {
        constructor() {
            super(...arguments);
            this._isSending = false;
            this._isRestoreShown = false;
        }
        get interlocutor() {
            return this.model.interlocutor;
        }
        set interlocutor(value) {
            this.model.interlocutor = value;
        }
        set messages(value) {
            if (!value || !value.length) {
                this.pnlMessage.clearInnerHTML();
            }
            else {
                let groupedMessage = (0, utils_5.groupMessage)(value);
                this.renderThread(groupedMessage);
            }
        }
        get oldMessage() {
            return this._oldMessage;
        }
        set oldMessage(msg) {
            this._oldMessage = msg;
        }
        get metadataByPubKeyMap() {
            return this.model.metadataByPubKeyMap;
        }
        set metadataByPubKeyMap(map) {
            this.model.metadataByPubKeyMap = map;
        }
        get widgetMap() {
            return this.model.widgetMap;
        }
        get isGroup() {
            return this.model.isGroup;
        }
        set isGroup(value) {
            this.model.isGroup = value;
        }
        get isAIChat() {
            return this.model.isAIChat;
        }
        set isAIChat(value) {
            this.model.isAIChat = value;
        }
        get isRestoreShown() {
            return this._isRestoreShown;
        }
        set isRestoreShown(value) {
            this._isRestoreShown = value;
        }
        get isContextShown() {
            return this.model.isContextShown;
        }
        set isContextShown(value) {
            this.model.isContextShown = value;
        }
        set isSending(value) {
            this._isSending = value;
            if (this.messageComposer)
                this.messageComposer.isSending = value;
        }
        get isSending() {
            return this._isSending;
        }
        constructMessage(content, metadataByPubKeyMap) {
            return (0, utils_5.constructMessage)(content, metadataByPubKeyMap);
        }
        clear() {
            this.oldMessage = null;
            this.pnlMessage.clearInnerHTML();
        }
        getData() {
            return this.model.getData();
        }
        setData(value) {
            this.model.setData(value);
            this.messages = value.messages;
        }
        getTag() {
            return this.tag;
        }
        setTag(value) {
            this.tag = value;
        }
        scrollToBottom() {
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        }
        addMessages(messages, isPrepend) {
            const userProfile = (0, utils_5.getUserProfile)();
            const npub = userProfile?.npub;
            let groupedMessage = (0, utils_5.groupMessage)(messages);
            for (let info of groupedMessage) {
                this.addThread(npub, info, isPrepend);
            }
        }
        renderThread(groupedMessage) {
            this.pnlMessage.clearInnerHTML();
            if (!groupedMessage)
                return;
            const userProfile = (0, utils_5.getUserProfile)();
            const npub = userProfile?.npub;
            for (let info of groupedMessage) {
                this.addThread(npub, info);
            }
        }
        async addThread(pubKey, info, isPrepend) {
            const thread = new components_10.ScomChatThread();
            thread.model = this.model;
            thread.onContentRendered = () => {
                if (!isPrepend)
                    this.scrollToBottom();
            };
            thread.onRestore = this.onRestore;
            await thread.ready();
            thread.addMessages(pubKey, info);
            if (isPrepend)
                this.pnlMessage.prepend(thread);
            else {
                this.pnlMessage.appendChild(thread);
                this.scrollToBottom();
            }
            return thread;
        }
        handleIntersect(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.oldMessage?.createdAt > 0) {
                    this.fetchOldMessages(this.oldMessage.createdAt);
                }
            });
        }
        showLoadingSpinner() {
            if (!this.loadingSpinner) {
                this.loadingSpinner = new components_10.LoadingSpinner();
                this.pnlMessageTop.append(this.loadingSpinner);
                this.loadingSpinner.setProperties({
                    minHeight: 40
                });
                this.loadingSpinner.height = 40;
            }
            this.loadingSpinner.display = 'block';
        }
        async fetchOldMessages(until) {
            if (this.isFetchingMessage)
                return;
            this.isFetchingMessage = true;
            this.showLoadingSpinner();
            const userProfile = (0, utils_5.getUserProfile)();
            const npub = userProfile?.npub;
            let messages = [];
            if (this.onFetchMessage)
                messages = await this.onFetchMessage(0, until);
            const filteredMessages = messages.filter(msg => msg.id !== this.oldMessage?.id);
            if (filteredMessages.length) {
                this.oldMessage = filteredMessages[filteredMessages.length - 1];
                let groupedMessage = (0, utils_5.groupMessage)(filteredMessages);
                let firstMessage = this.pnlMessage.firstElementChild;
                for (let i = groupedMessage.length - 1; i >= 0; i--) {
                    this.addThread(npub, groupedMessage[i], true);
                }
                if (firstMessage)
                    firstMessage.scrollIntoView();
            }
            this.loadingSpinner.display = 'none';
            this.isFetchingMessage = false;
        }
        _constructMessage(msg, createdAt, contexts) {
            const messageElementData = this.constructMessage(msg, this.model.metadataByPubKeyMap);
            if (contexts?.length) {
                messageElementData.unshift((0, utils_5.createContexts)(contexts));
            }
            return {
                contentElements: [...messageElementData],
                createdAt: createdAt
            };
        }
        async handleSendMessage(message, mediaUrls, contexts, event) {
            const userProfile = (0, utils_5.getUserProfile)();
            const npub = userProfile?.npub;
            const createdAt = Math.round(Date.now() / 1000);
            const newMessage = {
                messages: [],
                sender: npub,
                isRestoreShown: this.isRestoreShown
            };
            const messages = mediaUrls ? [...mediaUrls] : [];
            if (message)
                messages.push(message);
            for (let msg of messages) {
                newMessage.messages.push(this._constructMessage(msg, createdAt, contexts));
                if (this.onSendMessage)
                    this.onSendMessage(msg);
                newMessage.tag = this.tag;
            }
            this.addThread(npub, newMessage);
            if (this.isAIChat)
                setTimeout(() => this.handleAutoReply(message), 300);
        }
        async handleAutoReply(usermessage) {
            const userProfile = (0, utils_5.getUserProfile)();
            const npub = userProfile?.npub;
            const createdAt = Math.round(Date.now() / 1000);
            let groupedMessage = {
                messages: [this._constructMessage("Typing...", createdAt)],
                sender: this.model.interlocutor.id || "npub123"
            };
            const message = usermessage.trim().toLowerCase();
            const thread = await this.addThread(npub, groupedMessage);
            setTimeout(() => {
                thread.clear();
                const reply = data_json_1.default[message] || "I couldn't find the specific information you're looking for.\nThis might be due to the complexity of the question, outdated information, or limitations in my current knowledge base.";
                groupedMessage.messages = [this._constructMessage(reply, createdAt)];
                thread.addMessages(npub, groupedMessage);
            }, 700);
        }
        async appendTypingMessage(isPrepend) {
            const userProfile = (0, utils_5.getUserProfile)();
            const npub = userProfile?.npub;
            const createdAt = Math.round(Date.now() / 1000);
            const sender = this.model.interlocutor.id || "npub123";
            const elements = [
                {
                    module: '@scom/scom-markdown-editor',
                    data: {
                        properties: {
                            content: `<i-hstack class="typing" alignItems="center">
                                    <i-icon name="circle" width="10px" height="10px" fill="white"></i-icon>
                                    <i-icon name="circle" width="10px" height="10px" fill="white"></i-icon>
                                    <i-icon name="circle" width="10px" height="10px" fill="white"></i-icon>
                                </i-hstack>
                                `
                        }
                    }
                }
            ];
            const groupedMessage = {
                messages: [{ contentElements: elements, createdAt }],
                sender
            };
            const thread = await this.addThread(npub, groupedMessage, isPrepend);
            return { thread, sender, npub };
        }
        handleEmbeddedElement(module, elm) {
            if (this.onEmbeddedElement)
                this.onEmbeddedElement(module, elm);
        }
        addContext(value) {
            this.messageComposer.addContext(value);
        }
        removeContext(value) {
            this.messageComposer.removeContext(value);
        }
        sendMessage(message) {
            this.messageComposer.setMessage(message);
        }
        handleRemoveContext(value) {
            if (typeof this.onContextRemoved === 'function')
                this.onContextRemoved(value);
        }
        init() {
            this.model = new model_1.Model();
            super.init();
            this.onContextRemoved = this.getAttribute('onContextRemoved', true) || this.onContextRemoved;
            const isGroup = this.getAttribute('isGroup', true);
            if (isGroup != null)
                this.isGroup = isGroup;
            const isAIChat = this.getAttribute('isAIChat', true);
            if (isAIChat != null)
                this.isAIChat = isAIChat;
            const isRestoreShown = this.getAttribute('isRestoreShown', true);
            if (isRestoreShown != null)
                this.isRestoreShown = isRestoreShown;
            const isContextShown = this.getAttribute('isContextShown', true);
            if (isContextShown != null)
                this.isContextShown = isContextShown;
            this.model.onEmbeddedElement = this.handleEmbeddedElement.bind(this);
            this.observer = new IntersectionObserver(this.handleIntersect.bind(this));
            this.observer.observe(this.pnlMessageTop);
            this.messageComposer.model = this.model;
        }
        render() {
            return (this.$render("i-vstack", { width: "100%", height: "100%", class: index_css_4.spinnerStyle },
                this.$render("i-vstack", { id: "messageContainer", background: { color: Theme.background.main }, stack: { grow: "1", basis: "0" }, overflow: { x: 'hidden', y: 'auto' } },
                    this.$render("i-panel", { id: "pnlMessageTop" }),
                    this.$render("i-vstack", { id: "pnlMessage", class: index_css_4.messagePanelStyle, margin: { top: "auto" }, padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, stack: { grow: "1", basis: "0" } })),
                this.$render("i-vstack", { background: { color: Theme.background.main } },
                    this.$render("i-hstack", { border: { top: { width: 1, style: 'solid', color: Theme.divider } }, mediaQueries: [
                            {
                                maxWidth: '767px',
                                properties: {
                                    border: { top: { style: 'none' } }
                                }
                            }
                        ] },
                        this.$render("i-scom-chat--message-composer", { id: "messageComposer", width: "100%", margin: { top: '0.375rem', bottom: '0.375rem', left: '0.5rem', right: '0.5rem' }, onSubmit: this.handleSendMessage, onContextRemoved: this.handleRemoveContext })))));
        }
    };
    ScomChat = __decorate([
        (0, components_9.customElements)('i-scom-chat')
    ], ScomChat);
    exports.ScomChat = ScomChat;
});
