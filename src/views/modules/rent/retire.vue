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
					customerName:"",
					idcard:""
				},
				searchForm: [
				   { type: "input",label: "姓名",  prop: "customerName", width: 160},
				   { type: "input",label: "身份证号",  prop: "idcard", width: 160}
				],
				searchHandle:[
				  {type: "info",icon: "el-icon-refresh", handle: e => this.searchFromReset()},
				  {label: "查询",type: "primary",icon: "el-icon-search",handle: e =>this.seach()} 
				],
				tableData: [],
				tableCols: [
				  { label: "姓名", prop: "customerName"},
				  { label: "性别", prop: "sex"},
				  { label: "身份证号", prop: "idcard"},
				  { label: "公司名称", prop: "company"},
				  { label: "人脸照片", prop: "pic",type:"images"},
				  { label: "手机号", prop: "mobile1"},
				  { label: "紧急联系人电话", prop: "mobile2"},
				  { label: "租客类型", prop: "customerType"},
				  { label: "办理人员", prop: "inputUser"},
				  { label: "办理时间", prop: "customerTime"},
				  {
				    label: "操作",
				    type: "button",
				    width: 160,
				    btnList: [
					  {
					  	label: "详情",
					    type: "primary",
					    size: "mini",
					    handle: (row) => this.deails(row) ,
					  },
					 //  {
						// label: "删除",
						// type: "danger",
						// size: "mini",
						// handle: (row) => this.del(row) ,
					 //  },
				    ]
				  }
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
			deails(row){  //  详情
			    // localStorage.setItem("orderDeails",JSON.stringify(row));
				this.$router.push({
					path:'/rent-order_deails',
					query:{
						orderId:row.orderId
					}
				})
			},
			init(){
				this.load=true;
				
				let params = {...this.pagination,...this.searchData};
				this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/listCustomer',params).then((res)=>{
					console.log(res);
					this.load=false;
					if(res.resultCode==0){
						this.pagination.total=res.data.dataCount;
						for(let i in res.data.datas){
							res.data.datas[i].pic=[];
							res.data.datas[i].pic.push(
								this.url+'/iotwebapi'+res.data.datas[i].customerPhoto,
								this.url+'/iotwebapi'+res.data.datas[i].idcardPhoto
							);
							// res.data.datas[i].pic.push(this.url+'/iotwebapi'+res.data.datas[i].idcardPhoto);
							// res.data.datas[i].customerPhoto=this.url+'/iotwebapi'+res.data.datas[i].customerPhoto;
						}
						
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