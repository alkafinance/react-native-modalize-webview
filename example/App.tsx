import React, {useRef} from 'react'
import {SafeAreaView, StyleSheet, View} from 'react-native'
import Modalize from 'react-native-modalize'
import {ActivityIndicator, Button, Colors, Headline} from 'react-native-paper'
import {ModalizeWebView} from '../src'

export default function App() {
  const modalizeRef = useRef<Modalize>(null)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => {
            if (modalizeRef.current) modalizeRef.current.open()
          }}>
          Open the modal
        </Button>
      </View>

      <ModalizeWebView
        ref={modalizeRef}
        handlePosition="inside"
        webViewProps={{
          source: {
            uri:
              'https://github.com/react-native-community/react-native-webview/blob/master/docs/Reference.md#react-native-webview-api-reference',
          },
          startInLoadingState: true,
          renderLoading: () => (
            <View style={styles.fullscreen}>
              <ActivityIndicator />
            </View>
          ),
          renderError: () => (
            <View style={styles.fullscreen}>
              <Headline>Something went wrong</Headline>
            </View>
          ),
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  buttons: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  fullscreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
