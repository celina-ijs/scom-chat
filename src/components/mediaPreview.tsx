import {
    ControlElement,
    customElements,
    Module,
    Panel,
    Styles
} from '@ijstech/components';
import { MediaType } from '../interface';
import { getEmbedElement } from '../utils';

const Theme = Styles.Theme.ThemeVars;

interface ScomChatMediaPreviewElement extends ControlElement {
    type?: MediaType;
    url?: string;
    onRemoveMedia?: () => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-chat--media-preview']: ScomChatMediaPreviewElement;
        }
    }
}

@customElements('i-scom-chat--media-preview')
export class ScomChatMediaPreview extends Module {
    private pnlMediaPreview: Panel;
    onRemoveMedia: () => void;

    addMedia(type: MediaType, url: string) {
        if (type === MediaType.Image) {
            this.addImage(url);
        } else {
            this.addVideo(url);
        }
    }

    private addImage(url: string) {
        const img = document.createElement('img');
        img.src = url;
        img.style.minWidth = '9rem';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.display = 'block';
        this.pnlMediaPreview.appendChild(img);
    }

    private addVideo(url: string) {
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
        getEmbedElement(elementData, this.pnlMediaPreview);
    }

    private handleRemoveMedia() {
        if (this.onRemoveMedia) this.onRemoveMedia();
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
        <i-panel
            id="pnlMediaPreview"
            position="relative"
            height="9rem"
            width="fit-content"
            overflow="hidden"
            border={{ radius: '1rem' }}
            margin={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
        >
            <i-hstack
                position="absolute"
                width="2rem"
                height="2rem"
                top="0.25rem"
                right="0.25rem"
                border={{ radius: '50%' }}
                horizontalAlignment="center"
                verticalAlignment="center"
                cursor="pointer"
                zIndex={1}
                background={{ color: Theme.colors.secondary.main }}
                hover={{ backgroundColor: Theme.action.hoverBackground }}
                onClick={this.handleRemoveMedia}
            >
                <i-icon width="1rem" height="1rem" name='times' />
            </i-hstack>
        </i-panel>
    }
}