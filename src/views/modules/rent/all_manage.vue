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
				  { label: "费用详情", prop: "feeContent"},
				  { label: "数量", prop: "feeCount"},
				  { label: "收款费用编号(流水)", prop: "feeId"},
				  { label: "是否支付", prop: "feePaid",formatter:e=>  e.feePaid==true?"是":"否"},
				  { label: "单价(元)", prop: "feePrice"},
				  { label: "费用类型", prop: "feeType"},
				  { label: "支付方式", prop: "paidType"},
				  { label: "备注", prop: "remark"},
				  { label: "支付时间", prop: "paidTime"}
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
				this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/listFee',params).then((res)=>{
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