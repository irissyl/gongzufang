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
		
		<el-dialog title="续租" width="440px" :visible.sync="dialogFormVisible">
		  <p style="height:40px;line-height:40px;">续租后时间</p>
		  <el-date-picker
		    v-model="value"
		    type="datetime"
			default-time="23:59:59"
		    placeholder="选择日期时间">
		  </el-date-picker>
		  <p style="height:40px;line-height:40px;">备注/详情</p>
		  <el-input
		    type="textarea"
			maxlength="30"
			show-word-limit
		    :autosize="{ minRows: 4, maxRows: 8}"
		    placeholder="请输入内容"
		    v-model="content">
		  </el-input>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="qr_goOn">确 定</el-button>
		  </div>
		</el-dialog>
		
		<el-dialog title="换房" width="440px" :visible.sync="changeRoom">
		  <p style="height:40px;line-height:40px;">地区</p>
		  <el-input placeholder="请输入内容" v-model="address"
		    :disabled="true">
		  </el-input>
		  <p style="height:40px;line-height:40px;">选择小区</p>
		  <el-select v-model="areaId" placeholder="请选择" @change="changeArea" style="width:100%;">
			  <el-option
				v-for="item in areaOptions"
				:key="item.value"
				:label="item.label"
				:value="item.value">
			  </el-option>
			</el-select>
			<p style="height:40px;line-height:40px;">选择楼栋</p>
			<el-select v-model="Buildingid" :disabled="!this.areaId" placeholder="请选择" @change="changeBuilding" style="width:100%;">
			  <el-option
				v-for="item in Buildingoptions"
				:key="item.value"
				:label="item.label"
				:value="item.value">
			  </el-option>
			</el-select>	
			<p style="height:40px;line-height:40px;">选择房间</p>
			<el-select v-model="roomid" :disabled="!this.Buildingid" placeholder="请选择" style="width:100%;">
			  <el-option
				v-for="item in roomoptions"
				:key="item.value"
				:label="item.label"
				:value="item.value">
			  </el-option>
			</el-select>	
		   <div slot="footer" class="dialog-footer">
			<el-button @click="changeRoom = false">取 消</el-button>
			<el-button type="primary" @click="qr_changeRoom">确 定</el-button>
		   </div>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				streetCode:"",  //  街道code
				address:"",
				areaOptions:[],
				areaId:"", // 小区id
				Buildingid:"",  //  楼栋id
				Buildingoptions:[],  //  
				roomoptions:[],
				roomid:"",  // 房id
				changeRoom:false,
				dialogFormVisible:false,			
				value:"",	
				content:"",
				orderId:"",
				url:process.env.VUE_APP_URL,
				load:false,
				pagination: { pageSize: 10, pageNumber: 1, total: 0 },
				searchData: {
					province:"",
					city:"",
					county:"",
					street:"",
					areaName:"",
					building:"",
					unit:"",
					customerName:"",
					mobile:'',
					// orderId:"",
					roomNo:"",
				},
				searchForm: [
				  // { type: "select",label: "省份",  prop: "province", width: 160,options:[],change: e => this.city(e)},
				  // { type: "select",label: "城市",  prop: "city", width: 160,options:[],change: e => this.county(e)},
				  // { type: "select",label: "县市",  prop: "county", width: 160,options:[],change: e => this.street(e)},
				  // { type: "select",label: "街道",  prop: "street", width: 160,options:[]},
				  { type: "input",label: "小区名称",  prop: "areaName", width: 160},
				  { type: "input",label: "楼栋",  prop: "building", width: 160},
				  { type: "input",label: "单元",  prop: "unit", width: 160},
				  { type: "input",label: "房间号",  prop: "roomNo", width: 160},
				  { type: "input",label: "承租人姓名",  prop: "customerName", width: 160},
				  { type: "input",label: "承租人手机",  prop: "mobile", width: 160},
				  // { type: "input",label: "订单编号",  prop: "orderId", width: 160},
				],
				searchHandle:[
				  {type: "info",icon: "el-icon-refresh", handle: e => this.searchFromReset()},
				  {label: "查询",type: "primary",icon: "el-icon-search",handle: e =>this.seach()} 
				],
				tableData: [],
				tableCols: [
				  // { label: "订单编号", prop: "orderId"},
				  { label: "姓名", prop: "customerName"},
				  { label: "性别", prop: "sex"},
				  { label: "手机号", prop: "mobile1", width:"120px"},
				  // { label: "公司名称", prop: "provinceName"},
				  { label: "小区名称", prop: "areaName"},
				  { label: "楼栋", prop: "building"},
				  { label: "单元", prop: "unit"},
				  { label: "房间号", prop: "roomNo"},
				  { label: "押金", prop: "deposit"},
				  { label: "租金", prop: "rent"},
				  // { label: "电费单价", prop: "provinceName"},
				  // { label: "电表读数", prop: "provinceName"},
				  // { label: "水费单价", prop: "provinceName"},
				  // { label: "水表读数", prop: "provinceName"},
				  // { label: "房租计费日期", prop: "cityName"},
				  { label: "入住起始", prop: "orderStart", width:"100px"},
				  { label: "入住到期", prop: "orderEnd", width:"100px"},
				  { label: "办理人员", prop: "inputUser"},
				  { label: "办理时间", prop: "orderTime", width:"100px"},
				  {
				    label: "操作",
				    type: "button",
					fixed:"right",
				    width: 260,
				    btnList: [
					  {
					  	label: "添加缴费",
					    type: "primary",
					    size: "mini",
					    handle: (row) => this.addFee(row) ,
					  },
					  {
					  	label: "详情",
					    type: "primary",
					    size: "mini",
					    handle: (row) => this.deails(row) ,
					  },
					  {
					  	label: "续租",
					    type: "primary",
					    size: "mini",
					    handle: (row) => this.goOn(row) ,
					  },
					  {
					  	label: "添加同住人",
					    type: "primary",
					    size: "mini",
					    handle: (row) => this.addCustomer(row) ,
					  },
					  {
					  	label: "换房",
					    type: "primary",
					    size: "mini",
					    handle: (row) => this.changeroom(row) ,
					  },
					  {
					  	label: "退租",
					    type: "danger",
					    size: "mini",
					    handle: (row) => this.exit(row) ,
					  },
					 //  {
						// label: "删除",
						// type: "danger",
						// size: "mini",
						// handle: (row) => this.del(row) ,
					 //  },
				    ]
				  }
				],
				formCols: [
					// { type: "input", label: "费用详情", width: 300, prop: "feeContent"},
					{ type: "select", label: "费用类型", width: 300, prop: "feeType",options:[
					  {label:"电费 (度)",value:"电费"},
					  {label:"水费 (吨)",value:"水费"},
					  {label:"物业费 (月)",value:"物业费"},
					  {label:"房租费 (月)",value:"房租费"},
					  {label:"停车费 (月)",value:"停车费"},
					  {label:"煤气费 (月)",value:"煤气费"},
					  {label:"其它",value:"其它"}
					]},
					{ type: "number", label: "数量", width: 300, prop: "feeCount"},
					{ type: "input", label: "收款费用编号(流水)", width: 300, prop: "feeId"},
					{ type: "select", label: "是否支付", width: 300, prop: "feePaid",
					  options:[{label:"是",value:true},{label:"否",value:false}]
					},
					{ type: "number", label: "单价", width: 300, prop: "feePrice"},
					{ type: "dateTime", label: "支付时间", width: 300, prop: "paidTime"},
					{ type: "select", label: "支付方式", width: 300, prop: "paidType",options:[
					  {label:"现金",value:"现金"},
					  {label:"微信",value:"微信"},
					  {label:"支付宝",value:"支付宝"},
					  {label:"刷卡",value:"刷卡"},
					  {label:"银行卡",value:"银行卡"}
				    ]},
					{ type: "textarea", label: "备注", width: 300, prop: "remark"},
				],
				formData: {
				  id:"",
				  feeContent:"",
				  feeCount:"",
				  feeId:"",
				  feePaid:'',
				  feePrice:"",
				  feeType:"",
				  orderId: "",
				  paidTime:"",
				  paidType:"",
				  remark:""
				},
				formRules: {
					feeCount: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					feePrice: [
						{required: true,message: '请输入',trigger: 'blur'},
					],
					feeType: [
						{required: true,message: '请选择',trigger: 'blur'},
					],
					paidType: [
						{required: true,message: '请选择',trigger: 'blur'},
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
			// this.province();
		},
		methods:{
			changeroom(row){   //  换房
			    this.orderId=row.orderId;
				this.changeRoom=true;
				this.address=row.provinceName+"/"+row.cityName+"/"+row.countyName+"/"+row.streetName;
			    this.streetCode=row.streetCode;
				this.areaOption(row.streetCode);
			},
			qr_changeRoom(){
				if(!this.roomid){
					this.$message.error("请选择房间");
					return false;
				}
				this.changeRoom=false;
				this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/updateOrder',{
					"orderId":this.orderId,
					"roomId":this.roomid
				}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						this.$message({
							message: '操作成功',
							type: 'success',
							duration:3000,
							offset:400,
							onClose:res=>{
								this.changeRoom=false;
								this.init();
							}
						});
					}else{
						this.$message.error(res.message);
					}
				})
			},
			areaOption(code){  //  
			    this.areaOptions=[];
				this.areaId="";
				this.Buildingid="";
				this.Buildingoptions=[];
				this.roomoptions=[];
				this.roomid="";
				this.$http.post(this.url+'/iotwebapi/api/publicrental/area/listArea',{ pageSize: 1000, street: code}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.areaOptions.push({label:res.data.datas[i].name,value:res.data.datas[i].areaId});
						}
					}
				})
			},
			changeArea(val){
				console.log(val);
				this.Buildingid="";
				this.Buildingoptions=[];
				this.roomoptions=[];
				this.roomid="";
				
				this.$http.post(this.url+'/iotwebapi/api/publicrental/room/listBuilding',{ pageNumber: 1,pageSize: 1000, areaId: val}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.Buildingoptions.push({label:res.data.datas[i],value:res.data.datas[i]});
						}
					}
				})
			},
			changeBuilding(val){
				console.log(val);
				this.roomoptions=[]; 
				this.roomid="";
				let aparm={
					areaId: this.areaId,
					street: this.streetCode,
					building: this.Buildingid,
					pageNumber: 1,
					pageSize: 1000
				}
				this.$http.post(this.url+'/iotwebapi/api/publicrental/area/listRoom',aparm).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							if(res.data.datas[i].roomState=="待入住"){
								this.roomoptions.push({label:res.data.datas[i].roomNo,value:res.data.datas[i].roomId});
							}
						}
					}
				})
			},
			province(){  //  省
				this.$http.post(this.url+'/iotwebapi/api/dic/listProvince',{ pageSize: 1000, pageNumber: 1}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.searchForm[0].options.push({label:res.data.datas[i].name,value:res.data.datas[i].code});
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
			auto_time(timdedetail){
			   //获取年份
			   var year=new Date(timdedetail).getFullYear();
			   //获取月份，获取的月份比实际小1，所以在使用的时候需要+1
			   var month=new Date(timdedetail).getMonth()+1;
			   if (month < 9) {
					month = '0' + month
				}
			   //获取日
			   var date=new Date(timdedetail).getDate();
			   if (date < 10) {
					date = '0' + date
				}
			   //获取时
			   var hours=new Date(timdedetail).getHours();
			   if (hours < 10) {
						hours = '0' + hours
					}
			   //获取分
			   var minutes=new Date(timdedetail).getMinutes();
			   if (minutes < 10) {
					minutes = '0' + minutes
				}

			   //获取秒
			   var seconds=new Date(timdedetail).getSeconds();
			   if (seconds < 10) {
					seconds = '0' + seconds
				}
			   //组合格式为年-月-日 时：分：秒（2021-7-5 21:21:21）
			   var time=year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;
			   return time;
			   //输出样式：2020-10-25 14:25:36
			},
			goOn(row){   //  续租
				this.dialogFormVisible=true;
				this.orderId=row.orderId;
			},
			qr_goOn(){
				if(this.value.length==0){
					this.$message.error("请选择续租时间");
				}else{
					let end_time=new Date(this.value).getTime();
					let orderEnd=this.auto_time(end_time);
					console.log(orderEnd);
					this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/reletOrder',{
						"orderId":this.orderId,
						"orderEnd":orderEnd,
						"content":this.content
					}).then((res)=>{
						console.log(res);
						if(res.resultCode==0){
							this.$message({
								message: '续租成功',
								type: 'success',
								duration:3000,
								offset:400,
								onClose:res=>{
									this.dialogFormVisible=false;
									this.init();
								}
							});
						}else{
							this.$message.error(res.message);
						}
					 })
				}
			},
			exit(row){  // 退租
				this.$confirm("确定要退租？", '提示', {
					 confirmButtonText: '确定',
					 cancelButtonText: '取消',
					 type: 'warning'
				}).then(() => {
					this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/exitOrder',{"orderId":row.orderId}).then((res)=>{
						console.log(res);
						if(res.resultCode==0){
							this.$message({
								message: '退租成功',
								type: 'success',
								duration:3000,
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
			},
			addFee(e){   // 添加缴费
				Object.keys(this.formData).forEach(key=>{
					this.formData[key] = e[key]
				})
				this.formData.id = e.orderId;
				
				this.elFormVisible("添加缴费");
			},
			elFormSubmit(){
				this.$refs.elForm.$refs.ruleForm.validate((valid) => {
					if (valid) {
						this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/addFee',this.formData).then((res)=>{
							console.log(res);
							if(res.resultCode==0){
								this.$message({
									message: '添加缴费成功',
									type: 'success',
									offset:400,
									duration:3000,
									onClose:res=>{
										this.init();
										this.elFormVisible();
									}
								});
							}else{
								this.$message.error(res.message);
							}
						 })
				    }
				})
			},
			addCustomer(row){   // 添加租客
			    // let roomInfo=JSON.parse(row.roomInfo);
				this.$router.push({
					path:'/rent-rent_in',
					query:{
						roomId:row.roomId,
						rent:row.rent,
						deposit:row.deposit,
						areaName:row.areaName,
						building:row.building,
						unit:row.unit,
						roomNo:row.roomNo,
						orderId:row.orderId,
						orderStart:row.orderStart,
						orderEnd:row.orderEnd,
						mobile1:row.customers[0].mobile1
					}
				})
			},
			init(){
				this.load=true;
				if(this.searchData.roomId){
					this.searchData.roomId=parseInt(this.searchData.roomId);
				}else{
					this.searchData.roomId=0;
				}
				
				let params = {...this.pagination,...this.searchData};
				this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/listOrder',params).then((res)=>{
					console.log(res);
					this.load=false;
					if(res.resultCode==0){
						this.pagination.total=res.data.dataCount;
						if(res.data.datas.length>0){
							for(let i in res.data.datas){
								for(let j in res.data.datas[i].customers){
									if(res.data.datas[i].customers[j].customerType=="承租人"){
										res.data.datas[i].customerName=res.data.datas[i].customers[j].customerName;
										res.data.datas[i].sex=res.data.datas[i].customers[j].sex;
										res.data.datas[i].mobile1=res.data.datas[i].customers[j].mobile1;
									}
								}
								// res.data.datas[i].roomInfo=JSON.parse(res.data.datas[i].roomInfo);
								// if(res.data.datas[i].roomInfo){
								// 	console.log("roomInfo",res.data.datas[i].roomInfo);
								// 	res.data.datas[i].areaName=JSON.parse(res.data.datas[i].roomInfo).areaName;
								// 	res.data.datas[i].building=JSON.parse(res.data.datas[i].roomInfo).building;
								// 	res.data.datas[i].unit=JSON.parse(res.data.datas[i].roomInfo).unit;
								// 	res.data.datas[i].roomNo=JSON.parse(res.data.datas[i].roomInfo).roomNo;
								// }
								this.value=res.data.datas[i].orderEnd;
							}
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