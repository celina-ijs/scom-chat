/// <amd-module name="@scom/scom-chat/index.css.ts" />
declare module "@scom/scom-chat/index.css.ts" {
    export const messagePanelStyle: string;
    export const storageModalStyle: string;
    export const imageStyle: string;
    export const messageStyle: string;
    export const customLinkStyle: string;
    export const spinnerStyle: string;
    export const customHoverStyle: string;
    export const customButtonStyle: string;
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
        isRestoreShown?: boolean;
        tag?: any;
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
    import { Button, Control } from "@ijstech/components";
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
    export function createContexts(contexts: string[]): {
        module: string;
        data: {
            properties: {
                linkButtons: {
                    caption: string;
                    maxWidth: string;
                    background: {
                        color: string;
                    };
                    border: {
                        radius: string;
                        style: string;
                        color: string;
                        width: string;
                    };
                    padding: {
                        left: string;
                        right: string;
                    };
                    font: {
                        size: string;
                    };
                    icon: {
                        name: string;
                        width: string;
                        height: string;
                        stack: {
                            shrink: string;
                        };
                    };
                    class: string;
                    onClick: (target: Button) => Promise<void>;
                }[];
            };
            tag: {
                width: string;
                pt: number;
                pb: number;
                pl: number;
                pr: number;
            };
        };
    };
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
        private _isContextShown;
        private _widgetMap;
        onEmbeddedElement: (module: string, elm: any) => void;
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
        get isContextShown(): boolean;
        set isContextShown(value: boolean);
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
    type onSubmitCallback = (message: string, mediaUrls?: string[], contexts?: string[], event?: Event) => Promise<void>;
    interface ScomChatMessageComposerElement extends ControlElement {
        onSubmit?: onSubmitCallback;
        onEdit?: () => void;
        onContextRemoved?: (value: string) => void;
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
        private pnlEdit;
        private pnlContextWrap;
        private lblContextPlaceholder;
        private pnlContext;
        private pnlSend;
        onSubmit: onSubmitCallback;
        onEdit: () => void;
        onContextRemoved: (value: string) => void;
        private mediaUrl;
        private gifUrl;
        private scomStorage;
        private _model;
        private _isSending;
        private addedContexts;
        private contextEls;
        private isPasting;
        get model(): Model;
        set model(value: Model);
        get isSending(): boolean;
        set isSending(value: boolean);
        private proccessFile;
        private handleAttachmentClick;
        private handleEmojiClick;
        private handelGifClick;
        private handleKeyDown;
        private handleChanged;
        private appendContext;
        private handleRemoveContext;
        private updateContext;
        addContext(value: string): void;
        removeContext(value: string): void;
        private submitMessage;
        setMessage(message: string): void;
        private handleSubmit;
        private addMedia;
        private removeMedia;
        private handleSelectedEmoji;
        private onGifSelected;
        private handleEdit;
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
/// <amd-module name="@scom/scom-chat/language.json.ts" />
declare module "@scom/scom-chat/language.json.ts" {
    const _default_1: {
        en: {
            restore_checkpoint: string;
            redo_checkpoint: string;
        };
        "zh-hant": {
            restore_checkpoint: string;
            redo_checkpoint: string;
        };
        vi: {
            restore_checkpoint: string;
            redo_checkpoint: string;
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-chat/components/thread.tsx" />
declare module "@scom/scom-chat/components/thread.tsx" {
    import { ControlElement, Module } from '@ijstech/components';
    import { Model } from "@scom/scom-chat/model.ts";
    import { IGroupedMessage, IPostData } from "@scom/scom-chat/interface.ts";
    type onRestoreCallback = (data: any) => Promise<boolean>;
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
        onContentRendered: () => void;
        onRestore: onRestoreCallback;
        get model(): Model;
        set model(value: Model);
        clear(): void;
        toggleEnable(value: boolean): void;
        addMessages(pubKey: string, info: IGroupedMessage, showTime?: boolean): void;
        private renderMessages;
        init(): void;
        render(): any;
    }
    export class ScomChatThreadMessage extends Module {
        private pnlContainer;
        private pnlThreadMessage;
        private pnlMessage;
        private btnRestore;
        private _model;
        private _isRestoreShown;
        onContentRendered: () => void;
        onRestore: onRestoreCallback;
        get model(): Model;
        set model(value: Model);
        get isRestoreShown(): boolean;
        set isRestoreShown(value: boolean);
        setData(sender: string, pubKey: string, message: {
            contentElements: IPostData[];
            createdAt: number;
        }, isMyThread: boolean, showUserInfo: boolean): void;
        private renderAvatar;
        private appendLabel;
        private renderMessageContent;
        private viewUserProfile;
        private handleRestore;
        toggleEnable(value: boolean): void;
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
    const _default_2: {
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
    export default _default_2;
}
/// <amd-module name="@scom/scom-chat" />
declare module "@scom/scom-chat" {
    import { ControlElement, Module } from '@ijstech/components';
    import { ScomChatThread } from "@scom/scom-chat/components/index.ts";
    import { IChatInfo, IDirectMessage, IInterlocutorData, INostrMetadata } from "@scom/scom-chat/interface.ts";
    type onRestoreCallback = (data: any) => Promise<boolean>;
    interface ScomChatElement extends ControlElement {
        isGroup?: boolean;
        isAIChat?: boolean;
        isRestoreShown?: boolean;
        isContextShown?: boolean;
        onRestore?: onRestoreCallback;
        onSendMessage?: (message: string) => void;
        onFetchMessage?: (since?: number, until?: number) => Promise<IDirectMessage[]>;
        onEmbeddedElement?: (module: string, elm: any) => void;
        onContextRemoved?: (value: string) => void;
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
        private messageComposer;
        private model;
        private _oldMessage;
        private _isSending;
        private _isRestoreShown;
        private observer;
        private isFetchingMessage;
        onSendMessage: (message: string) => void;
        onFetchMessage: (since?: number, until?: number) => Promise<IDirectMessage[]>;
        onEmbeddedElement: (module: string, elm: any) => void;
        onRestore: onRestoreCallback;
        onContextRemoved: (value: string) => void;
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
        get isRestoreShown(): boolean;
        set isRestoreShown(value: boolean);
        get isContextShown(): boolean;
        set isContextShown(value: boolean);
        set isSending(value: boolean);
        get isSending(): boolean;
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
        appendTypingMessage(isPrepend?: boolean): Promise<{
            thread: ScomChatThread;
            sender: string;
            npub: any;
        }>;
        private handleEmbeddedElement;
        addContext(value: string): void;
        removeContext(value: string): void;
        sendMessage(message: string): void;
        private handleRemoveContext;
        init(): void;
        render(): any;
    }
}
