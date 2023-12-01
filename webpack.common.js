'use strict';

const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
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
				test: /\.scss$/,
				use: [
					'style-loader',
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
		new HTMLWebpackPlugin({
			template: 'index.html',
			favicon: './public/favicon/favicon.ico',
		}),
	],
};
