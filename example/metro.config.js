const path = require('path');

module.exports = {
  resolver: {
    extraNodeModules: {
      '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      'react-native-modalize': path.resolve(
        __dirname,
        'node_modules/react-native-modalize',
      ),
      'react-native-webview': path.resolve(
        __dirname,
        'node_modules/react-native-webview',
      ),
    },
  },
  watchFolders: [path.resolve(__dirname, '../src')],
};
