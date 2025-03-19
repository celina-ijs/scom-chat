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
	messages: { contentElements: IPostData[]; createdAt: number; }[];
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