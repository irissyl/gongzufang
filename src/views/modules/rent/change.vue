<template>
	<div>
		<!-- <r-search
		:searchData="searchData" 
		:searchForm="searchForm" 
		:searchHandle="searchHandle"
		/> -->
		
		<r-table
		  :isIndex="true"
		  :tableData="tableData"
		  :tableCols="tableCols"
		  :tablePage="pagination"
		  :isPagination="true"
			v-loading="load"
		   @refresh="init()"
		/>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				url:process.env.VUE_APP_URL,
				load:false,
				pagination: { pageSize: 10, pageNumber: 1, total: 0 },
				searchData: {
					orderId:this.$route.query.orderId
				},
				searchForm: [
				   { type: "input",label: "订单编号",  prop: "orderId", width: 160}
				],
				searchHandle:[
				  {type: "info",icon: "el-icon-refresh", handle: e => this.searchFromReset()},
				  {label: "查询",type: "primary",icon: "el-icon-search",handle: e =>this.seach()} 
				],
				tableData: [],
				tableCols: [
				  { label: "订单编号", prop: "orderId"},
				  { label: "开始时间", prop: "orderStart"},
				  { label: "更新前时间", prop: "orderEnd"},
				  { label: "更新后时间", prop: "reletEnd"},
				  { label: "操作时间", prop: "reletTime"},
				  { label: "备注/详情", prop: "reletContent"},
				  { label: "操作人", prop: "inputUser"},
				]
			}
		},
		created() {
			this.init();
		},
		methods:{
			seach(){
				this.tableData=[];
				this.pagination.pageNumber=1;
				this.init();
			},
			init(){
				this.load=true;
				
				let params = {...this.pagination,...this.searchData};
				this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/listRelet',params).then((res)=>{
					console.log(res);
					this.load=false;
					if(res.resultCode==0){
						this.pagination.total=res.data.dataCount;
						this.tableData=res.data.datas;
					}else{
						this.$message.error(res.msg);
					}
				})
			},
		}
	}
</script>

<style>
</style>