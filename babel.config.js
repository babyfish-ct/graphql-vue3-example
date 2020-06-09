module.exports = {
    presets: [
        'vca-jsx',
        '@vue/cli-plugin-babel/preset',
        [
            '@babel/preset-env',
            {
                'useBuiltIns': 'entry',
                'corejs': 3
            }
        ]
    ]
};
