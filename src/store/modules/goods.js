export default {
  namespaced: true,
  state: {
    goodsClassify:{
			id:'',
			value:[]
		},
		goodsInfo:{
			name:'',
			subTitle:'',
			productSn:'',
			price:'',
			originalPrice:'',
			totalStock:'',
			lowStock:'',
			unit:'',
			weight:'',
			pic:'',
			description:'',
			publishStatus:'1',
			recommandStatus:'1',
		},
		sku:[]
  },
  mutations: {
    updateClassify (state, val) {
      state.goodsClassify = val
    },
    updateGoodsInfo (state, val) {
      state.goodsInfo = val
    },
		updateSku (state, val) {
		  state.sku = val
		}
  },
	actions:{
		setClassify({ commit },data){
			commit('updateClassify',data)
		},
		setGoodsInfo({ commit },data){
			commit('updateGoodsInfo',data)
		},
		setSku({ commit },data){
			commit('updateSku',data)
		},
	}
}
