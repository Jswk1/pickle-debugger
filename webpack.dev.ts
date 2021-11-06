import * as webpack from "webpack";
import * as htmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";

const htmlPlugin = new htmlWebpackPlugin({
    publicPath: "/",
    template: path.join(__dirname, "./src/Index.html")
});

const webpackConfig: webpack.Configuration = {
    mode: "development",
    entry: path.join(__dirname, "./src/Index.tsx"),
    devtool: "source-map",
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
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                use: "ts-loader",
                test: /\.tsx?$/,
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        hot: true,
        port: 3001
    },
    plugins: [htmlPlugin]
}



export default webpackConfig;