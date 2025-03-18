import { ControlElement, customElements, Module, Panel, Styles, VStack } from '@ijstech/components';
import { messagePanelStyle } from './index.css';
import { LoadingSpinner, ScomChatThread } from './components';
import { Model } from './model';
import { IChatInfo, IDirectMessage, IGroupedMessage, INostrMetadata } from './interface';
import { getUserProfile, groupMessage } from './utils';

const Theme = Styles.Theme.ThemeVars;

interface ScomChatElement extends ControlElement {
    isGroup?: boolean;
    onSendMessage?: (message: string) => void;
    onFetchMessage?: (since?: number, until?: number) => void;
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
    private model: Model;
    private _oldMessage: IDirectMessage;
    private observer: IntersectionObserver;
    private isFetchingMessage: boolean;
    onSendMessage: (message: string) => void;
    onFetchMessage: (since?: number, until?: number) => Promise<IDirectMessage[]>;

    get oldMessage() {
        return this._oldMessage;
    }

    set oldMessage(msg: IDirectMessage) {
        this._oldMessage = msg;
    }

    get isGroup() {
        return this.model.isGroup;
    }

    set isGroup(value: boolean) {
        this.model.isGroup = value;
    }

    constructMessage(content: string, metadataByPubKeyMap: Record<string, INostrMetadata>) {
        return [];
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
        if (!value || !value.messages.length) {
            this.pnlMessage.clearInnerHTML();
        } else {
            let groupedMessage = groupMessage(value.messages);
            this.renderThread(groupedMessage);
        }
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

    private addThread(pubKey: string, info: IGroupedMessage, isPrepend?: boolean) {
        const thread = new ScomChatThread();
        thread.model = this.model;
        thread.onEmbedElement = () => {
            if (!isPrepend) this.scrollToBottom();
        }
        thread.addMessages(pubKey, info);
        if (isPrepend)
            this.pnlMessage.prepend(thread);
        else {
            this.pnlMessage.appendChild(thread);
            this.scrollToBottom();
        }
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

    private async handleSendMessage(message: string, mediaUrls?: string[], event?: Event) {
        const userProfile = getUserProfile();
        const npub = userProfile?.npub;
        const createdAt = Math.round(Date.now() / 1000);
        const newMessage: IGroupedMessage = {
            messages: [],
            sender: npub
        };
        const messages = mediaUrls ? [...mediaUrls] : [];
        if (message) messages.push(message);
        for (let msg of messages) {
            const messageElementData = this.constructMessage(msg, this.model.metadataByPubKeyMap);
            newMessage.messages.push(
                {
                    contentElements: [...messageElementData],
                    createdAt: createdAt
                }
            );
            if (this.onSendMessage) this.onSendMessage(msg);
        }
        this.addThread(npub, newMessage);
    }

    init() {
        this.model = new Model();
        super.init();
        const isGroup = this.getAttribute('isGroup', true);
        if (isGroup != null) this.isGroup = isGroup;
        this.observer = new IntersectionObserver(this.handleIntersect.bind(this));
        this.observer.observe(this.pnlMessageTop);
    }

    render() {
        return (
            <i-vstack width="100%" height="100%">
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
                            width="100%"
                            margin={{ top: '0.375rem', bottom: '0.375rem', left: '0.5rem', right: '0.5rem' }}
                            onSubmit={this.handleSendMessage}
                        ></i-scom-chat--message-composer>
                    </i-hstack>
                </i-vstack>
            </i-vstack>
        )
    }
}