<template>
	<div class="ad">
	
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
	   
		 <div class="box" v-show="show_look">
			 <div class="box_in">
				 <div class="title">请勾选要查看的设备</div>
				 <div class="change_box">
					 <el-checkbox  @change="handleCheckAllChange">全选</el-checkbox>
					 <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
						 <el-checkbox v-for="city in cities" :label="city.id" :key="city.id">{{city.lable}}</el-checkbox>
					 </el-checkbox-group>
				 </div>
				 <el-button type="info" @click="change_look">取消</el-button>
				 <el-button type="primary" @click="qr_look">确定</el-button>
			 </div>
		 </div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				show_look:false,
				id:"",
				checkedCities: [],
				cities: [],
				load:false,
				pagination: { pageSize: 10, page: 1, total: 0 },
				show_add:false,
				show_text:false,
				searchData: {
					name:"",
					times:'',
					startTime:"",
					endTime:"",
				},
				searchForm: [
				  {label: "广告名称", type: "input",  prop: "name", width: 160 },
				  {label: "日期搜索", type: "daterange",  prop: "times", width: 320 },
				],
				searchHandle:[
				  {type: "info",icon: "el-icon-refresh", handle: e => this.searchFromReset()},
				  {label: "查询",type: "primary",icon: "el-icon-search",handle: e =>this.seach()},
				  {label: "添加广告",type: "primary",handle: e => this.elFormVisible()},
				],
				tableData: [],
				tableCols: [
				  { label: "ID", prop: "id"},
				  { label: "广告标题", prop: "name"},
				  { label: "广告内容", prop: "content"},
				  { label: "类型", prop: "type",formatter:e=>  e.type==1?"图片":"视频"},
				  { label: "广告位置", prop: "position",formatter:e=>  e.position==1?"apk全屏":"apk首页"},
				  { label: "状态", prop: "status",formatter:e=>  e.status==0?"已上架":"已下架"},
				  { label: "创建时间", prop: "ctime"},
				  {
				    label: "操作",
				    type: "button",
				    width: 260,
				    btnList: [
					  {
					  	label: "编辑",
					    type: "primary",
					    size: "mini",
					    handle: (row) => this.refund(row) ,
					  },
					  {
					  	label: "下发设备",
					    type: "primary",
					    size: "mini",
					    handle: (row) => this.look(row) ,
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
				  { type: "input", label: "广告标题", width: 300, prop: "name"},
					{ type: "select", label: "广告位置", width: 300, prop: "position",options:[{label:'apk全屏',value:1},{label:'apk首页',value:2}]},
					{ type: "select", label: "上架/下架", width: 300, prop: "status",options:[{label:'上架',value:0},{label:'下架',value:1}]},
				  { type: "input", label: "广告内容", width: 300, prop: "content"},
					{ type: "select", label: "广告类型", width: 300, prop: "type",options:[{label:'图片',value:1},{label:'视频',value:2}]},
					{ type: "upload", label: "文件（图片/视频）", width: 300, prop: "imgUrl",success:(res,file)=>{this.$refs.elForm.loading = false ;this.formData.imgUrl = res.data}},
				  // { type: "select", label: "商家", width: 300, prop: "merchantId",options:[],isDisabled:row=>(this.formData.position!=1)||(this.type==8)},
				  // { type: "checkbox", label: "投放设备", width: 300, prop: "macnolist",checkboxs:[],isDisabled:row=>this.formData.position!=1},
				],
				formData: {
					id:"",
				  name:"",
				  position:'',
				  imgUrl:"",
				  content: "",
					status:"",
					type:""
				},
				formRules: {
					name: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					imgUrl: [
						{required: true,message: '请上传',trigger: 'blur'},
					],
					position: [
						{required: true,message: '请选择',trigger: 'blur'},
					],
					type: [
						{required: true,message: '请选择',trigger: 'blur'},
					],
					content: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					status: [
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
		created(){
			this.init();
			this.macno_list();
		},
		methods:{
			seach(){
				console.log(this.searchData.times);
				if(this.searchData.times){
					this.searchData.startTime=new Date(this.searchData.times[0]+" 00:00:00").getTime();
					this.searchData.endTime=new Date(this.searchData.times[1]+" 23:59:59").getTime();
				}
				this.init();
			},
			macno_list(){   //  设备列表 
				this.$http.formData('/sys/device/list',{page: 1,pageSize: 1000}).then((res)=>{
					console.log(res);
					if(res.code==1){
						for(let i=0;i<res.data.list.length;i++){
							this.cities.push({lable:res.data.list[i].deviceName,id:res.data.list[i].id})
						}
					}
				})
			},
			init(){
				this.load=true;
				let params = {...this.pagination,...this.searchData}
				this.$http.formData('/system/advert/list',params).then((res)=>{
					console.log(res);
					this.load=false;
					if(res.code==200){
						this.pagination.total=res.data.totalCount;
						this.tableData=res.data.list;
					}else{
						this.$message.error(res.msg);
					}
				})
			},
			refund(e){  //  编辑
			    Object.keys(this.formData).forEach(key=>{
			    	this.formData[key] = e[key]
			    })
					this.formData.id = e.id;
			    this.elFormVisible();
			},
			look(row){   //  查看设备
				this.show_look=true;
				this.id=row.id;
			},
			change_look(){
				this.show_look=false;
			},
			qr_look(){
				if(this.checkedCities.length==0){
					this.$message.error("请先勾选设备");
					return false;
				}
				this.show_look=false;
				this.$http.post('/system/advert/assign',{id:this.id,deviceIds:this.checkedCities}).then((res)=>{
					console.log(res);
					if(res.code==200){
						this.$message({
						  message: '下发成功',
						  type: 'success',
						  duration:1300,
						  onClose:res=>{
								this.checkedCities=[];
						  	this.init();
						  }
						});
					}else{
						this.$message.error(res.msg);
					}
				})
			},
			elFormSubmit(){
				let url="";
				if(this.formData.id){   //  编辑
					url="/system/advert/update";
				}else{   //  新增
					url="/system/advert/save";
				}
				 this.$refs.elForm.$refs.ruleForm.validate((valid) => {
				 	if (valid) {
				 		this.$http.formData(url,this.formData).then((res)=>{
				 			console.log(res);
				 			if(res.code==200){
				 				this.$message({
				 				  message: this.formData.id?'编辑成功':'添加成功',
				 				  type: 'success',
				 				  duration:1300,
				 				  onClose:res=>{
				 				  	this.elFormVisible();
				 				  	this.init();
				 				  }
				 				});
				 			}else{
				 				this.$message.error(res.msg);
				 			}
				 		})
				 	}
				 })
			},
			handleCheckedCitiesChange(val){
				this.checkedCities=val;
				console.log(this.checkedCities);
			},
			handleCheckAllChange(val){
				console.log(val);
				this.checkedCities=[];
				if(val==true){  //  全选 
					for(let i=0;i<this.cities.length;i++){
						this.checkedCities.push(this.cities[i].id);
					}
					console.log(this.checkedCities);
				}
			},
			del(e){
				this.$confirm("是否要删除？", '提示', {
					 confirmButtonText: '确定',
					 cancelButtonText: '取消',
					 type: 'warning'
				}).then(() => {
					this.$http.formData("/system/advert/delete",{"id":e.id}).then((res)=>{
						console.log(res);
						if(res.code==200){
							this.$message({
								message: '删除成功',
								type: 'success',
								duration:1300,
								onClose:res=>{
									this.init();
								}
							});
						}else{
							this.$message.error(res.msg);
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

<style scoped>
	/* .ad{
		position:relative;
	} */
	.box{
		position:fixed;
		width:100%;
		height:100%;
		background:rgba(0,0,0,0.6);
		top:0px;
		left:0px;
		z-index:999;
	}
	.box_in{
		position:absolute;
		background:#fff;
		height:500px;
		width:600px;
		top:50%;
		margin-top:-250px;
		left:50%;
		margin-left:-260px;
		text-align:center;
		padding-top:20px;
		
	}
	.box_in .change_box{
		overflow-y:scroll;
		height:350px;
	}
</style>

