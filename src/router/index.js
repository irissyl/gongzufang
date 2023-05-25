/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'
import store from '@/store' 
Vue.use(Router)
import global from './global'
import {constantRoutes} from './constantRoutes'


// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } },
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
    { path: '/demo-echarts', component: _import('demo/echarts'), name: 'demo-echarts', meta: { title: 'demo-echarts', isTab: true } },
    { path: '/demo-ueditor', component: _import('demo/ueditor'), name: 'demo-ueditor', meta: { title: 'demo-ueditor', isTab: true } },
	{ path: '/demo-get_Idcard', component: _import('demo/get_Idcard'), name: 'demo-get_Idcard', meta: { title: 'demo-get_Idcard', isTab: true } },
	{ path: '/demo-get_Idcard2', component: _import('demo/get_Idcard2'), name: 'demo-get_Idcard2', meta: { title: 'demo-get_Idcard2', isTab: true } },
	...global
  ],
	
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
		//TODO
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    next()
  }
	
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
 // next()
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
		//  本地
    let arr = constantRoutes;
    router.options.isAddDynamicMenuRoutes = true
    fnAddDynamicMenuRoutes(arr)
    sessionStorage.setItem('menuList', JSON.stringify(arr || '[]'))
		console.log("菜单",arr);
    next({ ...to, replace: true })
		
		return false;
		/* 
		* TODO 菜单接口 
		* 要把代码格式改成和本地路由一样,不然router判断完了,main-navbar.vue还要再改一次
		* 本地路由结构
		* {
		* 'parentId': 0,
		*	'menuId': 1,
		*	'name': 'xx管理',
		*	'url': '',
		*	'icon': 'xxx',
		*	'list': [
		*			{
		*			'menuId': 2,
		*			'parentId': 1,
		* .
		*			'name': 'xx立标',
		*			'url': 'xx/xx',
		*			'icon': '',
		*			},
		*		]
		*	}
		* 
		*/
		// http.get("/api/sys-role/admin/getRoleMenuList",{id:JSON.parse(Vue.cookie.get('userInfo')).roleId}).then(res  => { 
		http.get("/system/menu/treeselect").then(res  => {
			console.log(res);
		  if (res.code === 200) {
				let arr = []
				res.data.forEach(item=>{
					// if(item.isFlag ==1){
						arr.push(item)
					// }
				});
				function get(tree = []){
					if (tree && tree.length !== 0) {
							for(const item of tree){
									// if (item.interfaceType == 3) {
									// 	continue;
									// }
									item.menuId = item.id
									item.name = item.label
									item.url = item.path
									item.icon = item.icon
									item.list = item.children,
									// item.perms = item.pream
									// item.childrenPerms = (item.interfaceType==2 && item.sysMenuList)?item.sysMenuList.map(k=>k.pream):null
									// if(item.children){
										get(item.list)
									// }
							};
					}
					return arr
				}
				get(arr)
		    fnAddDynamicMenuRoutes(arr)
		    router.options.isAddDynamicMenuRoutes = true
		    sessionStorage.setItem('menuList', JSON.stringify(arr || '[]'))
		    next({ ...to, replace: true })
		  } else {
		    sessionStorage.setItem('menuList', '[]')
		    sessionStorage.setItem('permissions', '[]')
		    next()
		  }
		})
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}


/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
					perms:menuList[i].perms,
					childrenPerms:menuList[i].childrenPerms,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) { }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])

    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    // console.log('\n')
    // console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    // console.log(mainRoutes)
    // console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
