'use strict';

const paths = require('./paths');

const config = {
	entries: [
		{
			filePath: paths.declarationIndex,
			outFile: paths.buildDeclaration,
			output: {
				sortNodes: true,
				respectPreserveConstEnum: true,
        umdModuleName: 'klinecharts'
			},
		},
	],
};

module.exports = config;