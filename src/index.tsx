import { ControlElement, customElements, HStack, Module, Panel, Styles, VStack } from '@ijstech/components';
import { messagePanelStyle, spinnerStyle } from './index.css';
import { LoadingSpinner, ScomChatMessageComposer, ScomChatThread } from './components';
import { Model } from './model';
import { IChatInfo, IDirectMessage, IGroupedMessage, IInterlocutorData, INostrMetadata } from './interface';
import { constructMessage, createContexts, getUserProfile, groupMessage } from './utils';
import replyData from './data.json';

const Theme = Styles.Theme.ThemeVars;

type onRestoreCallback = (data: any) => Promise<boolean>;

interface ScomChatElement extends ControlElement {
    isGroup?: boolean;
    isAIChat?: boolean;
    isRestoreShown?: boolean;
    isContextShown?: boolean;
    onRestore?: onRestoreCallback;
    onSendMessage?: (message: string) => void;
    onFetchMessage?: (since?: number, until?: number) => Promise<IDirectMessage[]>;
    onEmbeddedElement?: (module: string,  elm: any) => void;
    onContextRemoved?: (value: string) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-chat']: ScomChatElement;
        }
    }
}

@customElements('i-scom-chat')
export class ScomChat extends Module {
    private messageContainer: VStack;
    private pnlMessageTop: Panel;
    private loadingSpinner: LoadingSpinner;
    private pnlMessage: VStack;
    private messageComposer: ScomChatMessageComposer;
    private model: Model;
    private _oldMessage: IDirectMessage;
    private _isSending: boolean = false;
    private _isRestoreShown: boolean = false;
    private observer: IntersectionObserver;
    private isFetchingMessage: boolean;
    onSendMessage: (message: string) => void;
    onFetchMessage: (since?: number, until?: number) => Promise<IDirectMessage[]>;
    onEmbeddedElement: (module: string,  elm: any) => void;
    onRestore: onRestoreCallback;
    onContextRemoved: (value: string) => void;

    get interlocutor() {
        return this.model.interlocutor;
    }

    set interlocutor(value: IInterlocutorData) {
        this.model.interlocutor = value;
    }

    set messages(value: IDirectMessage[]) {
        if (!value || !value.length) {
            this.pnlMessage.clearInnerHTML();
        } else {
            let groupedMessage = groupMessage(value);
            this.renderThread(groupedMessage);
        }
    }

    get oldMessage() {
        return this._oldMessage;
    }

    set oldMessage(msg: IDirectMessage) {
        this._oldMessage = msg;
    }

    get metadataByPubKeyMap() {
        return this.model.metadataByPubKeyMap;
    }

    set metadataByPubKeyMap(map: Record<string, INostrMetadata>) {
        this.model.metadataByPubKeyMap = map;
    }

    get widgetMap() {
        return this.model.widgetMap;
    }

    get isGroup() {
        return this.model.isGroup;
    }

    set isGroup(value: boolean) {
        this.model.isGroup = value;
    }

    get isAIChat() {
        return this.model.isAIChat;
    }

    set isAIChat(value: boolean) {
        this.model.isAIChat = value;
    }

    get isRestoreShown() {
        return this._isRestoreShown;
    }

    set isRestoreShown(value: boolean) {
        this._isRestoreShown = value;
    }

    get isContextShown() {
        return this.model.isContextShown;
    }
    
    set isContextShown(value: boolean) {
        this.model.isContextShown = value;
    }

    set isSending(value: boolean) {
        this._isSending = value;
        if (this.messageComposer) this.messageComposer.isSending = value;
    }

    get isSending() {
        return this._isSending;
    }

    constructMessage(content: string, metadataByPubKeyMap: Record<string, INostrMetadata>) {
        return constructMessage(content, metadataByPubKeyMap);
    }
    
    clear() {
        this.oldMessage = null;
        this.pnlMessage.clearInnerHTML();
    }
    
    getData() {
        return this.model.getData();
    }
    
