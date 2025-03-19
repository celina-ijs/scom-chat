import { application } from "@ijstech/components";
import { IChatInfo, IDirectMessage, IInterlocutorData, INostrMetadata } from "./interface";
import { getPublicIndexingRelay, getUserProfile } from "./utils";

export class Model {
    private _data: IChatInfo;
    private _extensions: string[] = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'tiff', 'tif', 'mp4', 'webm', 'ogg', 'avi', 'mkv', 'mov', 'm3u8'];
    private _isGroup: boolean = false;
    private _isAIChat: boolean = false;
    private _widgetMap: Map<string, any> = new Map(); // eventId: module

    get extensions() {
        return this._extensions;
    }
    
    get imageExtensions() {
        return this._extensions.slice(0, 8);
    }

    get interlocutor() {
        return this._data.interlocutor;
    }

    set interlocutor(value: IInterlocutorData) {
        if (!this._data) this._data = { messages: [] };
        this._data.interlocutor = value || {} as IInterlocutorData;
    }

    get isGroup() {
        return this._isGroup;
    }

    set isGroup(value: boolean) {
        this._isGroup = value;
    }

    get isAIChat() {
        return this._isAIChat;
    }

    set isAIChat(value: boolean) {
        this._isAIChat = value;
    }

    get messages() {
        return this._data.messages;
    }

    set messages(value: IDirectMessage[]) {
        if (!this._data) this._data = { messages: [] };
        this._data.messages = value;
    }

    get metadataByPubKeyMap() {
        return this._data.metadataByPubKeyMap;
    }

    set metadataByPubKeyMap(map: Record<string, INostrMetadata>) {
        if (!this._data) this._data = { messages: [] };
        this._data.metadataByPubKeyMap = map;
    }

    get dataManager() {
        return application.store?.mainDataManager;
    }

    get widgetMap() {
        return this._widgetMap;
    }

    getData() {
        return this._data;
    }
    
    async setData(value: IChatInfo) {
        this._data = value;
    }

    async fetchPaymentReceiptInfo(paymentRequest: string) {
        const info = await this.dataManager.fetchPaymentReceiptInfo(paymentRequest);
        return info;
    }

    async sendTempMessage(receiverId: string, message: string, replyToEventId?: string, widgetId?: string) {
        const userProfile = getUserProfile();
        await this.dataManager.sendPingRequest(userProfile.pubkey, getPublicIndexingRelay());
        const event = await this.dataManager.sendTempMessage({
            receiverId,
            message,
            replyToEventId,
            widgetId
        });
        return event;
    }
    
}