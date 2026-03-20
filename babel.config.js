module.exports = function (api) {
  api.cache(true);
  const plugins = [
    'react-native-paper/babel',
    'react-native-reanimated/plugin',
  ];

  if (process.env.NODE_ENV === 'production') {
    plugins.push('transform-remove-console');
  }

  return {
    presets: ['babel-preset-expo'],
    plugins: plugins,
  };
};