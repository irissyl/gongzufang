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
		
		<r-form
		  dialogWidth="500px"
		  labelWidth="150px"
		  :isHandle="true"
		  :formCols="formCols"
		  :formHandle="formHandle"
		  :formData="formData"
		  :formRules="formRules"
		  ref="elForm"
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
					iotname:"",
					iottag:""
				},
				searchForm: [
				   { type: "input",label: "设备名称",  prop: "iotname", width: 160},
				   { type: "input",label: "设备编号",  prop: "iottag", width: 160}
				],
				searchHandle:[
				  {type: "info",icon: "el-icon-refresh", handle: e => this.searchFromReset()},
				  {label: "添加设备",icon: 'el-icon-plus',type: "primary",handle: e => this.elFormVisible()},
				  {label: "查询",type: "primary",icon: "el-icon-search",handle: e =>this.seach()} 
				],
				tableData: [],
				tableCols: [
				  { label: "设备名称", prop: "iotName",},
				  { label: "设备编号", prop: "iotTag"},
				  { label: "设备类型", prop: "iotType",
				  formatter:e=> e.iotType==1?"NBIOT":e.iotType==2?"WIFI":e.iotType==6?"CTCC_AEP":e.iotType==7?"ONENET":"-"},
				  { label: "钥匙数量", prop: "keyCount"},
				  // { label: "备注", prop: "remark"},
				  { label: "创建时间", prop: "createTime"},
				  {
				    label: "操作",
				    type: "button",
				    width: 220,
				    btnList: [
					  {
					  	label: "开门记录",
					    type: "primary",
					    size: "mini",
					    handle: (row) => this.open(row) ,
					  },
					  {
						label: "删除",
						type: "danger",
						size: "mini",
						handle: (row) => this.del(row) ,
					  },
				    ]
				  }
				],
				formCols: [
					{ type: "select", label: "联网协议", width: 300, prop: "procotol",options:[
						{label:"NBIOT",value:1},
						{label:"WIFI",value:2},
						{label:"CTCC_AEP",value:6},
						{label:"ONENET",value:7}
					]},
					{ type: "input", label: "设备名称", width: 300, prop: "iotname",isShow:e=>this.formData.procotol!=6?true:false},
					{ type: "input", label: "运营商设备号(IMEI)", width: 300, prop: "imei",isShow:e=>this.formData.procotol==6?true:false},
					{ type: "input", label: "设备编号", width: 300, prop: "iottag"},
					// { type: "textarea", label: "备注", width: 300, prop: "remark"},
				],
				formData: {
				  id:"",
				  procotol:1,
				  iotname: "",
				  iottag:"",
				  imei:""
				},
				formRules: {
					procotol: [
						{required: true,message: '请选择',trigger: 'blur'},
					],
					imei: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					iottag: [
						{required: true,message: '请输入',trigger: 'blur'},
					]
				},
				formHandle: [
				  {
				    label: "确认",
				    type: "primary",
				    icon: "el-icon-circle-plus-outline",
				    handle: e => this.elFormSubmit(),
				  },
				  {
				    label: "取消",
				    icon: "el-icon-circle-close",
				    handle: e =>this.elFormVisible(),
				  },
				]
			}
		},
		created() {
			this.init();
		},
		methods:{
			open(row){
				this.$router.push({
					path:'/tdevice-openRecord',
					query:{
						iotTag:row.iotTag
					}
				})
			},
			seach(){
				this.tableData=[];
				this.pagination.pageNumber=1;
				this.init();
			},
			init(){
				this.load=true;
				
				let params = {...this.pagination,...this.searchData};
				this.$http.post(this.url+'/iotwebapi/api/netlock/getDeviceListPage',params).then((res)=>{
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
			elFormSubmit(){
				let url="";
				if(this.formData.id){   //  编辑
					url=this.url+'/iotwebapi/api/publicrental/area/updateArea';
				}else{   //  新增
					url=this.url+'/iotwebapi/api/netlock/addDevice';
					if(this.formData.procotol==6){
						this.formData.iotname=this.formData.imei;
					}
				}
				 this.$refs.elForm.$refs.ruleForm.validate((valid) => {
				 	if (valid) {
				 		this.$http.post(url,this.formData).then((res)=>{
				 			console.log(res);
				 			if(res.resultCode==0){
				 				this.$message({
				 				  message: this.formData.id?'编辑成功':'添加成功',
				 				  type: 'success',
				 				  duration:1300,
								  offset:400,
				 				  onClose:res=>{
				 				  	this.elFormVisible();
				 				  	this.init();
				 				  }
				 				});
				 			}else if(res.resultCode==136){
								this.$message.error("没有绑定第三方账号");
							}else{
				 				this.$message.error(res.message);
				 			}
				 		})
				 	}
				 })
			},
			del(e){
				this.$confirm("确定要删除当前？", '提示', {
					 confirmButtonText: '确定',
					 cancelButtonText: '取消',
					 type: 'error'
				}).then(() => {
					this.$http.post(this.url+'/iotwebapi/api/netlock/deleteDevice',{"iottag":e.iotTag}).then((res)=>{
						console.log(res);
						if(res.resultCode==0){
							this.$message({
								message: '删除成功',
								type: 'success',
								duration:1300,
								offset:400,
								onClose:res=>{
									this.init();
								}
							});
						}else{
							this.$message.error(res.message);
						}
					 })
				}).catch(() => {
					 this.$message({
						 type: 'info',
						 message: '已取消'
					 });          
				});		
			}
		}
	}
</script>

<style>
</style>