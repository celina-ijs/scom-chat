import { application, Button, Control, Label, moment, Styles } from "@ijstech/components";
import { INostrEvent, INostrMetadata } from "@scom/scom-social-sdk";
import { IDirectMessage, IGroupedMessage, IPostData } from "./interface";
import { customButtonStyle } from "./index.css";

const Theme = Styles.Theme.ThemeVars;

export function isDevEnv() {
    return application.store.env === 'dev';
}

export function getUserProfile() {
    return application.store.userProfile;
}

export function getPublicIndexingRelay() {
    return application.store.publicIndexingRelay;
}

export function getMessageTime(time: number) {
    const targetDate = moment.unix(time);
    const currentDate = moment(new Date());
    if (targetDate.year() < currentDate.year()) {
        return targetDate.format("DD MMM YYYY, hh:mm A");
    }
    if (targetDate.month() < currentDate.month() || targetDate.date() < currentDate.date()) {
        return targetDate.format("DD MMM, hh:mm A");
    }
    return targetDate.format("hh:mm A");
}

function getThemeValues(theme: any) {
    if (!theme || typeof theme !== 'object') return null;
    let values = {};
    for (let prop in theme) {
        if (theme[prop]) values[prop] = theme[prop];
    }
    return Object.keys(values).length ? values : null;
}

export async function getEmbedElement(postData: IPostData, parent: Control, callback?: any) {
    const { module, data } = postData;
    const elm = await application.createElement(module, true) as any;
    if (!elm) throw new Error('not found');
    elm.parent = parent;
    if (elm.ready) await elm.ready();
    const builderTarget = elm.getConfigurators ? elm.getConfigurators().find((conf: any) => conf.target === 'Builders' || conf.target === 'Editor') : null;
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
    if (callback) callback(elm);
    return elm;
}

export function createLabelElements(text: string, styles?: any) {
    const linkRegex = /https?:\/\/\S+/gi;
    const elements: Control[] = [];
    let match;
    const matches: any[] = [];
    const labelStyles = {
        display: 'inline',
        overflowWrap: 'break-word',
        font: { size: '0.875rem', weight: 400 },
        lineHeight: '1.25rem',
        padding: { right: '4px' },
        ...(styles || {})
    }
    while ((match = linkRegex.exec(text)) !== null) {
        matches.push({
            type: 'link',
            index: match.index,
            length: match[0].length,
            data: { url: match[0], caption: match[0] }
        })
    }
    matches.sort((a, b) => a.index - b.index);
    let lastIndex = 0;
    matches.forEach(match => {
        if (match.index > lastIndex) {
            const textContent = text.slice(lastIndex, match.index);
            if (textContent.trim().length > 0) {
                elements.push(
                    new Label(undefined, {
                        caption: textContent,
                        ...labelStyles
                    })
                );
            }
        }
        if (match.type === 'link') {
            const link = new Label(undefined, {
                link: { href: match.data.url, target: '_blank' },
                caption: match.data.caption,
                ...labelStyles,
                font: { color: Theme.colors.primary.main, size: '0.875rem', weight: 400 }
            });
            elements.push(link);
        }
        lastIndex = match.index + match.length;
    })

    if (lastIndex < text.length) {
        let textContent = text.slice(lastIndex);
        if (textContent.trim().length > 0) {
            elements.push(
                new Label(undefined, {
                    caption: textContent,
                    ...labelStyles
                })
            );
        }
    }
    return elements;
}

export function groupMessage(messages: IDirectMessage[]) {
    const groupedMessage: IGroupedMessage[] = [];
    let pubKey: string;
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

function createTextElement(text: string, isMarkdown: boolean = false) {
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

function extractMediaFromContent(content: string, metadataByPubKeyMap: Record<string, INostrMetadata>, eventData?: INostrEvent) {
    const elements: any[] = [];
    let textContent = content.slice();
    if (textContent.trim().length > 0) {
        elements.push(createTextElement(textContent));
    }
    return elements;
}

export function constructMessage(content: string, metadataByPubKeyMap: Record<string, INostrMetadata>) {
    const messageElementData = extractMediaFromContent(content, metadataByPubKeyMap);
    return messageElementData;
}

export function createContexts(contexts: string[]) {
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
                        class: customButtonStyle,
                        onClick: async (target: Button) => {
                            if (context.length <= 18) return;

                            const oldName = target.icon.name;
                            await application.copyToClipboard(context);
                            target.icon.name = "check";
                            target.icon.fill = Theme.colors.success.main;
                            setTimeout(() => {
                                target.icon.name = oldName;
                                target.icon.fill = Theme.text.primary;
                            }, 1600)
                        }
                    }
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