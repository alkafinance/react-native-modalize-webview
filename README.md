# react-native-modalize-webview

[![npm version](https://img.shields.io/npm/v/react-native-modalize-webview.svg)](https://www.npmjs.org/package/react-native-modalize-webview)
[![CircleCI Status](https://img.shields.io/circleci/project/github/alkafinance/react-native-modalize-webview/master.svg)](https://circleci.com/gh/alkafinance/workflows/react-native-modalize-webview/tree/master)
![license: MIT](https://img.shields.io/npm/l/react-native-modalize-webview.svg)
![Supports iOS](https://img.shields.io/badge/platforms-ios-lightgrey.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

React Native modal component that brings swipe to dismiss to WebView.

<img src="./.github/demo.gif" width="auto" height="640">

## Getting started

`$ npm install react-native-modalize-webview --save`

## Usage

Import `ModalizeWebView` and use it like the regular [`Modalize` component](https://github.com/jeremybarbet/react-native-modalize/). Provide `WebView` props via `webViewProps` to customize the displayed web page.

```javascript
import {ModalizeWebView} from 'react-native-modalize-webview'

function MyComponent() {
  const modalizeRef = useRef(null)

  const handleOpen = useCallback(() => {
    if (modalizeRef.current) {
      modalizeRef.current.open()
    }
  }, [])

  return (
    <>
      <TouchableOpacity onPress={handleOpen}>
        <Text>Open the modal</Text>
      </TouchableOpacity>

      <ModalizeWebView
        ref={modalizeRef}
        handlePosition="inside"
        webViewProps={{
          source: {
            uri: 'https://facebook.github.io/react-native/',
          },
        }}
      />
    </>
  )
}
```

## Props

- [Inherited `Modalize` props...](https://jeremybarbet.github.io/react-native-modalize/#/PROPSMETHODS)

- [`webViewProps`](#webViewProps)
- [`anchorOffset`](#anchorOffset)

---

# Reference

## Props

### `webViewProps`

Configures the underlying `WebView` component.

| Type                                                                                                                 | Required |
| -------------------------------------------------------------------------------------------------------------------- | -------- |
| [`WebViewProps`](https://github.com/react-native-community/react-native-webview/blob/master/docs/Reference.md#props) | Yes       |

### `anchorOffset`

Specifies extra offset from top on scroll to an anchor link. Defaults to `16`.

| Type     | Required |
| -------- | -------- |
| `number` | No       |

## License

[MIT License](./LICENSE) © Alka, Inc
