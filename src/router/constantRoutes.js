//TODO:前期搭建静态页面的时候使用本地菜单
const modulesFiles = require.context('./modules', true, /\.js$/)

let arr = [];
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
	if(value.default && value.default.length!=0){
		arr.push(value.default[0])
	}
}, {})


export const constantRoutes = arr
