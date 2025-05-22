import {
    Control,
    ControlElement,
    customElements,
    HStack,
    Input,
    Label,
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
import { customHoverStyle, storageModalStyle } from '../index.css';
import { MediaType } from '../interface';
import { isDevEnv } from '../utils';

const Theme = Styles.Theme.ThemeVars;

type onSubmitCallback = (message: string, mediaUrls?: string[], contexts?: string[], event?: Event) => Promise<void>;

interface ScomChatMessageComposerElement extends ControlElement {
    onSubmit?: onSubmitCallback;
    onEdit?: () => void;
    onContextRemoved?: (value: string) => void;
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
    private pnlEdit: Panel;
    private pnlContextWrap: Panel;
    private lblContextPlaceholder: Label;
    private pnlContext: HStack;
    public onSubmit: onSubmitCallback;
    public onEdit: () => void;
    public onContextRemoved: (value: string) => void;
    private mediaUrl: string;
    private gifUrl: string;
    private scomStorage: ScomStorage;
    private _model: Model;
    private _isSending: boolean = false;

    private addedContexts: string[] = [];
    private contextEls: Record<string, HStack> = {};

    private isPasting: boolean = false;

    get model() {
        return this._model;
    }

    set model(value: Model) {
        this._model = value;
        this.pnlContextWrap.visible = false // this.model.isContextShown;
    }

    get isSending() {
        return this._isSending;
    }

    set isSending(value: boolean) {
        this._isSending = value;
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
        if (event.code === "KeyV" && (event.ctrlKey || event.shiftKey || event.metaKey)) {
            this.isPasting = true;
            return;
        }
        if (event.key === "Enter" && (event.ctrlKey || event.shiftKey || event.metaKey)) return;
        if (event.key === "Enter") {
            event.preventDefault();
        }
        if (event.key !== "Enter") return;
        this.handleSubmit(target, event);
    }

    private handleChanged(target: Input, event: Event) {
        if (!this.model.isContextShown) return;
        const value: string = target.value || '';

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
        } else {
            for (const context of this.addedContexts) {
                if (context.startsWith('http') && !value.includes(context)) {
                    this.handleRemoveContext(context);
                    this.addedContexts = this.addedContexts.filter(item => item !== context);
                }
            }
        }
    }

    private appendContext(value: string, isLink: boolean) {
        this.lblContextPlaceholder.visible = false;
        const elem = <i-hstack
            verticalAlignment='center' gap='4px'
            border={{ radius: '0.25rem', style: 'solid', color: Theme.divider, width: '1px' }}
            padding={{ left: '0.5rem', right: '0.5rem', top: '0.15rem', bottom: '0.15rem' }}
            cursor='pointer'
            display='inline-flex'
            maxWidth={'200px'}
            tag={value}
            class={!isLink ? customHoverStyle : ''}
        >
            <i-icon
                name={isLink ? 'link' : 'file'} width='0.875rem' height='0.875rem'
                stack={{shrink: '0'}} opacity={0.5}
            ></i-icon>
            <i-icon
                name='times' width='0.875rem' height='0.875rem'
                stack={{shrink: '0'}} opacity={0.5}
                onClick={() => {
                    this.handleRemoveContext(value, true)
                    if (typeof this.onContextRemoved === 'function') this.onContextRemoved(value);
                }}
                visible={false}
            ></i-icon>
            <i-label caption={value} font={{ size: '0.75rem' }} textOverflow='ellipsis'></i-label>
        </i-hstack>
        this.pnlContext.appendChild(elem);
        this.contextEls[value] = elem;
    }

    private handleRemoveContext(value: string, isForced?: boolean) {
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

    private updateContext(value: boolean) {
        this.lblContextPlaceholder.visible = !value;
        this.pnlContext.visible = value;
        this.pnlContext.margin = {left: value ? '0.25rem' : '0px'};
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

    public addContext(value: string) {
        if (!this.addedContexts.includes(value)) {
            this.addedContexts.push(value);
            this.appendContext(value, false);
            this.updateContext(true);
        }
    }

    public removeContext(value: string) {
        this.handleRemoveContext(value, true);
    }

    private async submitMessage(event: Event) {
        const gifUrl = this.gifUrl;
        let message = this.edtMessage.value.trim();
        const urlRegex = /(?<!{)(https?:\/\/[^\s{}]+)(?!})/g;
        message = message.replace(urlRegex, (match) => `{${match}}`);
        let mediaUrls = [];
        if (this.mediaUrl) mediaUrls.push(this.mediaUrl);
        if (gifUrl) mediaUrls.push(gifUrl);
        if (!message.length && !mediaUrls.length) return;
        if (this.onSubmit) await this.onSubmit(message, mediaUrls, this.addedContexts, event);
        this.removeMedia();
        this.updateContext(false);
    }

    private async handleSubmit(target: Control, event: Event) {
        if (this.isSending) return;

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

    private handleEdit() {
        if (typeof this.onEdit === 'function') this.onEdit();
    }

    init() {
        super.init();
        this.onEdit = this.getAttribute('onEdit', true) || this.onEdit;
        this.onContextRemoved = this.getAttribute('onContextRemoved', true) || this.onContextRemoved;
        this.onSubmit = this.getAttribute('onSubmit', true) || this.onSubmit;
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
                <i-hstack
                    id="pnlContextWrap"
                    verticalAlignment='center'
                    display='inline-flex'
                    margin={{top: '0.25rem'}}
                    visible={false}
                >
                    <i-hstack
                        id="pnlContextFixed"
                        verticalAlignment='center'
                        padding={{ left: '0.5rem', right: '0.5rem' }}
                        border={{ radius: '0.25rem', style: 'solid', color: Theme.divider, width: '1px' }}
                        cursor='pointer'
                        height={'100%'} gap="4px"
                        display='inline-flex'
                        visible={false}
                    >
                        <i-label caption='@' font={{ size: '0.875rem' }} opacity={0.5}></i-label>
                        <i-label id="lblContextPlaceholder" caption='Add Context' font={{ size: '0.75rem' }}></i-label>
                    </i-hstack>
                    <i-hstack
                        id="pnlContext"
                        margin={{left: '0px'}}
                        verticalAlignment='center' gap='4px'
                        height={'100%'} wrap='wrap'
                    ></i-hstack>
                </i-hstack>
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
                        id="pnlEdit"
                        width="2rem"
                        height="2rem"
                        border={{ radius: '50%' }}
                        horizontalAlignment="center"
                        verticalAlignment="center"
                        cursor="pointer"
                        visible={false}
                        hover={{ backgroundColor: "#C16FFF26" }}
                        tooltip={{ content: '$emoji', placement: 'top' }}
                        onClick={this.handleEdit}
                    >
                        <i-icon width="1rem" height="1rem" name='edit' fill="#C16FFF" />
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
                            background={{ color: 'transparent' }}
                            onKeyDown={this.handleKeyDown}
                            onChanged={this.handleChanged}
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