const path = require('path');

class PackageStats {
	constructor() {
		this.init();
	}

	init() {
		this.packageJson = this.readPackageJson();
	}

	readPackageJson = () => require(path.resolve(process.cwd(), 'package.json'));

	getName() {
		return this.packageJson.name;
	}

	getDescription() {
		return this.packageJson.description;
	}

	getVersion() {
		return this.packageJson.version;
	}

	getDependencies() {
		return this.packageJson.dependencies;
	}

	getDevDependencies() {
		return this.packageJson.devDependencies;
	}
}

module.exports = { PackageStats };
