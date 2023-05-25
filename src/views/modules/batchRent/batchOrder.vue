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
		
		
		<el-dialog title="添加批量订单" width="1000px" :visible.sync="RoomIn">
			<div class="lines">
				<span style="display:inline-block;width:90px;text-align:right;">单位名称</span>
				<el-input v-model="name" placeholder="请输入" style="width:200px;"></el-input>
				
				<span style="display:inline-block;width:90px;text-align:right;">单位联系人</span>
				<el-input v-model="name" placeholder="请输入" style="width:200px;"></el-input>
				
				<span style="display:inline-block;width:90px;text-align:right;">单位联系方式</span>
				<el-input v-model="phone" placeholder="请输入" style="width:200px;"></el-input>
				
			</div>	
			
			<div class="lines">
				<span style="display:inline-block;width:90px;text-align:right;">押金</span>
				<el-input v-model="deposit" placeholder="请输入" style="width:200px;"></el-input>
				
				<span style="display:inline-block;width:90px;text-align:right;">租金</span>
				<el-input v-model="rent" placeholder="请输入" style="width:200px;"></el-input>
				
				<span style="display:inline-block;width:90px;text-align:right;">小区</span>
				<el-select v-model="areaId" placeholder="请选择" @change="changeArea" style="width:200px;">
				  <el-option
					v-for="item in areaOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				  </el-option>
				</el-select>	
			</div>	
			
			<div class="lines">
				<span style="display:inline-block;width:90px;text-align:right;">楼栋</span>
				<el-select v-model="building" placeholder="请选择" @change="changebuilding" style="width:200px;">
				  <el-option
					v-for="item in buildingOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				  </el-option>
				</el-select>
				
				<span style="display:inline-block;width:90px;text-align:right;">单元</span>
				<el-select v-model="building" placeholder="请选择" @change="changebuilding" style="width:200px;">
				  <el-option
					v-for="item in buildingOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				  </el-option>
				</el-select>
				
				<span style="display:inline-block;width:90px;text-align:right;">户型</span>
				<el-select v-model="roomType" placeholder="请选择" @change="roomseach" style="width:200px;">
				  <el-option
					v-for="item in roomTypeOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				  </el-option>
				</el-select>
				
				
			</div>	
			
			<div class="lines">
				<span style="display:inline-block;width:90px;text-align:right;">房间数量</span>
				<el-input type="number" @input="getroomNum" v-model="roomNum" placeholder="请输入" style="width:200px;"></el-input>
				
				<span style="display:inline-block;width:90px;text-align:right;">时间</span>
				<el-date-picker
				  v-model="value2"
				  type="datetimerange"
				  align="right"
				  :picker-options="pickerOptions"
				  start-placeholder="开始日期"
				  end-placeholder="结束日期"
				  :default-time="['08:00:00', '23:59:59']">
				</el-date-picker>
				<span style="display:inline-block;width:20px;text-align:right;"></span>
				<!-- <el-button type="primary" icon="el-icon-search" @click="roomseach">搜索</el-button> -->
				<el-button type="primary" :disabled="isDisabled==false" icon="el-icon-suitcase" @click="save">导入数据</el-button>
			</div>	
			
			<div class="transferc">
				 <p class="col">注意：选好房间后请点击 “导入数据” 按钮，可继续再选其他楼栋户型房间</p>
				 <el-transfer
					filterable
					:titles="['房间号', '选中后房间号']"
					:button-texts="['删除', '添加房间']"
					filter-placeholder="请输入搜索内容"
					@change="handleChange"
					:left-default-checked="defaultroomdata"  
					:format="{
						noChecked: '${total}',
						hasChecked: '${checked}/${total}'
					  }"
					v-model="roomvalue"
					:data="roomdata">
				  </el-transfer>
			</div>
			<div style="padding-top:20px;">
				<el-table :data="roomtableData" border style="width: 100%">
				    <el-table-column fixed prop="areaName" label="小区名称" width="120"></el-table-column>
				    <el-table-column prop="building" label="楼栋" width="120"></el-table-column>
					<el-table-column prop="unit" label="单元" width="120"></el-table-column>
				    <el-table-column prop="roomType" label="房屋类型"width="120"></el-table-column>
				    <el-table-column prop="roomNo" label="房间号"></el-table-column>
				    <el-table-column fixed="right" label="操作" width="100">
				      <template slot-scope="scope">
				        <el-button  @click="roomdel(scope.$index, scope.row)" type="danger" size="small">删除</el-button>
				      </template>
				    </el-table-column>
				</el-table>
			</div>
		    <div slot="footer" class="dialog-footer">
			<el-button @click="RoomIn = false">取 消</el-button>
			<el-button type="primary" @click="qr_RoomIn">保 存</el-button>
		   </div>
		</el-dialog>
		
		
		<!-- <el-dialog title="办理入住" width="440px" :visible.sync="transactRoom">
		  <p style="height:40px;line-height:40px;">小区名称</p>
		  <el-input placeholder="请输入内容" v-model="transactareaName"
		    :disabled="true">
		  </el-input>
		  
			<p style="height:40px;line-height:40px;">选择楼栋</p>
			<el-select v-model="Buildingid" placeholder="请选择" @change="changeBuilding" style="width:100%;">
			  <el-option
				v-for="item in Buildingoptions"
				:key="item.value"
				:label="item.label"
				:value="item.value">
			  </el-option>
			</el-select>
			
			<p style="height:40px;line-height:40px;">选择房屋类别</p>
			<el-select v-model="Buildingid" placeholder="请选择" @change="changeBuilding" style="width:100%;">
			  <el-option
				v-for="item in Buildingoptions"
				:key="item.value"
				:label="item.label"
				:value="item.value">
			  </el-option>
			</el-select>
				
			<p style="height:40px;line-height:40px;">选择房间</p>
			<el-select v-model="roomid" placeholder="请选择" style="width:100%;">
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
		</el-dialog> -->
		
		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() < (Date.now()-86400000);
					}
				},
				isDisabled:true,
				dialogFormVisible:false,
				value:"",
				value2:"",
				content:"",
				url:process.env.VUE_APP_URL,
				load:false,
				RoomIn:false,
				name:"",
				phone:"",
				rent:"",  //   租金
				deposit:"",  // 押金
				areaId:"", // 小区id
				areaOptions:[],  // 小区列表
				building:"", //  楼栋
				buildingOptions:[],  // 楼栋列表
				roomType:"",  // 户型
				roomTypeOptions:[
					// {label:"一房一厅",value:"一房一厅"},
					// {label:"两房一厅",value:"两房一厅"},
					// {label:"三房一厅",value:"三房一厅"},
					// {label:"四房一厅",value:"四房一厅"},
					// {label:"四房两厅",value:"四房两厅"},
				],   // 户型列表
				roomNum:"",  //  房间数量
				roomvalue:[], //   右边
				roomdata:[],  //   左边
				defaultroomdata:[],  //  默认选中
				roomId:[],  //  房间id集合
				roomtableData:[],  //  保存后数据
				roomseachData:[], // 搜索后房间数据
				pagination: { pageSize: 10, pageNumber: 1, total: 0 },
				searchData: {
					areaName:"",
					customerName:"",
					comnay:"",
					mobile:"",
				},
				searchForm: [
				  { type: "input",label: "小区名称",  prop: "areaName", width: 160},
				  { type: "input",label: "单位名称",  prop: "comnay", width: 160},
				  { type: "input",label: "单位联系人",  prop: "customerName", width: 160},
				  { type: "input",label: "单位联系方式",  prop: "mobile", width: 160},
				],
				searchHandle:[
				  {type: "info",icon: "el-icon-refresh", handle: e => this.searchFromReset()},
				  {label: "查询",type: "primary",icon: "el-icon-search",handle: e =>this.seach()}, 
				  {label: "添加批量订单", icon: 'el-icon-plus', type: "primary", handle: e => this.addorder()},
				],
				tableData: [
					{
					  comnay:"安诺克",
					  customerName:"张三",
					  mobile:"15885623562",  
					  areaName:"小区三",
					  address:"广东省东莞市东城区",
					  keyCount:"132",
					  deposit:"100000",
					  rent:"200000",
					  orderStart:"2022-08-10 08:00:00",
					  orderEnd:"2023-02-25 23:00:00",
					  inputUser:"李工",
					  orderTime:"2022-08-09 08:20:00"
					}
				],
				tableCols: [
				  { label: "单位名称", prop: "comnay"},
				  { label: "单位联系人", prop: "customerName"},
				  { label: "单位联系方式", prop: "mobile"},
				  { label: "地址", prop: "address"},
				  { label: "小区名称", prop: "areaName"},
				  { label: "房间数量(套)", prop: "keyCount"},
				  { label: "押金", prop: "deposit"},
				  { label: "租金", prop: "rent"},
				  { label: "入住起始", prop: "orderStart", width:"160px"},
				  { label: "入住到期", prop: "orderEnd", width:"160px"},
				  { label: "办理人员", prop: "inputUser"},
				  { label: "办理时间", prop: "orderTime", width:"160px"},
				  {
				    label: "操作",
				    type: "button",
				    width: 200,
				    btnList: [
					  {
					  	label: "批量办理入住",
					    type: "primary",
					    size: "mini",
					    handle: (row) => this.roomin(row) ,
					  },
					  {
					  	label: "批量续租",
					    type: "primary",
					    size: "mini",
					    handle: (row) => this.goOn(row) ,
					  },
					  {
					  	label: "批量退租",
					    type: "danger",
					    size: "mini",
					    handle: (row) => this.exit(row) ,
					  },
				    ]
				  }
				],
			}
		},
		created() {
			this.arealist();
		},
		methods:{
			unique(arr) {  //  去重
			    return arr.filter( (item, index, arr) => {
			        //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
			        return arr.indexOf(item) === index;
			    });
			},
			seach(){   //  搜索
				
			},
			addorder(){  // 添加订单
				this.RoomIn=true;
				// this.areaId="";
				// this.buildingOptions=[];
				// this.building="";
				// this.roomType="";
				// this.roomTypeOptions=[];
				// this.roomdata=[];
				// this.roomvalue=[];
			},
			changeArea(){  //选择小区
				console.log("areaId",this.areaId);
				this.buildingOptions=[];
				this.building="";
				this.roomType="";
				this.roomTypeOptions=[];
				this.$http.post(this.url+'/iotwebapi/api/publicrental/room/listBuilding',{
					pageNumber: 1,
					pageSize: 1000,
					areaId:this.areaId
				}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						if(res.data.datas.length>0){
							for(let i in res.data.datas){
								this.buildingOptions.push({
									label:res.data.datas[i],
									value:res.data.datas[i]
								})    
							}
							
						}
					}
				})
			},
			changebuilding(){   //  选择楼栋
				this.roomType="";
				this.roomTypeOptions=[];
				this.$http.post(this.url+'/iotwebapi/api/publicrental/area/listRoom',{
					pageNumber: 1,
					pageSize: 1000,
					areaId:this.areaId,
					building:this.building,
					roomState:"待入住"
				}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						if(res.data.datas.length>0){
							let arr=[];
							for(let i in res.data.datas){
								arr.push(res.data.datas[i].roomType);	
							}
							
							let newArr=this.unique(arr);
							console.log("myset",newArr);
							for(let i in newArr){
								this.roomTypeOptions.push({
									label:newArr[i],
									value:newArr[i]
								}) 
							}
						    
							
						}
					}
				})
			},
			roomseach(){  //  房间搜索 
				console.log("building",this.building);
				console.log("roomType",this.roomType);
				this.roomdata=[];
				this.$http.post(this.url+'/iotwebapi/api/publicrental/area/listRoom',{
					pageNumber: 1,
					pageSize: 1000,
					areaId:this.areaId,
					building:this.building,
					roomType:this.roomType,
					roomState:"待入住"
				}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						if(res.data.datas.length>0){
							for(let i in res.data.datas){
								this.roomdata.push({
									label:res.data.datas[i].roomNo,
									key:res.data.datas[i].roomId
								}) 
								this.roomseachData=this.roomdata;
							}
						}else{
							this.$message.error("暂无想要的房间");
						}
					}
				})	
			},
			save(){  // 保存
				if(this.roomvalue.length>0){
					// 判断是否有相同的房间
					if(this.roomtableData.length>0){
						for(let i in this.roomtableData){
							for(let j in this.roomtableData[i].roomId){
								for(let p in this.roomvalue){
									if(this.roomtableData[i].roomId[j]==this.roomvalue[p]){
										this.$message.error("不能选相同的房间");
										return false;
									}
								}
							}
						}
						
					}
					
					this.isDisabled=false;
					let arr=[];
					for(let i in this.roomvalue){   //  房间号
						for(let j in this.roomseachData){
							if(this.roomvalue[i]==this.roomseachData[j].key){
								arr.push(this.roomseachData[j].label);
								this.roomId.push(this.roomvalue[i]);  //  选中的房间id
							}
						}
					}
					
					let areaName=""
					for(let i in this.areaOptions){
						if(this.areaId==this.areaOptions[i].value){
							areaName=this.areaOptions[i].label;
						}
					}
					
					let building=""
					for(let i in this.buildingOptions){
						if(this.building==this.buildingOptions[i].value){
							building=this.buildingOptions[i].label;
						}
					}
					
					let roomType=""
					for(let i in this.roomTypeOptions){
						if(this.roomType==this.roomTypeOptions[i].value){
							roomType=this.roomTypeOptions[i].label;
						}
					}
					
					this.roomtableData.push({
						areaName:areaName,
						building:building,
						roomType:roomType,
						roomNo:arr.toString(),
						roomId:this.roomvalue
					})
					console.log("房间id集合",this.roomId);
					this.roomvalue=[];
				}else{
					this.$message.error("请选房间号!");
				}
			},
			roomdel(index, row){  //  删除保存后的数据
				console.log("index",index);
				console.log("row",row);
				this.roomtableData.splice(index,1); 
				for(let i in row.roomId){
					for(let j in this.roomId){
						if(row.roomId[i]==this.roomId[j]){
							this.roomId.splice(j,1); 
						}
					}
				}
				console.log("roomtableData",this.roomtableData);
				console.log("roomId",this.roomId);
			},
			getroomNum(e){   //  输入房间数量
				console.log("房间数量",e);
				console.log("数据",this.roomdata);
				this.defaultroomdata=[];
				if(e>this.roomdata.length){
					this.$message.error("当前输入房间数量最大值为"+this.roomdata.length);
					this.roomNum=this.roomdata.length;
				}
				for(let i=0;i<e;i++){
					this.defaultroomdata.push(this.roomdata[i].key);
				}
				
				console.log("this.defaultroomdata",this.defaultroomdata);
			},
			handleChange(){  // 选中房间号
				console.log("roomvalue",this.roomvalue);
				this.isDisabled=true;
			},
			qr_RoomIn(){
				
			},
			roomin(row){  //批量办理入住
				
			},
			goOn(row){   //  批量续租
				this.dialogFormVisible=true;
			},
			exit(row){   //  批量退租
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
								duration:2000,
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
			qr_goOn(){
				this.dialogFormVisible=false;
			},
			init(){
				
			},
			arealist(){  // 小区列表
				this.$http.post(this.url+'/iotwebapi/api/publicrental/area/listArea',{
					pageNumber: 1,
					pageSize: 1000
				}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						if(res.data.datas.length>0){
							for(let i in res.data.datas){
								this.areaOptions.push({
									label:res.data.datas[i].name,
									value:res.data.datas[i].areaId
								})    
							}
							
						}
					}
				})
			},
		}
	}
</script>

<style scoped>
	.lines{
		padding-bottom:20px;
	}
	.col{
		height:30px;
		text-align:center;
		color:#df4f4f;
		padding-left:-120px;
	}
	.transferc{
		padding-left:120px;
		box-sizing: border-box;
	}
</style>