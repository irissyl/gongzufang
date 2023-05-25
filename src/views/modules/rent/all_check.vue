<template>
	<div>
		<r-search
		:searchData="searchData" 
		:searchForm="searchForm" 
		:searchHandle="searchHandle"
		/>
		
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
					areaName:"",
					building:"",
					unit:"",
					roomNo:"",
					customerName:"",
					idcard:""
				},
				searchForm: [
				   { type: "input",label: "小区名称",  prop: "areaName", width: 160},
				   { type: "input",label: "楼栋",  prop: "building", width: 160},
				   { type: "input",label: "单元",  prop: "unit", width: 160},
				   { type: "input",label: "房间号",  prop: "roomNo", width: 160},
				   { type: "input",label: "承租人姓名",  prop: "customerName", width: 160},
				   { type: "input",label: "承租人身份证",  prop: "idcard", width: 160},  
				],
				searchHandle:[
				  {type: "info",icon: "el-icon-refresh", handle: e => this.searchFromReset()},
				  {label: "查询",type: "primary",icon: "el-icon-search",handle: e =>this.seach()} 
				],
				tableData: [],
				tableCols: [
				  { label: "承租人", prop: "customerName"},
				  // { label: "身份证", prop: "idcard"},
				  { label: "联系方式", prop: "mobile1", width: 120},
				  { label: "照片", prop: "customerPhoto",type:"images"},
				  // { label: "家庭地址", prop: "address"},
				  { label: "小区名称", prop: "areaName"},
				  { label: "楼栋", prop: "building"},
				  { label: "单元", prop: "unit"},
				  { label: "房间号", prop: "roomNo"},
				  { label: "起始时间", prop: "orderStart"},
				  { label: "结束时间", prop: "orderEnd"},
				  { label: "入住办理人员", prop: "inputUser"},
				  { label: "入住办理时间", prop: "orderTime"},
				  { label: "退租办理人员", prop: "exitUser"},
				  { label: "退租办理时间", prop: "exitTime"},
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
				this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/listExitOrder',params).then((res)=>{
					// console.log(res);
					this.load=false;
					if(res.resultCode==0){
						for(let i in res.data.datas){
							if(res.data.datas[i].customers[0].customerType=="承租人"){
								res.data.datas[i].customerPhoto=[];
								res.data.datas[i].customerName=res.data.datas[i].customers[0].customerName;
								res.data.datas[i].address=res.data.datas[i].customers[0].address;
								res.data.datas[i].idcard=res.data.datas[i].customers[0].idcard;
								res.data.datas[i].mobile1=res.data.datas[i].customers[0].mobile1;
								res.data.datas[i].customerPhoto.push(this.url+'/iotwebapi'+res.data.datas[i].customers[0].customerPhoto);
							}
						}
						this.pagination.total=res.data.dataCount;
						this.tableData=res.data.datas;
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