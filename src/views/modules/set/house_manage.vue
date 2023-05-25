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
		  labelWidth="100px"
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
				searchData: {
					name:""
				},
				searchForm: [
				  {label: "小区名称", type: "input",  prop: "name", width: 160 },
				],
				searchHandle:[
				  {type: "info",icon: "el-icon-refresh", handle: e => this.searchFromReset()},
				  {label: "查询",type: "primary",icon: "el-icon-search",handle: e =>this.seach()},
				  // {label: "添加小区",type: "primary",handle: e => this.elFormVisible()},
				],
				load:false,
				pagination: { pageSize: 10, pageNumber: 1, total: 0 },
				tableData: [],
				tableCols: [
				  { label: "省", prop: "provinceName"},
				  { label: "市", prop: "cityName"},
				  { label: "区", prop: "countyName"},
				  { label: "街道", prop: "streetName"},
				  // { label: "地址", prop: "address"},
				  { label: "小区名称", prop: "name"},
				  {
				    label: "操作",
				    type: "button",
				    width: 260,
				    btnList: [
					  // {
					  // 	label: "编辑",
					  //   type: "primary",
					  //   size: "mini",
					  //   handle: (row) => this.refund(row) ,
					  // },
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
					{ type: "select", label: "省", width: 300, prop: "province",options:[],change: e => this.city(e)},
					{ type: "select", label: "市", width: 300, prop: "city",options:[],change: e => this.county(e)},
					{ type: "select", label: "区", width: 300, prop: "county",options:[],change: e => this.street(e)},
					{ type: "select", label: "街道", width: 300, prop: "street",options:[]},
					{ type: "input", label: "地址", width: 300, prop: "address"},
					{ type: "input", label: "小区名称", width: 300, prop: "name"},
				],
				formData: {
				  id:"",
				  areaId:"",
				  province:"",
				  city:'',
				  county:"",
				  street:"",
				  address: "",
				  name:""
				},
				formRules: {
					province: [
						{required: true,message: '请选择',trigger: 'blur'},
					],
					city: [
						{required: true,message: '请选择',trigger: 'blur'},
					],
					county: [
						{required: true,message: '请选择',trigger: 'blur'},
					],
					street: [
						{required: true,message: '请选择',trigger: 'blur'},
					],
					address: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					name: [
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
			this.province();
		},
		methods:{
			province(){  //  省
				this.$http.post(this.url+'/iotwebapi/api/dic/listProvince').then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.formCols[0].options.push({label:res.data.datas[i].name,value:res.data.datas[i].code});
						}
					}
				})
			},
			city(e){  // 市
				console.log(e);
				if(!this.formData.id){
					this.formData.city="";
					this.formData.county="";
					this.formData.street="";
					this.formCols[1].options=[];
					this.formCols[2].options=[];
					this.formCols[3].options=[];
				}	
				
				this.$http.post(this.url+'/iotwebapi/api/dic/listCity',{code:e}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.formCols[1].options.push({label:res.data.datas[i].name,value:res.data.datas[i].code});
						}
					}
				})
			},
			county(e){  //  区
				console.log(e);
				if(!this.formData.id){
					this.formData.county="";
					this.formData.street="";
					this.formCols[2].options=[];
					this.formCols[3].options=[];
				}
				this.$http.post(this.url+'/iotwebapi/api/dic/listCounty',{code:e}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.formCols[2].options.push({label:res.data.datas[i].name,value:res.data.datas[i].code});
						}
					}
				})
			},
			street(e){  // 街道
				console.log(e);
				if(!this.formData.id){
					this.formData.street="";
					this.formCols[3].options=[];
				}
				this.$http.post(this.url+'/iotwebapi/api/dic/listStreet',{code:e}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.formCols[3].options.push({label:res.data.datas[i].name,value:res.data.datas[i].code});
						}
					}
				})
			},
			init(){
				this.load=true;
				let params = {...this.pagination,...this.searchData}
				this.$http.post(this.url+'/iotwebapi/api/publicrental/area/listArea',params).then((res)=>{
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
			seach(){
				this.pagination.pageNumber=1;
				this.init();
			},
			refund(e){  //  编辑
			    Object.keys(this.formData).forEach(key=>{
			    	this.formData[key] = e[key]
			    })
				this.formData.id = e.areaId;
				this.formData.areaId = e.areaId;
				this.city(e.province);
				this.county(e.city);
				this.street(e.county);
			    this.elFormVisible();
			},
			elFormSubmit(){
				let url="";
				let data={};
				if(this.formData.id){   //  编辑
					url=this.url+'/iotwebapi/api/publicrental/area/updateArea';
				}else{   //  新增
					url=this.url+'/iotwebapi/api/publicrental/area/addArea';
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
				 			}else{
				 				this.$message.error(res.message);
				 			}
				 		})
				 	}
				 })
			},
			del(e){
				this.$confirm("删除小区,同时会删除对应的房源？", '警告', {
					 confirmButtonText: '确定',
					 cancelButtonText: '取消',
					 type: 'error'
				}).then(() => {
					this.$prompt('请输入登录密码', '提示', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消'
					}).then(({ value }) => {
					    this.$cookie.set("token", "");
						let formdatas = new FormData();
						    formdatas.append('username',localStorage.getItem("username"));
							formdatas.append('password',value);
							formdatas.append('grant_type',"password");
							formdatas.append('client_id',"anlock_restful_client");
							formdatas.append('client_secret',"anlock_secret_2018");
					   this.$http.post(this.url+"/iotwebapi/oauth/token",formdatas).then((res) => {
						  if(res.resultCode==0){	
							  this.$cookie.set("token", res.access_token);
							  this.$http.post(this.url+'/iotwebapi/api/publicrental/area/delArea',{"areaId":e.areaId}).then((res)=>{
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
						  }else{
							 this.$message.error(res.message); 
						  } 
					   })
					}).catch(() => {
					  this.$message({
						type: 'info',
						message: '取消输入'
					  });       
					});
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