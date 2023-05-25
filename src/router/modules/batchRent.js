
const _import = require('../import-' + process.env.NODE_ENV)
const batchRentRouter = [
  {
    'menuId': 130,
    'parentId': 0,
    'parentName': null,
    'name': '批量入住',
    'url': 'batchRent/batchOrder',
    'perms': null,
    'type': 0,
    'icon': 'machine',
    'orderNum': 0,
    'open': null,
    // 'list': [
    //   {
    //     'menuId': 131,
    //     'parentId': 1,
    //     'parentName': null,
    //     'name': '批量订单',
    //     'url': 'batchRent/batchOrder',
    //     'perms': null,
    //     'type': 1,
    //     'icon': '',
    //     'orderNum': 1,
    //     'open': null,
    //     'list': null,
    //   }
    // ]
  }
]

export default batchRentRouter