'use strict';

const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	devtool: false,
	entry: './public/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve('dist'),
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
			{
				test: /\.html$/,
				use: 'html-loader',
			},
			{
				test: /\.(scss)$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(jpg|png|svg|gif)$/,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin(),
		new HTMLWebpackPlugin({
			template: 'index.html',
			favicon: './public/favicon/favicon.ico',
		}),
	],
};
