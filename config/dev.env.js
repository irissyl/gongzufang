'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  OPEN_PROXY: true, // 是否开启代理, 重置后需重启vue-cli     
  // VUE_APP_URL: '"https://szxymdb.https.xiaozhuschool.com"',    
  // VUE_APP_IMG: '"https://szxymdb.https.xiaozhuschool.com/"',
	VUE_APP_URL: '"/api"',
	VUE_APP_IMG: '"https://yunm.an-lock.com/"',
})
