const { prop, pipe, isEmpty, not, flatten, groupBy, mapObjIndexed, filter } = require('ramda');
const fs = require('fs');

const ATOMIC_PREFIX = '@atomic';
const IMPORT_NAME = 'import';
const SEPARATOR = ';';

const addOne = (value) => value + 1;
const subtractOne = (value) => value - 1;

class ImportStats {
	getImportStats = (files) => {
		return mapObjIndexed(
			this.groupByCount,
			this.prepareLibraryList(this.extractFileImports(files)),
		);
	};

	groupByCount = (arr) => {
		return arr.reduce((total, value) => ({ ...total, [value]: addOne(total[value] || 0) }), {});
	};

	prepareLibraryList = (result) => {
		const prepend = (val) => flatten(val.map(pipe(prop('components'), filter(Boolean))));
		return mapObjIndexed(prepend, groupBy(prop('library'), flatten(result)));
	};

	extractFileImports(files) {
		return files.map(this.parseImportsFromFile).map(prop('imports')).filter(pipe(isEmpty, not));
	}

	parseImportsFromFile = (path) => ({
		path,
		imports: this.parseImports(fs.readFileSync(path, 'utf-8')),
	});

	parseImports = (data) => {
		const imports = [];
		let tmpData = data;

		while (this.parseImport(tmpData)) {
			const result = this.parseImport(tmpData);
			if (result.import.library.includes(ATOMIC_PREFIX)) {
				imports.push(result.import);
				tmpData = result.data;
				continue;
			}

			tmpData = result.data;
		}
		return imports;
	};

	parseImport = (data) => {
		const importIndex = data.indexOf(IMPORT_NAME);
		const separatorIndex = data.indexOf(SEPARATOR);
		if (importIndex === -1) return;

		return {
			import: this.structImport(data.slice(importIndex, separatorIndex)),
			data: data.slice(addOne(separatorIndex), data.length),
		};
	};

	structImport = (importString) => ({
		components: this.parseComponents(importString),
		library: this.parseLibraryName(importString),
	});

	parseComponents = (importString) => {
		return importString
			.slice(addOne(importString.indexOf('{')), subtractOne(importString.indexOf('}')))
			.replace(/\s+/g, '')
			.split(',');
	};

	parseLibraryName = (importString) => {
		return importString.slice(addOne(importString.indexOf("'")), importString.lastIndexOf("'"));
	};
}

module.exports = { ImportStats };
