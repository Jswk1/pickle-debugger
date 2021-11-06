import * as webpack from "webpack";
import * as htmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";

const htmlPlugin = new htmlWebpackPlugin({
    template: path.join(__dirname, "./src/Index.html"),
    filename: "./Index.html"
});

const config: webpack.Configuration = {
    mode: "production",
    entry: "./src/Index.tsx",
    output: {
        publicPath: "/static",
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [htmlPlugin]
}

export default config;