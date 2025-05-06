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

const anim = Styles.keyframes({
  '0%, 80%, 100%': {
    transform: 'scale(1)',
    opacity: 0.5
  },
  '40%': {
    transform: 'scale(1.25)',
    opacity: 1
  }
})

export const spinnerStyle = Styles.style({
  $nest: {
    '.typing i-icon': {
      animation: `${anim} 1.5s infinite`,
      margin: '0 2px'
    },
    '.typing i-icon:nth-child(1)': {
      animationDelay: '0s'
    },
    '.typing i-icon:nth-child(2)': {
      animationDelay: '0.2s'
    },
    '.typing i-icon:nth-child(3)': {
      animationDelay: '0.4s'
    }
  }
}) 

export const customHoverStyle = Styles.style({
  $nest: {
    '&:hover > i-icon:first-child': {
      display: 'none'
    },
    '&:hover > i-icon:nth-child(2)': {
      display: 'block !important'
    }
  }
});

export const customButtonStyle = Styles.style({
  $nest: {
    '> span': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      display: 'block'
    }
  }
});