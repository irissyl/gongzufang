<template>
	<div>
		<r-search
		:searchData="searchData" 
		:searchForm="searchForm" 
		:searchHandle="searchHandle"
		/>
	</div>
</template>

<script>
	export default {
	  data() {
	    return {
		  url:process.env.VUE_APP_URL,
	      searchData: {
	      	storeName:"" 
	      },
	      searchForm: [
	        { type: "input",label: "项目名称：",  prop: "storeName", width: 260}
	      ],
	      searchHandle:[
	        {label: "修改项目名称",type: "primary",handle: e =>this.set()} 
	      ],
	    }
	  },
	  created() {
	  	this.init();
	  },
	  methods:{
		  set(){
			 this.$http.post(this.url+'/iotwebapi/api/publicrental/store/updateStore',this.searchData).then((res)=>{
			 	console.log(res);
			 	if(res.resultCode==0){
			 		this.$message({
			 			message: '修改成功',
			 			type: 'success',
			 			duration:2000,
			 			offset:400,
			 			onClose:res=>{
			 				this.init();
							window.location.reload();
			 			}
			 		});
			 	}else{
			 		this.$message.error(res.message);
			 	}
			  })  
		  },
		  init(){
			 this.$http.get(this.url+'/iotwebapi/api/publicrental/store/storeInfo').then((res)=>{
			 	console.log(res);
			 	if(res.resultCode==0){
			 		this.searchData.storeName=res.data.storeName;
					localStorage.setItem("title",this.searchData.storeName);
			 	}else{
			 		this.$message.error(res.message);
			 	}
			  }) 
		  }
	  }
	}
</script>

<style scoped>
	
</style>