import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import {
	clearLoginInfo
} from '@/utils'
import {
	MessageBox,
	Message
} from 'element-ui'
const http = axios.create({
	timeout: 1000 * 15,
	// withCredentials: true, // send cookies when cross-domain requests
	// headers: {
	//   'Content-Type': 'application/json; charset=utf-8'
	// }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
	if (Vue.cookie.get('token') && (!config.flag || !config.flag.unLogin)) {
		// config.headers['Authentication'] = Vue.cookie.get('token') // 请求头带上token
		config.headers['Authorization'] ="bearer"+" " + Vue.cookie.get('token') // 请求头带上token
	}
	return config
}, error => {
	return Promise.reject(error)
})





/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
	//TODO
	const res = response.data

	if (response.data && response.data.message === 'query ok') { // 腾讯api返回
		return response.data.result
	}

	if (response.data && response.data.code === 401) { // 401, token失效
		clearLoginInfo()
		router.push({
			name: 'login'
		})
		return
	}

	return res
	// if ((res.code != 200)||(res.code !=1)) {
	//   Message({
	//     message: res.msg,
	//     type: 'error',
	//     duration: 5 * 1000
	//   })
	//   //return Promise.reject(new Error(res.msg || 'Error'))
	// } else {
	//   return res
	// }
}, error => {
	const res = error.response.data

	if (res && res.resultCode == 401) {
		Message({
			message: '登录过期',
			type: 'error',
			duration: 5 * 1000
		})
		clearLoginInfo()
		router.push({ name: 'login' })
	} else {
		Message({
			message: '服务器异常',
			type: 'error',
			duration: 5 * 1000
		})
	}

	return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
	// 非生产环境 && 开启代理, 接口前缀统一使用[proxyApi/]前缀做代理拦截!
	//return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? 'proxyApi/' : process.env.VUE_APP_URL) + actionName
	if (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY) {
		return `${actionName}`
	} else {
		return process.env.VUE_APP_URL + actionName
	}
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = false) => {
	var defaults = {
		't': new Date().getTime()
	}
	return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = false, contentType = 'json') => {
	var defaults = {
		't': new Date().getTime()
	}
	data = openDefultdata ? merge(defaults, data) : data
	return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data);
}



http.get = (url, query) => {
	return http({
		// url: http.adornUrl(url),
		url: url,
		method: 'get',
		params: query
	})
}

http.post = (url, data) => {
	return http({
		// url: http.adornUrl(url),
		url: url,
		method: 'post',
		data: data
	})
}

http.put = (url, data) => {
	return http({
		// url: http.adornUrl(url),
		url: url,
		method: 'PUT',
		data: data
	})
}

http.del = (url, query) => {
	return http({
		// url: http.adornUrl(url),
		url:url,
		method: 'delete',
		params: query
	})
}

http.formData = (url, data) => {
	return http({
		// url: http.adornUrl(url),
		url: url,
		method: 'post',
		data: qs.stringify(data)
	})
}

http.upload = (url, data, flag) => {
	return http({
		// url: http.adornUrl(url),
		url:url,
		method: 'post',
		data: data,
		flag
	})
}

http.body = (url, data) => {
	if (data.id) {
		return http({
			url: http.adornUrl(url),
			method: 'PUT',
			data: qs.stringify(data),
		})
	} else {
		return http({
			url: http.adornUrl(url),
			method: 'post',
			data: qs.stringify(data),
		})
	}
}

http.addOrEdit = (url, data) => {
	if (data.id) {
		return http({
			url: http.adornUrl(url),
			method: 'PUT',
			data: data,
		})
	} else {
		return http({
			url: http.adornUrl(url),
			method: 'post',
			data: data
		})
	}
}



export default http
