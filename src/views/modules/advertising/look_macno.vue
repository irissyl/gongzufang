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
		  :isPagination="true"
		  :tablePage="pagination"
		  v-loading="load"
			@refresh="init()"
		/>
		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				load:false,
				// pagination: { limit: 10, offset: 1, total: 0 },
				searchData: {
					id:this.$route.query.id,
					deviceIds:this.$route.query.deviceIds
				},
				searchForm: [
				  { type: "input",label: "商家名称", prop: "userName", width: 160},
				  { type: "input",label: "代理名称", prop: "userName", width: 160},
					{ type: "input",label: "设备名称", prop: "userName", width: 160},
					{ type: "input",label: "设备编码", prop: "userName", width: 160},
				],
				searchHandle: [
				  {type: "info",icon: "el-icon-refresh", handle: e => this.searchFromReset() },
				  {label: "搜索",type: "primary",icon: "el-icon-search",handle: e => this.init()},
				],
				tableData: [],
				tableCols: [
					{ label: "ID", prop: "userNo",formatter:e=>  e.a},
				  { label: "设备名称", prop: "status"},
					{ label: "设备编码", prop: "status"},
					{ label: "代理商名称", prop: "status"},
					{ label: "商家", prop: "userNo",formatter:e=>  e.d},
					{ label: "设备地址", prop: "ctime",formatter:e=>  e.b},
					{ label: "设备状态", prop: "status",formatter:e=>  e.status==1?'未过期':'已过期'},
					{ label: "设备经纬度", prop: "ctime",formatter:e=>  e.b},
					{ label: "添加时间", prop: "ctime",formatter:e=>  e.b},
				],
			}
		},
		created() {
			this.init();
		},
		methods:{
			elFormDetail(e){
				Object.keys(this.formData).forEach(key=>{
					this.formData[key] = e[key]
				})
				this.formData.id = e.id;
				this.elFormVisible();
			},
			init(){
				this.load=true;
				this.$http.post('/system/advert/assign',this.searchData).then((res)=>{
					console.log(res);
					this.load=false;
					if(res.code==200){
						this.pagination.total=res.data.totalCount;
						this.tableData=res.data.list;
					}else{
						this.$message.error(res.msg);
					}
				})
			}
		}
	}
</script>

<style>
</style>

