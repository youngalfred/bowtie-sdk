/* Webpack runs in the context of nodejs (obviously), so we can use
 * nodejs modules inside our webpack configuration. */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    /* `entry` defines what file Webpack will use to begin the process
     * of bundling.  It is possible to define one entry point that uses
     * multiple files with an array syntax, but it is also possible to
     * define multiple entries by name.  Those entries will be compiled
     * into the 'bundled' file, and should use substitution syntax in
     * the `output` clause.
     */
    entry: { main: "./src/index.js" },

    /* There can only be one output definition.  To use it with
     * multiple entries, you can specify the filename as [name].js,
     * called "substitution syntax," which will create filenames
     * based on entry keys.
     */
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "",
        globalObject: "this",
        filename: "bowtie.[contenthash].js",
        libraryTarget: "umd",
        library: "Bowtie",
    },

    resolve: {
        extensions: [".js"],
    },

    optimization: {
        usedExports: true,
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            filename: "index.html",
            template: "src/index.html",
        }),
    ],

    mode: "production",
    devtool: "inline-source-map",
};
