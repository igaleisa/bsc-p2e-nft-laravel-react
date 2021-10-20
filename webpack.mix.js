const mix = require('laravel-mix');


/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.webpackConfig(
    {
        // optimization :  {
        //     splitChunks: {
        //         chunks: "all",
        //         minSize: 200000,
        //         maxSize: 244000,
        //     }
        // },
        module: {
            rules: [
                
            ]
        },
        resolve: {
            extensions: [".js", ".jsx"],
            alias: {
                "@": __dirname + "/resources/js"
            },
            fallback: {
                "crypto": false,
                "stream": require.resolve("stream-browserify"),
                "assert": false,
                "util": false,
                "http": false,
                "https": false,
                "os": false
            }
        }
    })
    .js('resources/js/app.js', 'public/js')
    .react()
    .extract(["react"])
    .sass('resources/sass/app.scss', 'public/css');
