class Module {

	constructor({ str, fn }) {
		this.str = str
		this.fn = fn
		var [type, name] = str.split('/')
		this.type = type
		this.name = name
	}

	get alias() {
		var { name, type } = this
		return name + type[0].toUpperCase() + type.substr(1)
	}

}

class App {

	constructor() {
		this.modules = {}
		this._modules = []
	}

	// private
	_load(str) {
		var { _modules, modules } = this
		var module = _modules.find(module => module.str == str)
		if (!module)
			throw new Error('invalid module!')
		var instance = module.fn(modules)
		var { type } = module
		switch (type) {
			case 'service':
				module.instance = instance
				break
		}
		return instance
	}

	// public
	bootstrap(str) {
		this._load(str)
	}

	module(str, fn, alias) {
		var module = new Module({ str, fn });
		var { name, type } = module
		if (!name)
			throw new Error('invalid module string name,' + str + '!')
		var { _modules, modules } = this
		if (_modules.find(module => module.str == str))
			throw new Error('module ' + str + ' is already defined!')
		_modules.push(module)
		if (!modules[type])
			modules[type] = {}
		var app = this
		var prop = alias ? module.alias : name;
		Object.defineProperty(modules[type], prop, {
			get() {
				return module.instance || app._load(str)
			}
		})
	}

}

export { App }