    setData(value: IChatInfo) {
        this.model.setData(value);
        this.messages = value.messages;
    }

    getTag() {
        return this.tag;
    }

    setTag(value: any) {
        this.tag = value;
    }

    scrollToBottom() {
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }

    addMessages(messages: IDirectMessage[], isPrepend?: boolean) {
        const userProfile = getUserProfile();
        const npub = userProfile?.npub;
        let groupedMessage = groupMessage(messages);
        for (let info of groupedMessage) {
            this.addThread(npub, info, isPrepend);
        }
    }

    private renderThread(groupedMessage: IGroupedMessage[]) {
        this.pnlMessage.clearInnerHTML();
        if (!groupedMessage) return;
        const userProfile = getUserProfile();
        const npub = userProfile?.npub;
        for (let info of groupedMessage) {
            this.addThread(npub, info);
        }
    }

    private async addThread(pubKey: string, info: IGroupedMessage, isPrepend?: boolean) {
        const thread = new ScomChatThread();
        thread.model = this.model;
        thread.onContentRendered = () => {
            if (!isPrepend) this.scrollToBottom();
        }
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

    private handleIntersect(entries: IntersectionObserverEntry[]) {
        entries.forEach(entry => {
            if (entry.isIntersecting && this.oldMessage?.createdAt > 0) {
                this.fetchOldMessages(this.oldMessage.createdAt);
            }
        })
    }

    private showLoadingSpinner() {
        if (!this.loadingSpinner) {
            this.loadingSpinner = new LoadingSpinner();
            this.pnlMessageTop.append(this.loadingSpinner);
            this.loadingSpinner.setProperties({
                minHeight: 40
            });
            this.loadingSpinner.height = 40;
        }
        this.loadingSpinner.display = 'block';
    }

    private async fetchOldMessages(until: number) {
        if (this.isFetchingMessage) return;
        this.isFetchingMessage = true;
        this.showLoadingSpinner();
        const userProfile = getUserProfile();
        const npub = userProfile?.npub;
        let messages: IDirectMessage[] = [];
        if (this.onFetchMessage) messages = await this.onFetchMessage(0, until);
        const filteredMessages = messages.filter(msg => msg.id !== this.oldMessage?.id);
        if (filteredMessages.length) {
            this.oldMessage = filteredMessages[filteredMessages.length - 1];
            let groupedMessage = groupMessage(filteredMessages);
            let firstMessage = this.pnlMessage.firstElementChild;
            for (let i = groupedMessage.length - 1; i >= 0; i--) {
                this.addThread(npub, groupedMessage[i], true);
            }
            if (firstMessage) firstMessage.scrollIntoView();
        }
        this.loadingSpinner.display = 'none';
        this.isFetchingMessage = false;
    }

    private _constructMessage(msg: string, createdAt: number, contexts?: string[]) {
        const messageElementData = this.constructMessage(msg, this.model.metadataByPubKeyMap);
        if (contexts?.length) {
            messageElementData.unshift(createContexts(contexts));
        }
        return {
            contentElements: [...messageElementData],
            createdAt: createdAt
        };
    }

    private async handleSendMessage(message: string, mediaUrls?: string[], contexts?: string[], event?: Event) {
        const userProfile = getUserProfile();
        const npub = userProfile?.npub;
        const createdAt = Math.round(Date.now() / 1000);
        const newMessage: IGroupedMessage = {
            messages: [],
            sender: npub,
            isRestoreShown: this.isRestoreShown
        };
        const messages = mediaUrls ? [...mediaUrls] : [];
        if (message) messages.push(message);
        for (let msg of messages) {
            newMessage.messages.push(this._constructMessage(msg, createdAt, contexts));
            if (this.onSendMessage) this.onSendMessage(msg);
            newMessage.tag = this.tag;
        }
        this.addThread(npub, newMessage);
        if (this.isAIChat) setTimeout(() => this.handleAutoReply(message), 300);
    }

    private async handleAutoReply(usermessage: string) {
        const userProfile = getUserProfile();
        const npub = userProfile?.npub;
        const createdAt = Math.round(Date.now() / 1000);
        let groupedMessage: IGroupedMessage = {
            messages: [this._constructMessage("Typing...", createdAt)],
            sender: this.model.interlocutor.id || "npub123"
        };
        const message = usermessage.trim().toLowerCase();
        const thread = await this.addThread(npub, groupedMessage);
        setTimeout(() => {
            thread.clear();
            const reply = replyData[message] || "I couldn't find the specific information you're looking for.\nThis might be due to the complexity of the question, outdated information, or limitations in my current knowledge base.";
            groupedMessage.messages = [this._constructMessage(reply, createdAt)];
            thread.addMessages(npub, groupedMessage);
        }, 700);
    }

    async appendTypingMessage(isPrepend?: boolean) {
        const userProfile = getUserProfile();
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
        ]
        const groupedMessage: IGroupedMessage = {
            messages: [{ contentElements: elements, createdAt }],
            sender
        };
        const thread = await this.addThread(npub, groupedMessage, isPrepend);
        return { thread, sender, npub };
    }

