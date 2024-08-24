module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      require.resolve('react-native-reanimated/plugin'),
      {
        // Add the Reanimated plugin options here, if any
      },
    ],
  ],
};
