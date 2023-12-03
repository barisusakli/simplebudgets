'use strict';

const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: [
		'./public/index.js',
		'./public/styles.scss',
	],
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
				// test: /\.scss$/,
				test: /\.(scss)$/,
				use: [
					MiniCssExtractPlugin.loader,
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.css$/i,
				use: [
					'style-loader',
					'css-loader',
				],
			},
			{
				test: /\.(jpg|png|svg|gif)$/,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'main.css',
		}),
		new HTMLWebpackPlugin({
			template: 'index.html',
			favicon: './public/favicon/favicon.ico',
		}),

	],
};
