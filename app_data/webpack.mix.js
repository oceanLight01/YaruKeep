const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.ts('resources/ts/app.tsx', 'public/js')
    .react()
    .sass('resources/scss/app.scss', 'public/css')
    .webpackConfig({
        module: {
            rules: [
                {
                    test: /\.css$/,
                    rules: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[local]_[hash:base64:8]',
                            },
                        },
                    ],
                },
            ],
        },
    });
