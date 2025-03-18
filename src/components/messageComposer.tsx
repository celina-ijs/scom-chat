import {
    Control,
    ControlElement,
    customElements,
    HStack,
    Input,
    Modal,
    Module,
    Panel,
    Styles
} from '@ijstech/components';
import { ScomStorage } from "@scom/scom-storage";
import EmojiPicker from '@scom/scom-emoji-picker';
import { ScomGifPicker } from '@scom/scom-gif-picker';
import { Model } from '../model';
import { ScomChatMediaPreview } from './mediaPreview';
import { storageModalStyle } from '../index.css';
import { MediaType } from '../interface';
import { isDevEnv } from '../utils';

const Theme = Styles.Theme.ThemeVars;

type onSubmitCallback = (message: string, mediaUrls?: string[], event?: Event) => Promise<void>;

interface ScomChatMessageComposerElement extends ControlElement {
    onSubmit?: onSubmitCallback;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
        ['i-scom-chat--message-composer']: ScomChatMessageComposerElement;
        }
    }
}

@customElements('i-scom-chat--message-composer')
export class ScomChatMessageComposer extends Module {
    private pnlAttachment: HStack;
    private mdAttachment: Modal;
    private mdEmoji: Modal;
    private emojiPicker: EmojiPicker;
    private gifPicker: ScomGifPicker;
    private pnlPreview: Panel;
    private edtMessage: Input;
    public onSubmit: onSubmitCallback;
    private mediaUrl: string;
    private gifUrl: string;
    private scomStorage: ScomStorage;
    private _model: Model;

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
    }

    private proccessFile() {
        if (!this.scomStorage) {
            this.scomStorage = ScomStorage.getInstance();
            this.scomStorage.onCancel = () => {
                this.scomStorage.closeModal();
            }
        }
        this.scomStorage.uploadMultiple = false;
        this.scomStorage.onUploadedFile = (path: string) => {
            const ext = path.split('.').pop().toLowerCase();
            if (this.model.extensions.includes(ext)) {
                this.mediaUrl = path;
                const type = this.model.imageExtensions.includes(ext) ? MediaType.Image : MediaType.Video;
                this.addMedia(type, path);
                this.scomStorage.closeModal();
                this.pnlAttachment.visible = false;
            }
        }
        this.scomStorage.onOpen = (path: string) => {
            const ext = path.split('.').pop().toLowerCase();
            if (this.model.extensions.includes(ext)) {
                this.mediaUrl = path;
                const type = this.model.imageExtensions.includes(ext) ? MediaType.Image : MediaType.Video;
                this.addMedia(type, path);
                this.scomStorage.closeModal();
                this.pnlAttachment.visible = false;
            }
        }
        this.scomStorage.openModal({
            width: 800,
            maxWidth: '100%',
            height: '90vh',
            overflow: 'hidden',
            zIndex: 1002,
            closeIcon: {width: '1rem', height: '1rem', name: 'times', fill: Theme.text.primary, margin: {bottom: '0.5rem'}},
            class: storageModalStyle
        });
        this.scomStorage.onShow();
    }

    private handleAttachmentClick() {
        this.mdAttachment.visible = true;
    }

    private handleEmojiClick() {
        this.emojiPicker.clearSearch();
        this.mdEmoji.visible = true;
    }

    private handelGifClick() {
        if (!this.gifPicker) {
            this.gifPicker = new ScomGifPicker();
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

    private handleKeyDown(target: Input, event: KeyboardEvent) {
        if (event.key === "Enter" && (event.ctrlKey || event.shiftKey || event.metaKey)) return;
        if (event.key === "Enter") {
            event.preventDefault();
        }
        if (event.key !== "Enter") return;
        this.handleSubmit(target, event);
    }
    
    private async submitMessage(event: Event) {
        const gifUrl = this.gifUrl;
        const message = this.edtMessage.value.trim();
        let mediaUrls = [];
        if (this.mediaUrl) mediaUrls.push(this.mediaUrl);
        if (gifUrl) mediaUrls.push(gifUrl);
        if (!message.length && !mediaUrls.length) return;
        if (this.onSubmit) await this.onSubmit(message, mediaUrls, event);
        this.removeMedia();
    }

    private async handleSubmit(target: Control, event: Event) {
        try {
            this.submitMessage(event);
            this.edtMessage.value = "";
            this.edtMessage.height = 'auto';
        } catch (err) {
            console.error(err);
        }
    }
    
    private addMedia(type: MediaType, url: string) {
        this.pnlPreview.clearInnerHTML();
        const mediaPreview = new ScomChatMediaPreview(undefined, {
            type: type,
            url: url,
            onRemoveMedia: this.removeMedia.bind(this)
        });
        this.pnlPreview.appendChild(mediaPreview);
    }

    private removeMedia() {
        this.mediaUrl = "";
        this.gifUrl = "";
        this.pnlPreview.clearInnerHTML();
        this.pnlPreview.visible = false;
        this.pnlAttachment.visible = isDevEnv();
    }

    private handleSelectedEmoji(value: string) {
        this.edtMessage.value = this.edtMessage.value + value;
    }

    private onGifSelected(gif: any) {
        const url = gif.images.original.url;
        this.gifUrl = url;
        const smallUrl = gif.images.preview_webp.url;
        this.addMedia(MediaType.Image, smallUrl);
        this.gifPicker.closeModal();
    }

    init() {
        super.init();
        this.pnlAttachment.visible = isDevEnv();
    }

    render() {
        return (
            <i-vstack
                background={{ color: Theme.input.background }}
                padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }}
                border={{ radius: '1rem' }}
                mediaQueries={[
                    {
                        maxWidth: '767px',
                        properties: {
                            padding: { top: '0.25rem', bottom: '0.25rem', left: '0.25rem', right: '0.25rem' }
                        }
                    }
                ]}
            >
                <i-panel id="pnlPreview" minHeight="auto" visible={false}></i-panel>
                <i-hstack width="100%" verticalAlignment="center" gap="4px">
                    <i-hstack
                        id="pnlAttachment"
                        position="relative"
                        width="2rem"
                        height="2rem"
                        border={{ radius: '50%' }}
                        horizontalAlignment="center"
                        verticalAlignment="center"
                        cursor="pointer"
                        hover={{ backgroundColor: "#C16FFF26" }}
                        tooltip={{ content: '$attachment', placement: 'top' }}
                        onClick={this.handleAttachmentClick}
                    >
                        <i-icon width="1rem" height="1rem" name='paperclip' fill="#C16FFF" />
                        <i-modal
                            id="mdAttachment"
                            maxWidth="15rem"
                            minWidth="12.25rem"
                            maxHeight="27.5rem"
                            popupPlacement='topLeft'
                            showBackdrop={false}
                            border={{ radius: '1rem' }}
                            boxShadow='rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px'
                            padding={{ top: 0, left: 0, right: 0, bottom: 0 }}
                            margin={{ bottom: '0.25rem' }}
                            closeOnScrollChildFixed={true}
                            overflow={{ y: 'hidden' }}
                            visible={false}
                        >
                            <i-vstack>
                                <i-hstack
                                    verticalAlignment="center"
                                    width="100%"
                                    padding={{ top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }}
                                    border={{ radius: '0.125rem' }}
                                    gap="0.75rem"
                                    cursor="pointer"
                                    hover={{
                                        fontColor: Theme.text.primary,
                                        backgroundColor: Theme.action.hoverBackground
                                    }}
                                    onClick={this.proccessFile}
                                    mediaQueries={[
                                        {
                                            maxWidth: '767px',
                                            properties: {
                                                padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }
                                            }
                                        }
                                    ]}
                                >
                                    <i-hstack
                                        width="2rem"
                                        height="2rem"
                                        horizontalAlignment="center"
                                        verticalAlignment="center"
                                        tooltip={{ content: '$media', placement: 'top' }}
                                    >
                                        <i-icon width="1rem" height="1rem" name='image' fill="#C16FFF" />
                                    </i-hstack>
                                    <i-label caption="$media" font={{ color: Theme.colors.secondary.light, weight: 400, size: '0.875rem' }}></i-label>
                                </i-hstack>
                                <i-hstack
                                    verticalAlignment="center"
                                    width="100%"
                                    padding={{ top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }}
                                    border={{ radius: '0.125rem' }}
                                    gap="0.75rem"
                                    cursor="pointer"
                                    hover={{
                                        fontColor: Theme.text.primary,
                                        backgroundColor: Theme.action.hoverBackground
                                    }}
                                    onClick={this.handelGifClick}
                                    mediaQueries={[
                                        {
                                            maxWidth: '767px',
                                            properties: {
                                                padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }
                                            }
                                        }
                                    ]}
                                >
                                    <i-hstack
                                        width="2rem"
                                        height="2rem"
                                        horizontalAlignment="center"
                                        verticalAlignment="center"
                                        tooltip={{ content: '$media', placement: 'top' }}
                                    >
                                        <i-icon width="1rem" height="1rem" name='images' fill="#C16FFF" />
                                    </i-hstack>
                                    <i-label caption="$gif" font={{ color: Theme.colors.secondary.light, weight: 400, size: '0.875rem' }}></i-label>
                                </i-hstack>
                            </i-vstack>
                        </i-modal>
                    </i-hstack>
                    <i-hstack
                        width="2rem"
                        height="2rem"
                        position="relative"
                    >
                        <i-hstack
                            width="2rem"
                            height="2rem"
                            border={{ radius: '50%' }}
                            horizontalAlignment="center"
                            verticalAlignment="center"
                            cursor="pointer"
                            hover={{ backgroundColor: "#C16FFF26" }}
                            tooltip={{ content: '$emoji', placement: 'top' }}
                            onClick={this.handleEmojiClick}
                        >
                            <i-icon width="1rem" height="1rem" name='smile' fill="#C16FFF" />
                        </i-hstack>
                        <i-modal
                            id="mdEmoji"
                            width="20rem"
                            popupPlacement='topLeft'
                            showBackdrop={false}
                            border={{ radius: '1rem' }}
                            boxShadow='rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px'
                            padding={{ top: 0, left: 0, right: 0, bottom: 0 }}
                            margin={{ bottom: '0.25rem' }}
                            closeOnScrollChildFixed={true}
                            overflow={{ y: 'hidden' }}
                            visible={false}
                        >
                            <i-scom-emoji-picker id="emojiPicker" onEmojiSelected={this.handleSelectedEmoji}></i-scom-emoji-picker>
                        </i-modal>
                    </i-hstack>
                    <i-hstack verticalAlignment="center" stack={{ grow: "1" }}>
                        <i-input
                            id="edtMessage"
                            width="100%"
                            height="auto"
                            maxHeight={130}
                            display="flex"
                            rows={1}
                            padding={{ left: '0.25rem', right: '0.25rem' }}
                            border={{ style: 'none' }}
                            placeholder="$type_a_message"
                            inputType="textarea"
                            resize='auto-grow'
                            onKeyDown={this.handleKeyDown}
                        ></i-input>
                    </i-hstack>
                    <i-hstack
                        width="2rem"
                        height="2rem"
                        border={{ radius: '50%' }}
                        horizontalAlignment="center"
                        verticalAlignment="center"
                        cursor="pointer"
                        hover={{ backgroundColor: "#C16FFF26" }}
                        onClick={this.handleSubmit}
                        tooltip={{ content: '$send', placement: 'top' }}
                    >
                        <i-icon width="1rem" height="1rem" name='paper-plane' fill="#C16FFF" />
                    </i-hstack>
                </i-hstack>
            </i-vstack>
        )
    }
}