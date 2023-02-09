#!/usr/bin/env node
const glob = require('glob');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { PackageStats } = require('./packageStats.js');
const { ImportStats } = require('./importStats.js');

const { output = './imports-stats' } = yargs(hideBin(process.argv)).argv;

const packageStats = new PackageStats();
const importStats = new ImportStats();

glob('./src/**/*.tsx', {}, function (er, files) {
	const libraryAndComponentsTotal = {
		name: packageStats.getName(),
		description: packageStats.getDescription(),
		version: packageStats.getVersion(),
		dependencies: packageStats.getDependencies(),
		devDependencies: packageStats.getDevDependencies(),
		imports: importStats.getImportStats(files),
	};

	fs.writeFileSync(`${output}.json`, JSON.stringify(libraryAndComponentsTotal));
});
