module.exports = function (api) {
  api.cache(true);
  const plugins = [
    'react-native-paper/babel'
  ];

  if (process.env.NODE_ENV === 'production') {
    plugins.push('transform-remove-console');
  }

  // react-native-reanimated/plugin MUST be the absolute last plugin
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: ['babel-preset-expo'],
    plugins: plugins,
  };
};