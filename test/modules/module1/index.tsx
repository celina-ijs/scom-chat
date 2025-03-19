import { Module, customModule, Styles } from '@ijstech/components';
import { ScomChat } from '@scom/scom-chat';

const Theme = Styles.Theme.ThemeVars;

@customModule
export default class Module1 extends Module {
    private scomChat: ScomChat;

    sendMessage(message: string) {
        console.log(message);
    }
    
    fetchMessage(since?: number, until?: number) {
        return [];
    }

    init() {
        super.init();
        this.scomChat.setData({
            interlocutor: {
                id: 'npub123'
            },
            messages: [],
            metadataByPubKeyMap: {
                'user1': {
                    "kind": 0,
                    "created_at": 1731049079,
                    "content": {
                        "name": "sc-bot",
                        "display_name": "SC Bot",
                        "picture": "",
                        "about": "",
                        "banner": "",
                    },
                    "tags": [],
                    "pubkey": "user1",
                    "id": "id1",
                    "sig": "d36020525729182"
                }
            }
        });
    }

    render() {
        <i-panel width="100%" height="100%">
            <i-vstack width="100%" height="100%" padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }} gap="1rem">
                <i-scom-chat id="scomChat" width="100%" height="100%" border={{ width: 1, style: 'solid', color: Theme.divider }} isAIChat={true}></i-scom-chat>
            </i-vstack>
        </i-panel>
    }
}