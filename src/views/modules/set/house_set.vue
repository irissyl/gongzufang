<template>
	<div>
		<r-search
		    labelWidth="75px"
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
		   :isSelection="true"
		   @select="dels"
		/>
		
		<r-form
		  dialogWidth="1000px"
		  labelWidth="100px"
		  :isHandle="true"
		  :formCols="formCols"
		  :formHandle="formHandle"
		  :formData="formData"
		  :formRules="formRules"
		  ref="elForm"
		 />
		 
		 <el-dialog
		   title="提示"
		   :visible.sync="dialogVisible"
		   width="500px">
		   <span>正在删除中...</span>
		   <el-progress :percentage="progre"></el-progress>
		   <span slot="footer" class="dialog-footer">
		     <el-button @click="dialogVisible = false">取 消</el-button>
		     <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		   </span>
		 </el-dialog>
		 
		 
		 <el-dialog
		   title="获取临时密码"
		   :visible.sync="getpassword"
		   width="360px"
		   class="getpass"
		   >
		   <p style="color:#f00;text-align:center;">有效时间为半个小时</p>
		   <p><span class="label">临时密码：</span><span class="col">{{namedata.password}}</span></p>
		   <p v-if="namedata.name"><span class="label">承租人姓名：</span>{{namedata.name}}</p>
		   <p v-if="namedata.phone"><span class="label">承租人联系方式：</span>{{namedata.phone}}</p>
		   <p v-if="namedata.idcard"><span class="label">承租人身份证号：</span>{{namedata.idcard}}</p>
		   <p style="color:#f00;text-align:center;" v-if="!namedata.name">暂无人员入住</p>
		   <span slot="footer" class="dialog-footer">
		     <el-button @click="getpassword = false">取 消</el-button>
		     <el-button type="primary" @click="getpassword = false">确 定</el-button>
		   </span>
		 </el-dialog>
	</div>
</template>

