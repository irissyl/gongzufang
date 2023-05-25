
const _import = require('../import-' + process.env.NODE_ENV)
const tdeviceRouter = [
  {
    'menuId': 120,
    'parentId': 0,
    'parentName': null,
    'name': '设备管理',
    'url': '',
    'perms': null,
    'type': 0,
    'icon': 'permission',
    'orderNum': 0,
    'open': null,
    'list': [  
      {
        'menuId': 121,
        'parentId': 1,
        'parentName': null,
        'name': '设备列表',
        'url': 'tdevice/deviceList',
        'perms': null,
        'type': 1,
        'icon': '',
        'orderNum': 1,
        'open': null,
        'list': null,
      },
		{
		  'menuId': 122,
		  'parentId': 1,
		  'parentName': null,
		  'name': '开门记录',
		  'url': 'tdevice/openRecord',
		  'perms': null,
		  'type': 1,
		  'icon': '',
		  'orderNum': 1,
		  'open': null,
		  'list': null,
			hidden:true
		}
    ]
  }
]

export default tdeviceRouter