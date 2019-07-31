import React, {useCallback, useMemo, useRef, useState} from 'react'
import {
  Dimensions,
  NativeSyntheticEvent,
  Platform,
  StatusBar,
} from 'react-native'
import Modalize from 'react-native-modalize'
import WebView, {WebViewProps} from 'react-native-webview'
import {
  WebViewMessage,
  WebViewNavigation,
} from 'react-native-webview/lib/WebViewTypes'
import {isIphoneXOrXr} from './utils/isIphoneXOrXr'
import {useCombinedRefs} from './utils/useCombinedRefs'

const {height: SCREEN_HEIGHT} = Dimensions.get('window')
const STATUS_BAR_HEIGHT = Platform.select({
  ios: isIphoneXOrXr() ? 44 : 20,
  android: StatusBar.currentHeight,
})
const NAVIGATION_BAR_HEIGHT = Platform.select({
  ios: 44,
  android: 56,
})

// Based on https://github.com/jeremybarbet/react-native-modalize/blob/1.2.0/src/Modalize.tsx#L53
const MODAL_CONTAINER_HEIGHT =
  Platform.OS === 'ios' ? SCREEN_HEIGHT : SCREEN_HEIGHT - 10

export interface ModalizeWebViewProps
  extends React.ComponentProps<typeof Modalize> {
  webViewProps: Omit<WebViewProps, 'scrollEnabled'>
  anchorOffset?: number
}

export const ModalizeWebView = React.forwardRef(
  (
    {webViewProps, anchorOffset = 16, ...modalizeProps}: ModalizeWebViewProps,
    ref: React.Ref<Modalize>,
  ) => {
    // eslint-disable-next-line no-underscore-dangle
    const _modalizeRef = useRef<Modalize>(null)
    const modalizeRef = useCombinedRefs(ref, _modalizeRef)
    const webViewRef = useRef<WebView>(null)

    const contentExpandedHeight = useMemo(
      () =>
        MODAL_CONTAINER_HEIGHT -
        STATUS_BAR_HEIGHT -
        (modalizeProps.handlePosition === 'outside' ? 35 : 0),
      [modalizeProps.handlePosition],
    )
    const contentCollapsedHeight = useMemo(
      () => contentExpandedHeight - NAVIGATION_BAR_HEIGHT,
      [contentExpandedHeight],
    )
    const [documentHeight, setDocumentHeight] = useState(contentExpandedHeight)

    const handleNavigationStateChange = useCallback(
      (event: WebViewNavigation) => {
        if (webViewProps.onNavigationStateChange) {
          webViewProps.onNavigationStateChange(event)
        }

        if (!event.loading && !event.navigationType) {
          setDocumentHeight(contentExpandedHeight)
          // Wait for the page to actually load, otherwise we will inject
          // the script into the previous page
          setTimeout(() => {
            // HACK: Use the document height of the page as the actual height
            // of the view to fix dismiss gesture
            if (webViewRef.current) {
              webViewRef.current.injectJavaScript(documentHeightCallbackScript)
            }
          }, 500)
        } else if (
          !event.loading &&
          event.navigationType === 'click' &&
          // Test if the url is an anchor
          /#[a-zA-Z][\w:.-]*$/.test(event.url)
        ) {
          // HACK: Use the anchor tag from the url to run a custom
          // JavaScript script that finds the element offset from top.
          // Then use that offset to actually scroll to the element
          // mimicking native web behaviour
          if (webViewRef.current) {
            webViewRef.current.injectJavaScript(
              elementByIdOffsetTopCallbackScript,
            )
          }
        }
      },
      [contentExpandedHeight, webViewProps],
    )
    const handleMessage = useCallback(
      (event: NativeSyntheticEvent<WebViewMessage>) => {
        if (webViewProps.onMessage) {
          webViewProps.onMessage(event)
        }

        const data:
          | {
              event: 'documentHeight'
              documentHeight: number
            }
          | {
              event: 'elementByIdOffsetTop'
              offsetTop: number
            }
          | null
          | undefined = JSON.parse(event.nativeEvent.data)
        if (!data) return

        switch (data.event) {
          case 'documentHeight': {
            if (data.documentHeight !== 0) {
              setDocumentHeight(data.documentHeight)
            }

            break
          }
          case 'elementByIdOffsetTop': {
            if (_modalizeRef.current) {
              _modalizeRef.current.scrollTo({
                y: Math.max(
                  0,
                  data.offsetTop -
                    (modalizeProps.handlePosition === 'inside' ? 20 : 0) -
                    anchorOffset,
                ),
                animated: true,
              })
            }

            break
          }
        }
      },
      [anchorOffset, modalizeProps.handlePosition, webViewProps],
    )

    return (
      <Modalize
        ref={modalizeRef}
        snapPoint={contentCollapsedHeight}
        scrollViewProps={{
          style: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            overflow: 'hidden',
          },
        }}
        {...modalizeProps}>
        <WebView
          ref={webViewRef}
          {...webViewProps}
          scrollEnabled={false}
          style={[webViewProps.style, {height: documentHeight}]}
          onNavigationStateChange={handleNavigationStateChange}
          onMessage={handleMessage}
        />
      </Modalize>
    )
  },
)

const documentHeightCallbackScript = `
  function onElementHeightChange(elm, callback) {
    var lastHeight
    var newHeight

    ;(function run() {
      newHeight = Math.max(elm.clientHeight, elm.scrollHeight)
      if (lastHeight != newHeight) {
        callback(newHeight)
      }
      lastHeight = newHeight

      if (elm.onElementHeightChangeTimer) {
        clearTimeout(elm.onElementHeightChangeTimer)
      }

      elm.onElementHeightChangeTimer = setTimeout(run, 200)
    })()
  }

  onElementHeightChange(document.body, function(height) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        event: 'documentHeight',
        documentHeight: height,
      }),
    )
  })
`

const elementByIdOffsetTopCallbackScript = `
  // Based on https://stackoverflow.com/a/1480137
  function cumulativeOffset(elm) {
    var top = 0
    var left = 0
    do {
      top += elm.offsetTop || 0
      left += elm.offsetLeft || 0
      elm = elm.offsetParent
    } while (elm)

    return {
      top: top,
      left: left,
    }
  }

  if (window.location.hash) {
    var id = window.location.hash.replace('#', '')
    var elm = document.getElementById(id)
    if (!elm) {
      // Special case for GitHub
      elm = document.getElementById('user-content-' + id)
    }

    if (elm) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          event: 'elementByIdOffsetTop',
          offsetTop: cumulativeOffset(elm).top,
        }),
      )
    }
  }
`
