
const _import = require('../import-' + process.env.NODE_ENV)
const setRouter = [
  {
    'menuId': 110,
    'parentId': 0,
    'parentName': null,
    'name': '系统设置',
    'url': '',
    'perms': null,
    'type': 0,
    'icon': 'shezhi',
    'orderNum': 0,
    'open': null,
    'list': [
      {
        'menuId': 111,
        'parentId': 1,
        'parentName': null,
        'name': '小区管理',
        'url': 'set/house_manage',
        'perms': null,
        'type': 1,
        'icon': '',
        'orderNum': 1,
        'open': null,
        'list': null,
      },
	  {
	    'menuId': 112,
	    'parentId': 1,
	    'parentName': null,
	    'name': '房源管理',
	    'url': 'set/house_set',
	    'perms': null,
	    'type': 1,
	    'icon': '',
	    'orderNum': 1,
	    'open': null,
	    'list': null,
	  },
	  {
	    'menuId': 113,
	    'parentId': 1,
	    'parentName': null,
	    'name': '房源导入',
	    'url': 'set/house_in',
	    'perms': null,
	    'type': 1,
	    'icon': '',
	    'orderNum': 1,
	    'open': null,
	    'list': null,
	  },
		{
		  'menuId': 114,
		  'parentId': 1,
		  'parentName': null,
		  'name': '修改项目名称',
		  'url': 'set/set_title',
		  'perms': null,
		  'type': 1,
		  'icon': '',
		  'orderNum': 1,
		  'open': null,
		  'list': null,
		}
    ]
  }
]

export default setRouter