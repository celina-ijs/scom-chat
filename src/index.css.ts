import { Styles } from "@ijstech/components";

export const messagePanelStyle = Styles.style({
    $nest: {
        '> *:first-child': {
            marginTop: 'auto'
        }
    }
})

export const storageModalStyle = Styles.style({
  $nest: {
    '.modal > div:nth-child(2)': {
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    },
    'i-scom-storage': {
      display: 'block',
      width: '100%',
      height: 'calc(100% - 1.5rem)',
      overflow: 'hidden'
    }
  }
})

export const imageStyle = Styles.style({
  transform: 'translateY(-100%)',
  $nest: {
      '&>img': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
      }
  }
});

export const messageStyle = Styles.style({
  $nest: {
    '> i-scom-markdown-editor:first-child .toastui-editor-contents p': {
      marginBlockStart: 0
    },
    '> i-scom-markdown-editor:last-child .toastui-editor-contents p': {
      marginBlockEnd: 0
    },
    '> i-label + i-scom-markdown-editor .toastui-editor-contents p': {
      marginBlockStart: 0
    }
  }
});

export const customLinkStyle = Styles.style({
  $nest: {
    'i-link': {
      display: `inline !important`,
    },
    'img': {
      maxWidth: '100%'
    }
  }
})