    private handleEmbeddedElement(module: string,  elm: any) {
        if (this.onEmbeddedElement) this.onEmbeddedElement(module, elm);
    }

    addContext(value: string) {
        this.messageComposer.addContext(value);
    }

    removeContext(value: string) {
        this.messageComposer.removeContext(value);
    }

    private handleRemoveContext(value: string) {
        if (typeof this.onContextRemoved === 'function') this.onContextRemoved(value);
    }

    init() {
        this.model = new Model();
        super.init();
        this.onContextRemoved = this.getAttribute('onContextRemoved', true) || this.onContextRemoved;
        const isGroup = this.getAttribute('isGroup', true);
        if (isGroup != null) this.isGroup = isGroup;
        const isAIChat = this.getAttribute('isAIChat', true);
        if (isAIChat != null) this.isAIChat = isAIChat;
        const isRestoreShown = this.getAttribute('isRestoreShown', true);
        if (isRestoreShown != null) this.isRestoreShown = isRestoreShown;
        const isContextShown = this.getAttribute('isContextShown', true);
        if (isContextShown != null) this.isContextShown = isContextShown;
        this.model.onEmbeddedElement = this.handleEmbeddedElement.bind(this);
        this.observer = new IntersectionObserver(this.handleIntersect.bind(this));
        this.observer.observe(this.pnlMessageTop);
        this.messageComposer.model = this.model;
    }

    render() {
        return (
            <i-vstack width="100%" height="100%" class={spinnerStyle}>
                <i-vstack
                    id="messageContainer"
                    background={{ color: Theme.background.main }}
                    stack={{ grow: "1", basis: "0" }}
                    overflow={{ x: 'hidden', y: 'auto' }}
                >
                    <i-panel id="pnlMessageTop"></i-panel>
                    <i-vstack
                        id="pnlMessage"
                        class={messagePanelStyle}
                        margin={{ top: "auto" }}
                        padding={{ top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }}
                        stack={{ grow: "1", basis: "0" }}
                    ></i-vstack>
                </i-vstack>
                <i-vstack background={{ color: Theme.background.main }}>
                    <i-hstack
                        border={{ top: { width: 1, style: 'solid', color: Theme.divider } }}
                        mediaQueries={[
                            {
                                maxWidth: '767px',
                                properties: {
                                    border: { top: { style: 'none' } }
                                }
                            }
                        ]}
                    >
                        <i-scom-chat--message-composer
                            id="messageComposer"
                            width="100%"
                            margin={{ top: '0.375rem', bottom: '0.375rem', left: '0.5rem', right: '0.5rem' }}
                            onSubmit={this.handleSendMessage}
                            onContextRemoved={this.handleRemoveContext}
                        ></i-scom-chat--message-composer>
                    </i-hstack>
                </i-vstack>
            </i-vstack>
        )
    }
}