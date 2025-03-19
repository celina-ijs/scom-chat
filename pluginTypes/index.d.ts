/// <amd-module name="@scom/scom-chat/index.css.ts" />
declare module "@scom/scom-chat/index.css.ts" {
    export const messagePanelStyle: string;
    export const storageModalStyle: string;
    export const imageStyle: string;
    export const messageStyle: string;
    export const customLinkStyle: string;
}
/// <amd-module name="@scom/scom-chat/components/loadingSpinner.tsx" />
declare module "@scom/scom-chat/components/loadingSpinner.tsx" {
    import { ControlElement, Module } from "@ijstech/components";
    export interface ILoadingSpinnerProps {
        height?: string;
        top?: string;
        minHeight?: number | string;
        background?: string;
        zIndex?: number;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-chat--loading-spinner']: ControlElement;
            }
        }
    }
    export class LoadingSpinner extends Module {
        private pnlLoadingSpinner;
        init(): void;
        setProperties(value: ILoadingSpinnerProps): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-chat/interface.ts" />
declare module "@scom/scom-chat/interface.ts" {
    import { IChannelInfo } from "@scom/scom-social-sdk";
    interface INostrMetadataContent {
        name: string;
        display_name: string;
        displayName?: string;
        username?: string;
        website?: string;
        picture?: string;
        about?: string;
        banner?: string;
        lud16?: string;
        nip05?: string;
    }
    export interface INostrMetadata {
        id: string;
        pubkey: string;
        created_at: number;
        kind: number;
        tags: string[][];
        sig: string;
        content: INostrMetadataContent;
    }
    export interface IPostData {
        module: string;
        category?: string;
        data: any;
    }
    export interface IDirectMessage {
        id: string;
        sender: string;
        pubKey?: string;
        createdAt: number;
        contentElements: IPostData[];
    }
    export interface IGroupedMessage {
        messages: {
            contentElements: IPostData[];
            createdAt: number;
        }[];
        sender: string;
        pubKey?: string;
    }
    export interface IInterlocutorData {
        id: string;
        creatorId?: string;
        isGroup?: boolean;
        channelInfo?: IChannelInfo;
    }
    export interface IChatInfo {
        interlocutor?: IInterlocutorData;
        messages: IDirectMessage[];
        metadataByPubKeyMap?: Record<string, INostrMetadata>;
    }
    export enum MediaType {
        Image = "image",
        Video = "video"
    }
}
/// <amd-module name="@scom/scom-chat/utils.ts" />
declare module "@scom/scom-chat/utils.ts" {
    import { Control } from "@ijstech/components";
    import { INostrMetadata } from "@scom/scom-social-sdk";
    import { IDirectMessage, IGroupedMessage, IPostData } from "@scom/scom-chat/interface.ts";
    export function isDevEnv(): boolean;
    export function getUserProfile(): any;
    export function getPublicIndexingRelay(): any;
    export function getMessageTime(time: number): string;
    export function getEmbedElement(postData: IPostData, parent: Control, callback?: any): Promise<any>;
    export function createLabelElements(text: string, styles?: any): Control[];
    export function groupMessage(messages: IDirectMessage[]): IGroupedMessage[];
    export function constructMessage(content: string, metadataByPubKeyMap: Record<string, INostrMetadata>): any[];
}
/// <amd-module name="@scom/scom-chat/components/mediaPreview.tsx" />
declare module "@scom/scom-chat/components/mediaPreview.tsx" {
    import { ControlElement, Module } from '@ijstech/components';
    import { MediaType } from "@scom/scom-chat/interface.ts";
    interface ScomChatMediaPreviewElement extends ControlElement {
        type?: MediaType;
        url?: string;
        onRemoveMedia?: () => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-chat--media-preview']: ScomChatMediaPreviewElement;
            }
        }
    }
    export class ScomChatMediaPreview extends Module {
        private pnlMediaPreview;
        onRemoveMedia: () => void;
        addMedia(type: MediaType, url: string): void;
        private addImage;
        private addVideo;
        private handleRemoveMedia;
        init(): void;
        render(): void;
    }
}
/// <amd-module name="@scom/scom-chat/model.ts" />
declare module "@scom/scom-chat/model.ts" {
    import { IChatInfo, IDirectMessage, IInterlocutorData, INostrMetadata } from "@scom/scom-chat/interface.ts";
    export class Model {
        private _data;
        private _extensions;
        private _isGroup;
        private _isAIChat;
        private _widgetMap;
        get extensions(): string[];
        get imageExtensions(): string[];
        get interlocutor(): IInterlocutorData;
        set interlocutor(value: IInterlocutorData);
        get isGroup(): boolean;
        set isGroup(value: boolean);
        get isAIChat(): boolean;
        set isAIChat(value: boolean);
        get messages(): IDirectMessage[];
        set messages(value: IDirectMessage[]);
        get metadataByPubKeyMap(): Record<string, INostrMetadata>;
        set metadataByPubKeyMap(map: Record<string, INostrMetadata>);
        get dataManager(): any;
        get widgetMap(): Map<string, any>;
        getData(): IChatInfo;
        setData(value: IChatInfo): Promise<void>;
        fetchPaymentReceiptInfo(paymentRequest: string): Promise<any>;
        sendTempMessage(receiverId: string, message: string, replyToEventId?: string, widgetId?: string): Promise<any>;
    }
}
/// <amd-module name="@scom/scom-chat/components/messageComposer.tsx" />
declare module "@scom/scom-chat/components/messageComposer.tsx" {
    import { ControlElement, Module } from '@ijstech/components';
    import { Model } from "@scom/scom-chat/model.ts";
    type onSubmitCallback = (message: string, mediaUrls?: string[], event?: Event) => Promise<void>;
    interface ScomChatMessageComposerElement extends ControlElement {
        onSubmit?: onSubmitCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-chat--message-composer']: ScomChatMessageComposerElement;
            }
        }
    }
    export class ScomChatMessageComposer extends Module {
        private pnlAttachment;
        private mdAttachment;
        private mdEmoji;
        private emojiPicker;
        private gifPicker;
        private pnlPreview;
        private edtMessage;
        onSubmit: onSubmitCallback;
        private mediaUrl;
        private gifUrl;
        private scomStorage;
        private _model;
        get model(): Model;
        set model(value: Model);
        private proccessFile;
        private handleAttachmentClick;
        private handleEmojiClick;
        private handelGifClick;
        private handleKeyDown;
        private submitMessage;
        private handleSubmit;
        private addMedia;
        private removeMedia;
        private handleSelectedEmoji;
        private onGifSelected;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-chat/assets.ts" />
declare module "@scom/scom-chat/assets.ts" {
    function fullPath(path: string): string;
    const _default: {
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-chat/components/thread.tsx" />
declare module "@scom/scom-chat/components/thread.tsx" {
    import { ControlElement, Module } from '@ijstech/components';
    import { Model } from "@scom/scom-chat/model.ts";
    import { IGroupedMessage, IPostData } from "@scom/scom-chat/interface.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-chat--thread']: ControlElement;
            }
        }
    }
    export class ScomChatThread extends Module {
        private pnlThread;
        private pnlContent;
        private _model;
        OnContentRendered: () => void;
        get model(): Model;
        set model(value: Model);
        clear(): void;
        addMessages(pubKey: string, info: IGroupedMessage): void;
        private renderMessages;
        init(): void;
        render(): any;
    }
    export class ScomChatThreadMessage extends Module {
        private pnlThreadMessage;
        private pnlMessage;
        private _model;
        OnContentRendered: () => void;
        get model(): Model;
        set model(value: Model);
        setData(sender: string, pubKey: string, message: {
            contentElements: IPostData[];
            createdAt: number;
        }, isMyThread: boolean, showUserInfo: boolean): void;
        private renderAvatar;
        private appendLabel;
        private renderMessageContent;
        private viewUserProfile;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-chat/components/index.ts" />
declare module "@scom/scom-chat/components/index.ts" {
    export { LoadingSpinner } from "@scom/scom-chat/components/loadingSpinner.tsx";
    export { ScomChatMediaPreview } from "@scom/scom-chat/components/mediaPreview.tsx";
    export { ScomChatMessageComposer } from "@scom/scom-chat/components/messageComposer.tsx";
    export { ScomChatThread } from "@scom/scom-chat/components/thread.tsx";
}
/// <amd-module name="@scom/scom-chat/data.json.ts" />
declare module "@scom/scom-chat/data.json.ts" {
    const _default_1: {
        hi: string;
        hello: string;
        bye: string;
        goodbye: string;
        joke: string;
        "funny one-liner": string;
        "trending now": string;
        "what is the largest mammal on earth?": string;
        "what is the fastest land animal?": string;
        "what is the the only bird that can fly backward?": string;
        "what is the most spoken language in the world?": string;
        "what gets wetter the more it dries?": string;
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-chat" />
declare module "@scom/scom-chat" {
    import { ControlElement, Module } from '@ijstech/components';
    import { IChatInfo, IDirectMessage, IInterlocutorData, INostrMetadata } from "@scom/scom-chat/interface.ts";
    interface ScomChatElement extends ControlElement {
        isGroup?: boolean;
        isAIChat?: boolean;
        onSendMessage?: (message: string) => void;
        onFetchMessage?: (since?: number, until?: number) => Promise<IDirectMessage[]>;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-chat']: ScomChatElement;
            }
        }
    }
    export class ScomChat extends Module {
        private messageContainer;
        private pnlMessageTop;
        private loadingSpinner;
        private pnlMessage;
        private model;
        private _oldMessage;
        private observer;
        private isFetchingMessage;
        onSendMessage: (message: string) => void;
        onFetchMessage: (since?: number, until?: number) => Promise<IDirectMessage[]>;
        get interlocutor(): IInterlocutorData;
        set interlocutor(value: IInterlocutorData);
        set messages(value: IDirectMessage[]);
        get oldMessage(): IDirectMessage;
        set oldMessage(msg: IDirectMessage);
        get metadataByPubKeyMap(): Record<string, INostrMetadata>;
        set metadataByPubKeyMap(map: Record<string, INostrMetadata>);
        get widgetMap(): Map<string, any>;
        get isGroup(): boolean;
        set isGroup(value: boolean);
        get isAIChat(): boolean;
        set isAIChat(value: boolean);
        constructMessage(content: string, metadataByPubKeyMap: Record<string, INostrMetadata>): any[];
        clear(): void;
        getData(): IChatInfo;
        setData(value: IChatInfo): void;
        getTag(): any;
        setTag(value: any): void;
        scrollToBottom(): void;
        addMessages(messages: IDirectMessage[], isPrepend?: boolean): void;
        private renderThread;
        private addThread;
        private handleIntersect;
        private showLoadingSpinner;
        private fetchOldMessages;
        private _constructMessage;
        private handleSendMessage;
        private handleAutoReply;
        init(): void;
        render(): any;
    }
}
