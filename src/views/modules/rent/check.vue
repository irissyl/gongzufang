<template>
	<div>
		<r-search
		labelWidth="90px"
		:searchData="searchData" 
		:searchForm="searchForm" 
		:searchHandle="searchHandle"
		/>
		
		<div class="list" v-for="item in tableData"  v-if="load==true">
			<div class="left">
				<img v-if="item.pic[0]" :src="item.pic[0]"/>
				<img v-else src="../../../assets/img/info.jpg"/>
				<!-- <span>实名认证</span> -->
			</div>
			<div class="name">
				<h2>
					<span>{{item.areaName}}</span>
					<span class="center">{{item.building}}</span>
					<span class="center">{{item.roomNo}}</span>
				</h2>
				<h4>
					<span>{{item.rentType}}</span>
					<span class="center">{{item.roomType}}</span>
					<span class="center">{{item.size}}m²</span>
					
					<span class="center">月租金:{{item.m1}}</span>
					<span class="center">季租金:{{item.m3}}</span>
					<span class="center">半年租金:{{item.m6}}</span>
					<span class="center">年租金:{{item.m12}}</span>
					<!-- <span class="center">朝南</span> -->
				</h4>
				<p>{{item.address}}</p>
				<h4>
					<i class="el-icon-s-custom"></i>
					<span>{{item.roomAttrib}}</span>
					<span>房东: {{item.landlord}}</span>
					<span>{{item.landlordPhone}}</span>
					<span style="padding-left:20px;">[床: {{item.bed}}</span>
					<span>燃气灶: {{item.gasStove}}</span>
					<span>电视: {{item.tv}}</span>
					<span>冰箱: {{item.icebox}}</span>
					<span>热水器: {{item.waterHeater}}]</span>
				</h4>
				<p class="bottom" v-if="item.roomState=='待入住'">{{item.roomState}}</p>
				<p class="bottom" v-if="item.roomState!='待入住' && item.roomState!='入住'" style="color:red;border-color: red;">{{item.roomState}}</p>
				<p class="bottom" v-if="item.roomState=='入住'" style="color:red;border-color: red;">已入住</p>
			</div>
			<div class="right">
				<span>{{item.m1}}</span>元/月
				<p>
					<el-button type="primary"  v-if="item.roomState=='待入住'" style="font-size:12px;" @click="next(item)">办理入住</el-button>
					<el-button type="success"  v-if="item.roomState=='入住'" style="font-size:12px;" @click="add(item)">添加同住人</el-button>
					<el-button type="primary" style="font-size:12px;" @click="deails(item)">详情</el-button>
				</p>
			</div>
		</div>
		
		
		<el-empty :image-size="200" v-if="load==false"></el-empty>
		
	
		<el-pagination
		  @size-change="handleSizeChange"
		  @current-change="handleCurrentChange"
		  :current-page="pagination.pageNumber"
		  :page-sizes="[10, 20, 50, 100,]"
		  :page-size="pagination.pageSize"
		  layout="total, sizes, prev, pager, next, jumper"
		  :total="pagination.total">
		</el-pagination>
		
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
					province:"",
					city:'',
					county:"",
					street:"",
					areaName:"",
					areaId:0,  //  默认是零
					building:"",
					roomType:"",
					roomState:"",
					rentType:"",
					roomNo:""
				},
				tableData:[],
				searchForm: [
				  // { type: "select",label: "省份",  prop: "province", width: 160,options:[],change: e => this.city(e)},
				  // { type: "select",label: "城市",  prop: "city", width: 160,options:[],change: e => this.county(e)},
				  // { type: "select",label: "县市",  prop: "county", width: 160,options:[],change: e => this.street(e)},
				  // { type: "select",label: "街道",  prop: "street", width: 160,options:[],change: e => this.areaName(e)},
				  { type: "select",label: "小区",  prop: "areaName", width: 160,options:[],change: e => this.building(e)},
				  { type: "select",label: "楼栋",  prop: "building", width: 160,options:[]},
				  { type: "select",label: "户型",  prop: "roomType", width: 160,options:[
					  {label:"一房一厅",value:"一房一厅"},
					  {label:"两房一厅",value:"两房一厅"},
					  {label:"三房一厅",value:"三房一厅"},
					  {label:"三房两厅",value:"三房两厅"},
					  {label:"四房一厅",value:"四房一厅"},
					  {label:"四房两厅",value:"四房两厅"}
				  ]},
				  { type: "select",label: "状态",  prop: "roomState", width: 160,options:[{label:'待入住',value:"待入住"},{label:'已入住',value:"入住"}]},
				  // { type: "select",label: "租赁方式",  prop: "rentType", width: 160,options:[{label:'整租',value:"整租"},{label:'分租',value:"分租"}]},
				  {label: "房间号", type: "input",  prop: "roomNo", width: 160 },
				],
				searchHandle:[
				  {type: "info",icon: "el-icon-refresh", handle: e => this.searchFromReset()},
				  {label: "随机分配",type: "primary",handle: e => this.elFormVisible()},
				  {label: "查询",type: "primary",icon: "el-icon-search",handle: e =>this.seach()},
				  
				],
			}
		},
		mounted() {
			
		},
		created() {
			// this.province();
			
			this.areaName();
		},
		methods:{
			add(item){   //  添加同住人
				this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/listOrder',{roomId:item.roomId}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						let row=res.data.datas[0];
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
				this.searchData.areaName="";
				this.searchData.building="";
				this.searchForm[1].options=[];
				this.searchForm[2].options=[];
				this.searchForm[3].options=[];
				this.searchForm[4].options=[];
				this.searchForm[5].options=[];
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
				this.searchData.areaName="";
				this.searchData.building="";
				this.searchForm[2].options=[];
				this.searchForm[3].options=[];
				this.searchForm[4].options=[];
				this.searchForm[5].options=[];
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
				this.searchData.areaName="";
				this.searchData.building="";
				this.searchForm[3].options=[];
				this.searchForm[4].options=[];
				this.searchForm[5].options=[];
				this.$http.post(this.url+'/iotwebapi/api/dic/listStreet',{code:e,pageSize: 1000, pageNumber: 1}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.searchForm[3].options.push({label:res.data.datas[i].name,value:res.data.datas[i].code});
						}
					}
				})
			},
			areaName(){   //  小区	
				this.searchData.areaName="";
				this.searchData.building="";
				this.searchForm[0].options=[];
				this.searchForm[1].options=[];
				this.$http.post(this.url+'/iotwebapi/api/publicrental/area/listArea',{pageSize:999}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.searchForm[0].options.push({label:res.data.datas[i].name,value:res.data.datas[i].areaId});
						}
						console.log("options",this.searchForm[0].options);
						if(this.searchForm[0].options.length==1){
							this.building(res.data.datas[0].areaId);
							this.searchData.areaName=this.searchForm[0].options[0].label;
							this.searchData.areaId=this.searchForm[0].options[0].value;
						}
						this.init();
						
					}
				})
			},
			building(e){  //  楼栋
				console.log(e);	
				console.log("searchData",this.searchData);
				
				// this.searchData.areaId=e;
				for(let i in this.searchForm[0].options){
					if(e==this.searchForm[0].options[i].value){
						this.searchData.areaName=this.searchForm[0].options[i].label;
					}
				}
				
				this.searchData.building="";
				this.searchForm[1].options=[];
				this.$http.post(this.url+'/iotwebapi/api/publicrental/room/listBuilding',{areaId:e,pageSize: 1000, pageNumber: 1}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						for(let i in res.data.datas){
							this.searchForm[1].options.push({label:res.data.datas[i],value:res.data.datas[i]});
						}
						if(this.searchForm[1].options.length==1){
							this.searchData.building=this.searchForm[1].options[0].label;
						}
					}
				})
			},
			next(item){   //  入住
				this.$router.push({
					path:'/rent-rent_in',
					query:{
						roomId:item.roomId,
						rent:item.m1,
						deposit:item.d1,
						areaName:item.areaName,  //  小区名称
						building:item.building,   // 楼栋
						unit:item.unit,   //  单元
						roomNo:item.roomNo,   //  房间号
					}
				})
			},
			deails(item){    //  跳详情
				this.$router.push({
					path:'/rent-rent_deails',
					query:{
						roomId:item.roomId
					}
				})
			},
			handleSizeChange(e){
				
				this.pagination.pageSize=e;
				this.init();
			},
			handleCurrentChange(e){
				
				this.pagination.pageNumber=e;
				this.init();
			},
			seach(){
				this.pagination.pageNumber=1;
				this.tableData=[];
				this.init();
			},
			elFormVisible(){  //  
			    // if(this.searchData.street==""){
			    // 	this.$message.error("请选择省、市、区、街道");
			    // 	return false;
			    // }
				if(this.searchData.areaName==""){
					this.$message.error("请选择小区");
					return false;
				}
				if(this.searchData.roomType==""){
					this.$message.error("请选择房型");
					return false;
				}
			
				
				let params = {
					province:this.searchData.province,
					city:this.searchData.city,
					county:this.searchData.county,
					street:this.searchData.street,
					building:this.searchData.building,
					pageNumber:1,
					pageSize:999,
					areaId:this.searchData.areaId,
					roomType:this.searchData.roomType,
					roomState:this.searchData.roomState,
					rentType:this.searchData.rentType
				}
				
				this.$http.post(this.url+'/iotwebapi/api/publicrental/area/listRoom',params).then((res)=>{
					if(res.resultCode==0){
						if(res.data.datas.length>0){
							for(let i in res.data.datas){
								if(res.data.datas[i].roomState=="待入住"){
									this.$router.push({
										path:'/rent-rent_deails',
										query:{
											item:JSON.stringify(res.data.datas[i])
										}
									})
									return false;
								}
							}
						}else{
							this.$message.error("暂无想要的房源");
						}
					}
				})
			},
			init(){   //  列表
				let params = {...this.pagination,...this.searchData}
				this.$http.post(this.url+'/iotwebapi/api/publicrental/area/listRoom',params).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						this.pagination.total=res.data.dataCount;
						this.load=true;
						
						for(let i=0;i<res.data.datas.length;i++){
							res.data.datas[i].pic=[];
							if(res.data.datas[i].img1){
								res.data.datas[i].img1=process.env.VUE_APP_URL+"/iotwebapi"+res.data.datas[i].img1;
								res.data.datas[i].pic.push(res.data.datas[i].img1);
							}
							if(res.data.datas[i].img2){
								res.data.datas[i].img2=process.env.VUE_APP_URL+"/iotwebapi"+res.data.datas[i].img2;
								res.data.datas[i].pic.push(res.data.datas[i].img2);
							}
							if(res.data.datas[i].img3){
								res.data.datas[i].img3=process.env.VUE_APP_URL+"/iotwebapi"+res.data.datas[i].img3;
								res.data.datas[i].pic.push(res.data.datas[i].img3);
							}
							if(res.data.datas[i].img4){
								res.data.datas[i].img4=process.env.VUE_APP_URL+"/iotwebapi"+res.data.datas[i].img4;
								res.data.datas[i].pic.push(res.data.datas[i].img4);
							}
							if(res.data.datas[i].img5){
								res.data.datas[i].img5=process.env.VUE_APP_URL+"/iotwebapi"+res.data.datas[i].img5;
								res.data.datas[i].pic.push(res.data.datas[i].img5);
							}
						
						}
						this.tableData = res.data.datas;
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.list{
		padding:10px;
		border-bottom:1px solid #eee;
		position:relative;
		div{
			display: inline-block;
			vertical-align:top;
		}
		.left{
			width:160px;
			height:120px;
			position:relative;
			text-align:center;
			img{
				width:auto;
				height:120px;
			}
			span{
				position: absolute;
				display:inline-block;
				background:#ff5e00;
				color:#fff;
				top:5px;
				left:5px;
				font-size:12px;
				width:70px;
				height:20px;
				line-height:20px;
				text-align:center;
				border-radius:3px;
			}
		}
		.name{
			padding-left:10px;
			h2{
				font-size:18px;
				.center{
					padding-left:10px;
				}
			}
			h4{
				.center{
					padding-left:10px;
				}
			}
			p{
				font-size:14px;
				color:#666;
			}
			.bottom{
				border:1px solid #67c23a;
				color:#67c23a;
				display:inline-block;
				width:70px;
				height:22px;
				line-height:22px;
				border-radius:5px;
				text-align:center;
			}
			h4{
				height:30px;
				line-height:30px;
				font-size:14px;
				
			}
		}
		.right{
			position: absolute;
			right:20px;
			top:50px;
			color:#aaa;
			width:185px;
			span{
				font-size:20px;
				color:#f00;
				font-weight:bold;
				padding-right:5px;
			}
		}
	}
	.site-wrapper .el-pagination {
	    margin-top: 15px;
	    text-align: left;
	    // bottom: 30px;
	    // position: absolute;
	}
</style>