<script>
	export default{	
		data(){
			return{
				namedata:{
					password:"",
					name:"",
					phone:"",
					idcard:""
				},
				getpassword:false,
				setlockTag:"",  //  修改门锁
				progre:0,
				dialogVisible:false,
				roomIds:[],
				roomin:[], // 有人入住
				url:process.env.VUE_APP_URL,
				searchData: {
					areaName:"",
					roomType:"",
					building:"",
					roomNo:"",
					province:"",
					city:"",
					county:"",
					street:"",
					lockTag:""
				},
				searchForm: [
				  // { type: "select",label: "省份",  prop: "province", width: 160,options:[],change: e => this.city(e)},
				  // { type: "select",label: "城市",  prop: "city", width: 160,options:[],change: e => this.county(e)},
				  // { type: "select",label: "县市",  prop: "county", width: 160,options:[],change: e => this.street(e)},
				  // { type: "select",label: "街道",  prop: "street", width: 160,options:[]},
				  {label: "小区名称", type: "input",  prop: "areaName", width: 150 },
				  {label: "楼栋", type: "input",  prop: "building", width: 150 },
				  {label: "房间号", type: "input",  prop: "roomNo", width: 150 },
				  {label: "房屋类别", type: "select",  prop: "roomType", width: 150,options:[
					  {label:"一房一厅",value:"一房一厅"},
					  {label:"两房一厅",value:"两房一厅"},
					  {label:"三房一厅",value:"三房一厅"},
					  {label:"三房两厅",value:"三房两厅"},
					  {label:"四房一厅",value:"四房一厅"},
					  {label:"四房两厅",value:"四房两厅"}
				  ]},
				  {label: "门锁编码", type: "input",  prop: "lockTag", width: 150 },
				],
				searchHandle:[
				  {type: "info",icon: "el-icon-refresh", handle: e => this.searchFromReset()},
				  {label: "删除房源", icon: 'el-icon-delete', type: "primary", handle: e => this.allDel()},
				  {label: "添加房源", icon: 'el-icon-plus', type: "primary", handle: e => this.add()},
				  {label: "查询",type: "primary",icon: "el-icon-search",handle: e =>this.seach()}
				],
				load:false,
				pagination: { pageSize: 10, pageNumber: 1, total: 0 },
				tableData: [],
				tableCols: [
				  { label: "小区名称", prop: "areaName"},
				  { label: "楼栋", prop: "building"},
				  { label: "单元", prop: "unit"},
				  { label: "楼层", prop: "floor"},
				  { label: "房间号", prop: "roomNo"},
				  { label: "房屋类别", prop: "roomType"},
				  { label: "面积", prop: "size"},
				  { label: "图片", prop: "pic",type: "images"},
				  { label: "房东姓名", prop: "landlord"},
				  { label: "房东电话", prop: "landlordPhone"},
				  { label: "门锁编码", prop: "lockTag"}, 
				  { label: "房屋属性", prop: "roomAttrib"},
				  { label: "租赁方式", prop: "rentType"},
				  { label: "一个月租金", prop: "m1"},
				  { label: "一个月押金", prop: "d1"},
				  { label: "三个月租金", prop: "m3"},
				  { label: "三个月押金", prop: "d3"},
				  { label: "半年租金", prop: "m6"},
				  { label: "半年押金", prop: "d6"},
				  { label: "一年租金", prop: "m12"},
				  { label: "一年押金", prop: "d12"},
				  { label: "水表编码", prop: "waterTag"},
				  { label: "电表编码", prop: "meterTag"},
				  { label: "冰箱", prop: "icebox"},
				  { label: "空调", prop: "airConditioner"},
				  { label: "电视", prop: "tv"},
				  { label: "热水器", prop: "waterHeater"},
				  { label: "燃气灶", prop: "gasStove"},
				  { label: "马桶", prop: "toilet"},
				  { label: "抽油烟机", prop: "rangeHood"},
				  { label: "床", prop: "bed"},
				  { label: "柜", prop: "cabinet"},
				  { label: "桌", prop: "desk"},
				  { label: "椅", prop: "chair"},
				  {
				    label: "操作",
				    type: "button",
					fixed:"right",
				    width: 200,
				    btnList: [
					  {
					  	label: "远程开门",
					    type: "primary",
					    size: "mini",
					    handle: (row) => this.open(row) ,
					  },
					  {
					  	label: "编辑",
					    type: "primary",
					    size: "mini",
					    handle: (row) => this.refund(row) ,
					  },
					  {
					  	label: "临时密码",
					    type: "primary",
					    size: "mini",
						class:"marginLeft",
					    handle: (row) => this.parsword(row) ,
					  },
					  
					  {
						label: "删除",
						type: "danger",
						size: "mini",
						class:"marginLeft1",
						handle: (row) => this.del(row) ,
					  },
				    ]
				  }
				],
				formCols: [
					{ type: "select",label: "省份",  prop: "province", width: 160,options:[],
					change: e => this.cityform(e),isShow: e => !this.formData.id ? true : false},
					{ type: "select",label: "城市",  prop: "city", width: 160,options:[],
					change: e => this.countyform(e),isShow: e => !this.formData.id ? true : false},
					{ type: "select",label: "县市",  prop: "county", width: 160,options:[],
					change: e => this.streetform(e),isShow: e => !this.formData.id ? true : false},
					{ type: "select",label: "街道",  prop: "streetCode", width: 160,options:[],
					isShow: e => !this.formData.id ? true : false},
					
					{ type: "input", label: "小区名称", width: 160, prop: "areaName",isDisabled: e => this.formData.id ? true : false},
					{ type: "input", label: "楼栋", width: 160, prop: "building",isDisabled: e => this.formData.id ? true : false},
					{ type: "input", label: "单元", width: 160, prop: "unit",isDisabled: e => this.formData.id ? true : false},
					{ type: "input", label: "楼层", width: 160, prop: "floor",isDisabled: e => this.formData.id ? true : false},
					{ type: "input", label: "房间号", width: 160, prop: "roomNo",isDisabled: e => this.formData.id ? true : false},
					{ type: "input", label: "房屋类别", width: 160, prop: "roomType",isDisabled: e => this.formData.id ? true : false},
					{ type: "input", label: "面积", width: 160, prop: "size"},
					{ type: "input", label: "房东姓名", width: 160, prop: "landlord"},
					{ type: "input", label: "房东电话", width: 160, prop: "landlordPhone"},
					{ type: "input", label: "房屋属性", width: 160, prop: "roomAttrib"},
					{ type: "input", label: "租赁方式", width: 160, prop: "rentType"},
					{ type: "number", label: "月租金", width: 160, prop: "m1"},
					{ type: "number", label: "季租金", width: 160, prop: "m3"},
					{ type: "number", label: "半年租金", width: 160, prop: "m6"},
					{ type: "number", label: "年租金", width: 160, prop: "m12"},
					{ type: "number", label: "月押金", width: 160, prop: "d1"},
					{ type: "number", label: "季押金", width: 160, prop: "d3"},
					{ type: "number", label: "半年押金", width: 160, prop: "d6"},
					{ type: "number", label: "年押金", width: 160, prop: "d12"},
					{ type: "input", label: "门锁编码", width: 160, prop: "lockTag"},
					{ type: "input", label: "水表编码", width: 160, prop: "waterTag"},
					{ type: "input", label: "电表编码", width: 160, prop: "meterTag"},
					{ type: "input", label: "冰箱", width: 160, prop: "icebox"},
					{ type: "input", label: "空调", width: 160, prop: "airConditioner"},
					{ type: "input", label: "电视", width: 160, prop: "tv"},
					{ type: "input", label: "热水器", width: 160, prop: "waterHeater"},
					{ type: "input", label: "燃气灶", width: 160, prop: "gasStove"},
					{ type: "input", label: "马桶", width: 160, prop: "toilet"},
					{ type: "input", label: "抽油烟机", width: 160, prop: "rangeHood"},
					{ type: "input", label: "床", width: 160, prop: "bed"},
					{ type: "input", label: "柜", width: 160, prop: "cabinet"},
					{ type: "input", label: "桌", width: 160, prop: "desk"},
					{ type: "input", label: "椅", width: 160, prop: "chair"},
					{ type: "uploadList", label: "房源图片（最多5张）",width: 800, prop: "pic",change:(file,fileList)=>{	
						console.log("change",fileList);
						this.file_pic=fileList;
					  },handleRemove:(file,fileList)=>{
						this.file_pic=fileList;
						console.log("handleRemove",fileList);
					  },
				   },
					// { type: "tinymce", label: "介绍信息", width: 660, prop: "chair"},
				],
				formData: {
				  province:"",
				  city:"",
				  county:"",
				  streetCode:"",
				  id:"",
				  roomId:0,
				  areaName:"",
				  building:"",
				  unit:"",
				  floor:"",
				  roomNo:"",
				  roomType:"",
				  size:"",
				  landlord:"",
				  landlordPhone:"",
				  roomAttrib:"",
				  rentType:"",
				  m1:"",
				  d1:"",
				  m3:"",
				  d3:"",
				  m6:"",
				  d6:"",
				  m12:"",
				  d12:"",
				  lockTag:"",
				  waterTag:"",
				  meterTag:"",
				  icebox:"",
				  airConditioner:"",
				  tv:"",
				  waterHeater:"",
				  gasStove:"",
				  toilet:"",
				  rangeHood:"",
				  bed:"",
				  cabinet:"",
				  desk:"",
				  chair:"",
				  img1:"",
				  img2:'',
				  img3:"",
				  img4:"",
				  img5: "",
				  pic:[],
				  roomState:""
				},
				file_pic:[],  //  上传文件
				file_pic_raw:[],
				formRules: {
					areaName: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					building: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					unit: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					floor: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					roomNo: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					roomType: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					size: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					landlord: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					landlordPhone: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					roomAttrib: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					rentType: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					m1: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					d1: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
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
			// this.province();	
		},
		methods:{
			open(row){   //  远程开门
			   this.$confirm("是否要远程开门？", '提示', {
			   	 confirmButtonText: '确定',
			   	 cancelButtonText: '取消',
			   	 type: 'warning'
			    }).then(() => {
					this.$http.post(this.url+'/iotwebapi/api/netlock/OpenDoor',{"iottag":row.lockTag}).then((res)=>{
						
						if(res.resultCode==0){
							this.$message({
								message: '开门成功',
								type: 'success',
								duration:3000,
								offset:400
							});
						}else{
							this.$message.error("当前房间，没有这个门锁");
						}
					})
				}).catch(() => {
					 this.$message({
						 type: 'info',
						 message: '已取消'
					 });          
				});	
			},
			parsword(row){   // 临时密码
			    // this.$confirm("确定要获取临时密码？", '提示', {
			    // 	 confirmButtonText: '确定',
			    // 	 cancelButtonText: '取消',
			    // 	 type: 'warning'
			    //  }).then(() => {
					this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/listOrder',{roomId:row.roomId}).then((res)=>{
						console.log(res);
						if(res.resultCode==0){
							    let namedata="";
								if(res.data.datas.length>0){
									namedata=res.data.datas[0].customers[0];
								}
								this.$http.get(this.url+'/iotwebapi/api/netlock/getAlgTempPwd',{"iottag":row.lockTag,"onetime":true}).then((res)=>{
									if(res.resultCode==0){
										this.getpassword=true;
										this.namedata.password=res.data.pwd;
										if(namedata){
											this.namedata.name=namedata.customerName; 
											this.namedata.phone=namedata.mobile1;
											this.namedata.idcard=namedata.idcard;
										}
									}
								})
							
						} 
					})
				// }).catch(() => {
				// 	 this.$message({
				// 		 type: 'info',
				// 		 message: '已取消'
				// 	 });          
				// });	
			},
			delroom(roomId,oindex){
				this.$http.post(this.url+'/iotwebapi/api/publicrental/room/delRoom',{"roomId":roomId}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						this.progre=oindex;
						if(this.progre==100){
							this.dialogVisible=false;
							this.init();
							this.$message({
								message: '删除成功',
								type: 'success',
								duration:1300,
								offset:400
							});
							
						}
					}
				 })
			},
			allDel(){
				if(this.roomIds.length==0){
					this.$message.error("请先勾选要删除的房源");
				}else{
					if(this.roomin.length==0){
						this.$confirm("是否要删除？", '提示', {
							 confirmButtonText: '确定',
							 cancelButtonText: '取消',
							 type: 'warning'
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
							  		 this.dialogVisible=true;
							  		 let oindex=(10/this.roomIds.length)*10;
										for(let i=0;i<this.roomIds.length;i++){
											console.log(i);
											console.log(oindex*(i+1));
											this.delroom(this.roomIds[i],oindex*(i+1));
										}
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
					}else{
						this.$message.error(this.roomin.toString()+"号房间有人入住，请重新勾选!");
					}
				}
			},
			dels(data){
				this.roomIds=[];
				this.roomin=[];
				for(let i=0;i<data.length;i++){
					if(data[i].roomState=="入住"){
						this.roomin.push(data[i].roomNo);
						this.$message.error(data[i].roomNo+"号房间有人入住，请重新勾选!");
					}
					this.roomIds.push(data[i].roomId);
					
					
				}
				console.log(this.roomIds);
			},
			init(){
				this.load=true;
				let params = {...this.pagination,...this.searchData}
				this.$http.post(this.url+'/iotwebapi/api/publicrental/area/listRoom',params).then((res)=>{
					console.log(res);
					this.load=false;
					if(res.resultCode==0){
						this.pagination.total=res.data.dataCount;
						for(let i in res.data.datas){
							res.data.datas[i].pic=[];
							if(res.data.datas[i].img1){
								res.data.datas[i].img1=this.url+'/iotwebapi'+res.data.datas[i].img1;
								res.data.datas[i].pic.push(res.data.datas[i].img1)
							}
							if(res.data.datas[i].img2){
								res.data.datas[i].pic.push(this.url+'/iotwebapi'+res.data.datas[i].img2)
							}
							if(res.data.datas[i].img3){
								res.data.datas[i].pic.push(this.url+'/iotwebapi'+res.data.datas[i].img3)
							}
							if(res.data.datas[i].img4){
								res.data.datas[i].pic.push(this.url+'/iotwebapi'+res.data.datas[i].img4)
							}
							if(res.data.datas[i].img5){
								res.data.datas[i].pic.push(this.url+'/iotwebapi'+res.data.datas[i].img5)
							}
							
						}
						this.tableData=res.data.datas;
						console.log("this.tableData",this.tableData);
					}else{
						this.$message.error(res.message);
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
				this.setlockTag=e.lockTag;
				this.formData.id = e.roomId;
				this.$refs.elForm.fileList=[];
				if(this.formData.id){
					if(this.formData.pic.length>0){  //  回显图片
						for(let i in this.formData.pic){
							this.$refs.elForm.fileList.push({name:i,url:this.formData.pic[i]});
						}
					}
				}
				
			    this.elFormVisible();
			},
			add(){
				this.$refs.elForm.fileList=[];
				this.elFormVisible();
			},
			elFormSubmit(){
				let url="";
				let data=this.formData;
				if(this.formData.id){   //  编辑
				    delete data.pic; 
					this.img1="";
					this.img2="";
					this.img3="";
					this.img4="";
					this.img5="";
					if(this.file_pic.length>0){
						for(let i in this.file_pic){
							if(this.file_pic[i].raw){
								if(i==0){
									this.img1=this.file_pic[0].raw;
								}else if(i==1){
									this.img2=this.file_pic[1].raw;
								}else if(i==2){
									this.img3=this.file_pic[2].raw;
								}else if(i==3){
									this.img4=this.file_pic[3].raw;
								}else if(i==4){
									this.img5=this.file_pic[4].raw;
								}
							}
						}
					}
					data.img1="";
					data.img2="";
					data.img3="";
					data.img4="";
					data.img5="";
					url=this.url+'/iotwebapi/api/publicrental/room/updateRoom';
					
					// if(this.formData.lockTag!=this.setlockTag){   //  换门锁了
					// 	this.$http.post(this.url+'/iotwebapi/api/netlock/replaceDevice',{
					// 		iottag:this.setlockTag,
					// 		newtag:this.formData.lockTag
					// 	}).then((res)=>{
					// 		if(res.resultCode==0){
					// 			this.$message({
					// 			  message: '门锁更换成功',
					// 			  type: 'success',
					// 			  duration:2000,
					// 			  offset:400,
					// 			  onClose:res=>{
					// 			  	 this.auto();
					// 			  }
					// 			});
					// 		}
					// 	})
					// }else{
					// 	this.auto();
					// }
					
				}else{   //  新增
				    if(this.formData.streetCode){
						this.formData.roomState="待入住";
						url=this.url+'/iotwebapi/api/publicrental/room/addRoom';
					}else{
						this.$message.error("请选择省、市、区、街道");
						return false;
					}
					// this.auto();
				}
			    
				let formdatas = new FormData();
				    formdatas.append('roomJson',JSON.stringify(data));
				    this.file_pic.forEach((file, index) => {
						console.log("file",file);
					  if(this.file_pic[index].raw){
						  formdatas.append(`img${index + 1}`, file.raw);
					  }
					});
				
				 this.$refs.elForm.$refs.ruleForm.validate((valid) => {
				 	if (valid) {
				 		this.$http.post(url,formdatas).then((res)=>{
				 			console.log(res);
				 			if(res.resultCode==0){
				 				this.$message({
				 				  message: this.formData.id?'编辑成功':'添加成功',
				 				  type: 'success',
				 				  duration:2000,
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
			   // }
			},
			del(e){
				if(e.roomState=="入住"){
					this.$message.error("当前房间已有人入住，不能删除");
				}else{
					this.$confirm("是否要删除？", '提示', {
						 confirmButtonText: '确定',
						 cancelButtonText: '取消',
						 type: 'warning'
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
								 this.$http.post(this.url+'/iotwebapi/api/publicrental/room/delRoom',{"roomId":e.roomId}).then((res)=>{
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
			},
			compressImg(file,name){
				let _self=this;
			    var src;
			    var fileSize = parseFloat(parseInt(file['size'])/1024/1024).toFixed(2);
			    var read = new FileReader();
			    read.readAsDataURL(file);
			    read.onload = function (e) {
			        var img = new Image();   
			        img.src = e.target.result;   
			        img.onload = function(){   
			            //默认按比例压缩   
			            var w = this.width,   
			                h = this.height;  
			            //生成canvas   
			            var canvas = document.createElement('canvas');   
			            var ctx = canvas.getContext('2d');  
			            var base64;
			            // 创建属性节点   
			            canvas.setAttribute("width", w);   
			            canvas.setAttribute("height", h); 
			            ctx.drawImage(this, 0, 0, w, h);   
			            if(fileSize<1){
			                //如果图片小于一兆 那么不执行压缩操作
			                base64 = canvas.toDataURL(file['type'], 1); 
			            }else if(fileSize>1&&fileSize<2){
			                //如果图片大于1M并且小于2M 那么压缩0.5
			                base64 = canvas.toDataURL(file['type'], 0.5); 
			            }else{
			                //如果图片超过2m 那么压缩0.2
			                base64 = canvas.toDataURL(file['type'], 0.2); 
			            }
			            // 回调函数返回file的值  
						console.log("base64",base64);
						// _self.dataURLtoBlob(base64,name)
						var arr = base64.split(','),
							mime = arr[0].match(/:(.*?);/)[1],
							bstr = atob(arr[1]),
							n = bstr.length,
							u8arr = new Uint8Array(n);
						while (n--) {
							u8arr[n] = bstr.charCodeAt(n);
						}
						console.log("里面",new File([u8arr], name, {type: mime}));
						console.log("里面大小",(new File([u8arr], name, {type: mime})).size);
						return new File([u8arr], name, {
							type: mime,
						})
			        }
			    }
			},
			dataURLtoBlob(dataurl, name) {//base64转file
			  var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			  while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			  }
			  return new File([u8arr], name, {
				type: mime,
			  })
			},
			province(){  //  省
				this.$http.post(this.url+'/iotwebapi/api/dic/listProvince',{ pageSize: 1000, pageNumber: 1}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){ 
							this.searchForm[0].options.push({label:res.data.datas[i].name,value:res.data.datas[i].code});
							this.formCols[0].options.push({label:res.data.datas[i].name,value:res.data.datas[i].code});
						}
					}
				})
			},
			city(e){ //  市
				console.log(e);
				this.searchData.city="";
				this.searchData.county="";
				this.searchData.street="";
				
				this.searchForm[1].options=[];
				this.searchForm[2].options=[];
				this.searchForm[3].options=[];
				
				this.$http.post(this.url+'/iotwebapi/api/dic/listCity',{code:e,pageSize: 1000, pageNumber: 1}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.searchForm[1].options.push({label:res.data.datas[i].name,value:res.data.datas[i].code});
						}
					}
				})
			},
			cityform(e){
				console.log(e);
				this.formData.city="";
				this.formData.county="";
				this.formData.streetCode="";
				
				this.formCols[1].options=[];
				this.formCols[2].options=[];
				this.formCols[3].options=[];
				
				this.$http.post(this.url+'/iotwebapi/api/dic/listCity',{code:e,pageSize: 1000, pageNumber: 1}).then((res)=>{
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
				this.searchData.county="";
				this.searchData.street="";
				this.searchForm[2].options=[];
				this.searchForm[3].options=[];
				this.$http.post(this.url+'/iotwebapi/api/dic/listCounty',{code:e,pageSize: 1000, pageNumber: 1}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.searchForm[2].options.push({label:res.data.datas[i].name,value:res.data.datas[i].code});
						}
					}
				})
			},
			countyform(e){  //  区
				console.log(e);
				this.formData.county="";
				this.formData.streetCode="";
				this.formCols[2].options=[];
				this.formCols[3].options=[];
				this.$http.post(this.url+'/iotwebapi/api/dic/listCounty',{code:e,pageSize: 1000, pageNumber: 1}).then((res)=>{
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
				this.searchData.street="";
				this.searchForm[3].options=[];
				this.$http.post(this.url+'/iotwebapi/api/dic/listStreet',{code:e,pageSize: 1000, pageNumber: 1}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.searchForm[3].options.push({label:res.data.datas[i].name,value:res.data.datas[i].code});
						}
					}
				})
			},
			streetform(e){  // 街道
				console.log(e);
				this.formData.streetCode="";
				this.formCols[3].options=[];
				this.$http.post(this.url+'/iotwebapi/api/dic/listStreet',{code:e,pageSize: 1000, pageNumber: 1}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.formCols[3].options.push({label:res.data.datas[i].name,value:res.data.datas[i].code});
						}
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.getpass{
		// text-align:center;
	}
	.getpass p{
		height:30px;
		line-height:30px;
		font-size:14px;
		.label{
			display:inline-block;
			width:150px;
			text-align:right;
		}
		.col{
			font-size:20px;
			font-weight:bold;
			color:#3f0;
		}
	}
</style>