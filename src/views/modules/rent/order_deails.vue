<template>
	<div>
	   <div class="main">
			<div class="bttn">
				<el-button type="primary" @click="orderRound">订单缴费记录</el-button>
				
				<el-button type="primary" @click="ordergoon">订单续租记录</el-button>
			</div>
			
			<r-list title="承租人信息" :ListCols="authenticationCols" :ListData="driverInfo" />
			<div class="title">家属信息</div>	
		</div>
		
			<r-table
			  :isIndex="true"
			  :tableData="tableData"
			  :tableCols="tableCols"
			/>
		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				url:process.env.VUE_APP_URL,
				load:false,
				driverInfo: {
					
				},
				authenticationCols: [
					[
						{ label: '订单编号', prop: 'orderId' },
				        { label: '姓名', prop: 'customerName' },
						{ label: '民族', prop: 'nation' },
						{ label: '身份证号码', prop: 'idcard' },
						{ label: '合同照片', prop: 'contractImage', type: 'image' },
						// { label: '身份证图片', prop: 'idcardPhoto', type: 'image' },
						{ label: '人脸图片', prop: 'customerPhoto', type: 'image' },
						{ label: '手机号', prop: 'mobile1' },
						{ label: '性别', prop: 'sex' },
						{ label: '地址', prop: 'address' },
						{ label: '备用电话', prop: 'mobile2' },
					],
					[
						{ label: '小区名称', prop: 'areaName' },
					    { label: '楼栋', prop: 'building' },
						{ label: '单元', prop: 'unit' },
						{ label: '房间号', prop: 'roomNo' },
						{ label: '押金', prop: 'deposit' },
						{ label: '租金', prop: 'rent' },
						{ label: '电费单价', prop: 'powerPrice' },
						{ label: '电表读数', prop: 'powerValue' },
						{ label: '水费单价', prop: 'waterPrice' },
						{ label: '水表读数', prop: 'waterValue' }
					],
					[
						{ label: '省', prop: 'provinceName' },
						{ label: '市', prop: 'cityName' },
						{ label: '区/县', prop: 'countyName' },
						{ label: '街道', prop: 'streetName' },
						{ label: '房租计费日期', prop: 'orderStart' },
					    { label: '订单开始时间', prop: 'orderStart' },
						{ label: '订单到期时间', prop: 'orderEnd' },
						{ label: '办理人员', prop: 'inputUser' },
						{ label: '办理时间', prop: 'orderTime' }
					]
				],
				tableData: [],
				tableCols: [
				  { label: "姓名", prop: "customerName", width:"140px"},
				  { label: "身份证号码", prop: "idcard", width:"200px"},
				  { label: "性别", prop: "sex", width:"80px"},  
				  { label: "手机号", prop: "mobile1", width:"120px"},
				  { label: '地址', prop: 'address' },
				  { label: "办理人员", prop: "inputUser"},
				  {
				    label: "操作",
				    type: "button",
					fixed:"right",
				    width: 160,
				    btnList: [
					  {
						label: "删除",
						type: "danger",
						size: "mini",
						handle: (row) => this.del(row) ,
					  }
				    ]
				  }
				],
			}
		},
		created() {
			this.init();
			
		},
		methods:{
			orderRound(){
				this.$router.push({
					path:'/rent-all_manage',
					query:{
						orderId:this.$route.query.orderId
					}
				})
			},
			ordergoon(){
				this.$router.push({
					path:'/rent-change',
					query:{
						orderId:this.$route.query.orderId
					}
				})
			},
			init(){
				let _self=this;
				this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/listOrder',{"orderId":this.$route.query.orderId}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						let odata=res.data.datas[0];
						
						// this.driverInfo.orderId=odata.orderId;
						// this.driverInfo.realName=odata.customerName;
						
						let customerdata={};
						this.tableData=[];
						for(let i in odata.customers){
							if(odata.customers[i].customerType=="承租人"){
								customerdata=odata.customers[i];
							}
							if(odata.customers[i].customerType=="家属"){
								this.tableData.push(odata.customers[i]);
							}
						}
						this.driverInfo=odata; 
						// let roomInfo=JSON.parse(odata.roomInfo);
						this.driverInfo.customerName=customerdata.customerName;
						this.driverInfo.idcard=customerdata.idcard;
						this.driverInfo.nation=customerdata.nation;
						this.driverInfo.address=customerdata.address;
						this.driverInfo.mobile1=customerdata.mobile1;
						this.driverInfo.sex=customerdata.sex;
						this.driverInfo.mobile2=customerdata.mobile2;
						this.driverInfo.pwd=customerdata.pwd;
						// this.driverInfo.areaName=roomInfo.areaName;
						// this.driverInfo.building=roomInfo.building;
						// this.driverInfo.unit=roomInfo.unit;
						// this.driverInfo.roomNo=roomInfo.roomNo;
					
						setTimeout(function(){
							odata.contractImage=_self.url+'/iotwebapi'+odata.contractImage
							_self.driverInfo.idcardPhoto=_self.url+'/iotwebapi'+customerdata.idcardPhoto;
							_self.driverInfo.customerPhoto=_self.url+'/iotwebapi'+customerdata.customerPhoto;
						},500);
					}else{
						this.$message.error(res.message);
					}
				 })
			},
			del(e){
				this.$confirm("是否要删除？", '提示', {
					 confirmButtonText: '确定',
					 cancelButtonText: '取消',
					 type: 'warning'
				}).then(() => {
					this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/delCustomer',{"customerId":e.customerId}).then((res)=>{
						console.log(res);
						if(res.resultCode==0){
							this.$message({
								message: '删除成功',
								type: 'success',
								duration:1300,
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
		}
	}
</script>

<style scoped lang="scss">
	.main{
		position: relative;
	}
	.bttn{
		position: absolute;
		top:8px;
		left:110px;
	}
	
</style>