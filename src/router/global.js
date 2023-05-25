const _import = require('./import-' + process.env.NODE_ENV)
export default  [
	{
		path: '/permission-menu', 
		component: _import('modules/permission/menu'), 
		name: 'permission-menu', 
		meta: { 
			title: '菜单管理' ,
			isTab:true
		}
	},
	{
		path: '/rent-rent_deails', 
		component: _import('modules/rent/rent_deails'),  
		name: 'rent-rent_deails', 
		meta: { 
			title: '详情' ,
			isTab:true
		}
	},
	{
		path: '/rent-order_deails', 
		component: _import('modules/rent/order_deails'),  
		name: 'rent-order_deails', 
		meta: { 
			title: '订单详情' ,
			isTab:true
		}
	},
	{
		path: '/rent-rent_in', 
		component: _import('modules/rent/rent_in'),  
		name: 'rent-rent_in', 
		meta: { 
			title: '办理入住' ,
			isTab:true
		}
	},
	{
		path: '/rent-all_manage', 
		component: _import('modules/rent/all_manage'),  
		name: 'rent-all_manage', 
		meta: { 
			title: '订单缴费记录' ,
			isTab:true
		}
	},
	{
		path: '/rent-change', 
		component: _import('modules/rent/change'),  
		name: 'rent-change', 
		meta: { 
			title: '订单续租记录' ,
			isTab:true
		}
	},
	{
		path: '/tdevice-openRecord', 
		component: _import('modules/tdevice/openRecord'),  
		name: 'tdevice-openRecord', 
		meta: { 
			title: '开门记录' ,
			isTab:true
		}
	}
]