<template>
	<div class="main" v-loading="loading" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
		<!-- <div class="header">
			<h3>万科小区2</h3>
			<div>
				<span>130303</span>元/月
			</div>
		</div>
		<input placeholder=""/> -->
		<r-search
			:searchData="searchData" 
			:searchForm="searchForm" 	
		/>
		<!-- <el-date-picker
		  v-model="value1"
		  type="datetimerange"
		  start-placeholder="开始日期"
		  end-placeholder="结束日期"
		  :default-time="['12:00:00']">
		</el-date-picker> -->
		<!-- 获取身份证信息 -->
		<div class="card" v-if="tab==1">
			<div class="cd_card">
				<img v-if="cdcardImg" :src="cdcardImg"/>
				<span v-if="!cdcardImg">请将身份证放于读卡器上点击“证件读取”按键</span>
			</div>
			<div class="face">
				<span v-if="!imgSrc">请点击“人脸拍照”按键，待承租人人脸在此框内时再次按下“人脸拍照”按键，保存此照片
					完成上面两个方可按“人证核验”按键
					人证核验通过则可按“指纹采集”按键
					采集完成并且有设定租期则可“合同拍摄”
					以上步骤全部完成则可以“权限下发”
				</span>
				<div class="card_img">
					<!-- <video id="videoCamera" :width="videoWidth" :height="videoHeight" autoplay></video>
					<canvas style="display:none;" id="canvasCamera" :width="videoWidth" :height="videoHeight"></canvas> -->
					<img :src="imgSrc" alt="" v-if="imgSrc">
				</div>
			</div>
		</div>
		
		<!-- 人脸拍照 -->
		<div class="card" v-if="tab==2||(tab==4 && !orderId)">
			<div class="cd_card">
				<span v-if="tab==2 && off==0">请点击“人脸拍照”按键，打开摄像头</span>
				<video id="videoCamera" :width="videoWidth" :height="videoHeight" autoplay></video>
				<canvas style="display:none;" id="canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
				<el-button class="buttonone" type="primary" @click="setImage">点击拍照</el-button>
				<el-button v-if="videolength==2" class="buttontwo" type="primary" @click="changephon">切换摄像头</el-button>
			</div>
			
			<div class="face">
				<div class="card_img">	
					<img :src="img2" alt="" v-if="img2 && tab==2" style="position: inherit;width:320px;height:auto;top:0px;left:0px;">
					<img :src="imgContract" alt="" v-if="imgContract && tab==4" style="position: inherit;width:320px;height:auto;top:0px;left:0px;">
				</div>
			</div>
		</div>
		
		<!-- 指纹采集 -->
		<div class="card" v-if="tab==3">
			<div class="cd_card" style="overflow-y:scroll;">
				<span v-if="finger.length==0">请先开启“指纹设备接口”软件，再点击“指纹采集”按钮</span>
				<ul v-if="finger.length>0" style="text-align: left;padding-left:10px;box-sizing: border-box;">
					<li v-for="item in finger">{{item}}</li>
				</ul>
			</div>
			<div class="face">
				<div class="card_img">	
					<img src="../../../assets/img/fingerprint.svg">
					<p style="text-align:center;padding:40px 0px 0px 20px;">录入指纹中，请将手指放中间，共需要录3次</p>
				</div>
			</div>
		</div>
		
		<div class="bottom">
			<div class="box">
				<el-row>
				  <el-button :class="{'oneActive':one==true}" type="primary" plain @click="get_card(1)">证件读取</el-button>
				</el-row>
			</div>
			
			<div class="box">
				<el-row>
				  <el-button :class="{'twoActive':two==true}" type="primary" plain @click="getCompetence(2)">开摄像头</el-button>
				</el-row>
			</div>
			
			<!-- <div class="box">
				<el-row>
				  <el-button :class="{'threeActive':three==true}" type="primary" plain @click="stopNavigator">人证核验</el-button>
				</el-row>
			</div> -->
			
			<div class="box">
				<el-row>
				  <el-button :class="{'fourActive':four==true}" type="primary" plain @click="fingerprint(3)">指纹采集</el-button>
				</el-row>
			</div>
			
			<div class="box" v-if="!orderId">
				<el-row>
				  <el-button :class="{'fiveActive':five==true}" type="primary" plain @click="getCompetence(4)">合同拍摄</el-button>
				</el-row>
			</div>
			
			<div class="box">
				<el-row>
				  <el-button :class="{'sixActive':six==true}" type="primary" plain @click="save">确认入住</el-button>
				</el-row>
			</div>
			<div style="display: block;width:800px;">
				<el-progress :percentage="progress"></el-progress>
			</div>
			
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				videolength:1, // 摄像头数量
				type:false, //  摄像头切换默认值
				left:"",
				oindex:0,
				loading:false,
				one:false,
				two:false,
				three:false,
				four:false,
				five:false,
				six:false,
				orderId:"",
				ordercard:[],  //  订单里身份证数量
				off:0,  // 摄像头 0关闭   1 打开
				value1:"",
				tab:1,
				url:process.env.VUE_APP_URL,
				searchData: {
					roomId:this.$route.query.roomId,
					areaName:this.$route.query.areaName,
					building:this.$route.query.building,
					unit:this.$route.query.unit,
					roomNo:this.$route.query.roomNo,
					times:"",
					orderStart:"",
					orderEnd:"",
					chargeTime:"", //  当前添加时间
					mobile1:"",
					mobile2:"",
					rent:this.$route.query.rent,
					deposit:this.$route.query.deposit,
					waterPrice:"",
					waterValue:"",
					powerPrice:"",
					powerValue:"",
					pwd:"",
					company:"",
					Name:"",
					Address:"",
					Nation:"",
					Sex:"",
				},
				finger:[],// 指纹采集数据(前端显示)
				fingerData:[], //  共三次指纹采集数据（给后台）
				progress:0, //  进度条
				Certificate:{}, //  身份证信息
				cdcardImg:"",// 身份证图片
				imgSrc:"",// 身份证人脸照片
				idsnr:"",// 身份证卡号
				img2:"",// 拍照人脸照片
				isface:true,
				videoWidth:320,
				videoHeight:260,
				thisCancas: null,
				thisContext: null,
				thisVideo: null,
				imgIdcard:"",
				imgCompare:"",
				imgContract:"",  //  合同照片
				searchForm: [
				  {label: "姓名",class:"col", type: "input",  prop: "Name", width: 160,isDisabled: e =>false  },
				  {label: "性别",class:"col", type: "input",  prop: "Sex", width: 160,isDisabled: e => false  },
				  {label: "民族", class:"col",type: "input",  prop: "Nation", width: 160,isDisabled: e => true},
				  {label: "地址", class:"col",type: "input",  prop: "Address", width: 160,isDisabled: e => true},
				  {label: "联系电话 *", type: "input", prop: "mobile1", width: 160,blur: e => this.phone1(e)},
				  {label: "备用电话", type: "input",  prop: "mobile2", width: 160,blur: e => this.phone2(e) , isDisabled: e => this.$route.query.orderId?true:false},
				  {label: "公司", type: "input",  prop: "company", width: 160},
				  {label: "租金", type: "number",  prop: "rent", width: 160},
				  {label: "押金", type: "number",  prop: "deposit", width: 160},
				  {label: "水费单价", type: "number",  prop: "waterPrice", width: 160 },
				  {label: "水表读数", type: "number",  prop: "waterValue", width: 160 },
				  {label: "电费单价", type: "number",  prop: "powerPrice", width: 160 },
				  {label: "电表读数", type: "number",  prop: "powerValue", width: 160 },
				  // {label: "门锁密码", type: "input", prop: "pwd", width: 160},
				  {label: "开始时间 *", type: "dateTime",  prop: "orderStart", width: 220 ,isDisabled: e => this.$route.query.orderId?true:false },
				  {label: "结束时间 *", type: "dateTimeend",  prop: "orderEnd", width: 220 ,isDisabled: e => this.$route.query.orderId?true:false  },
				],
				// searchHandle:[
				//   // {label: "拍照",type: "primary",handle: e =>this.setImage()},
				//   {label: "保存",type: "primary",handle: e =>this.aaaa()}
				// ]
			}
		},
		created(){
			this.init();
		},
		mounted() {
			//  初始建立链接
			// let obj={"module":"common","msgid":"123456789","function":"info","parameter":""};
			// this.socket(obj);
			let _self=this;
		
				if(_self.$route.query.orderId){  //  从订单过来添加家属人员
					_self.orderId=_self.$route.query.orderId;
					_self.searchData.mobile2=_self.$route.query.mobile1;
					_self.searchData.orderEnd=_self.$route.query.orderEnd;
					_self.searchData.orderStart=_self.$route.query.orderStart;
					console.log("orderEnd",_self.$route.query.orderEnd);
					console.log("orderStart",_self.$route.query.orderStart);
				}else{
					var timestamp = (new Date()).valueOf();
					console.log(this.auto_time(timestamp));
					this.searchData.orderStart=this.auto_time(timestamp);
				}
		
			this.speak('请将身份证放于读卡器上点击“证件读取”按键');
		},
		methods:{
			speak(msg) {
			    var utterThis = new window.SpeechSynthesisUtterance()
			    utterThis.text = msg;
				window.speechSynthesis.speak(utterThis)
			},
			init(){
				let params={ pageSize: 100000, pageNumber: 1};
				this.$http.post(this.url+'/iotwebapi/api/publicrental/rental/listOrder',params).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						if(res.data.datas.length>0){
							for(let i=0;i<res.data.datas.length;i++){
								for(let j=0;j<res.data.datas[i].customers.length;j++){
									this.ordercard.push(res.data.datas[i].customers[j].idcard);
								}
							}
						
						}
					}
				})
			},
			phone1(e){
				var patt = /^[1][2-9][\d]{9}/;
				if(!patt.test(e)){
					this.$message.error("联系电话不正确!");
				}
				console.log(e);
			},
			phone2(e){
				var patt = /^[1][2-9][\d]{9}/;
				if(!patt.test(e)){
					this.$message.error("备用电话不正确!");
				}
				console.log(e);
			},
			get_card(tab){  //  获取身份证信息
			    this.tab=tab;
				this.one=true;
				this.two=false;
				this.three=false;
				this.four=false;
				this.five=false;
				this.six=false;
				let obj1={"module":"idcard","msgid":"123456789","function":"readcard","parameter":{"dev":"1","repeat":"1","readtype":"1"}};
				this.socket(obj1);	
				this.loading=true;
			},
			get_cardnum(){  //获取串口号，   要先拿串口号，再用这个串口号去发送指令
				let obj4={"module":"iccard","msgid":"123456789","function":"getcom","parameter":{"dev":"1"}};
				ws.send(JSON.stringify(obj4));	
			},
			get_idcard(num){   //  获取ID物理卡号
				let obj3={"module":"iccard","msgid":"123456789","function":"getidsnr","parameter":{"dev":"1","iport":num}};
				ws.send(JSON.stringify(obj3));	
			},
			get_card_pic(){  //  获取身份证照片
				let obj2={"module":"idcard","msgid":"123456789","function":"getcardimage","parameter":{"dev":"1","subcmd":"2"}};
			    ws.send(JSON.stringify(obj2));	
			},
			socket(obj){
				let _self=this;
				var ws = new WebSocket("ws://127.0.0.1:24012");
				ws.onopen = function(evt) { 
				  console.log("打开：",evt);
				  ws.send(JSON.stringify(obj));
				 console.log("发送指令：",JSON.stringify(obj));
				};
				ws.onerror= function(evt) {
					console.log("error",evt);
					
						_self.$message.error("请检查是否开启身份证阅读器驱动");
					
				};
				ws.onmessage = function(evt) {
				  // console.log( "接受信息：" +  evt.data);
				  
				  let odata=JSON.parse(evt.data);
				     if(odata.Certificate){
						  
						  _self.Certificate=odata.Certificate;
						  _self.searchData.Name=odata.Certificate.Name;
						  _self.searchData.Nation=odata.Certificate.Nation;
						  _self.searchData.Address=odata.Certificate.Address;
						
						  if(_self.ordercard.length>0){
							  for(let i in _self.ordercard){
								  if(_self.Certificate.IDNumber==_self.ordercard[i]){
									  _self.loading=false;
									  _self.speak('当前身份证人员已入住，请更换人员办理！');
									  _self.$alert('当前身份证人员已入住，请更换人员办理！', '提示', {
									            confirmButtonText: '确定',
									          });
									  ws.close();
									  return false;
								  }
							  }
						  }
						  if(odata.Certificate.Base64Photo){
							setTimeout(function(){
								// _self.get_card_pic();
								let obj2={"module":"idcard","msgid":"123456789","function":"getcardimage","parameter":{"dev":"1","subcmd":"2"}};
								ws.send(JSON.stringify(obj2));	
							},1000);
							
							_self.imgSrc="data:image/jpeg;base64,"+odata.Certificate.Base64Photo;  
						  }
				      }
				     if(odata.data){
						 if(odata.data.base64jpg){
						 	_self.cdcardImg="data:image/jpeg;base64,"+odata.data.base64jpg;
							 //  进度百分之20
							setTimeout(function(){
								// _self.get_cardnum();  //  发送串口号命令
								let obj4={"module":"iccard","msgid":"123456789","function":"getcom","parameter":{"dev":"1"}};
								ws.send(JSON.stringify(obj4));	
							},1500);
						 } 
						 if(odata.data.name){  // 拿到串口号
							 let num=odata.data.name.slice(3,odata.data.name.length).toString();
							 console.log("num",num);
							setTimeout(function(){ 
							  // _self.get_idcard(num);
							  let obj3={"module":"iccard","msgid":"123456789","function":"getidsnr","parameter":{"dev":"1","iport":num}};
							  ws.send(JSON.stringify(obj3));	
							},500)
						 }
						 if(odata.data.idsnr){   //  身份证卡号
						     _self.progress=20; 
							 _self.idsnr=odata.data.idsnr;
							 ws.close();
							 _self.loading=false;
							 _self.speak('请点击"开摄像头"按钮，进行拍照');
							 _self.open_cremd();
							 
						 }
						
					 }
				};
				ws.onclose = function(evt) {
				  console.log("关闭：",evt);
				};      
			},
			finger_socket(obj){   //  指纹socket
				let _self=this;
				var ws = new WebSocket("ws://127.0.0.1:8181");
				console.log("ws",ws);
				ws.onopen = function(evt) { 
				  console.log("open",JSON.stringify(obj)); 
				  ws.send(JSON.stringify(obj)); 
				  _self.loading=false;
				};
				ws.onerror= function(evt) {
					_self.speak("请检查是否开启指纹驱动"); 
				    _self.$message.error("请检查是否开启指纹驱动");	
					
				};
				ws.onmessage = function(evt) {
				  console.log( "Message: " +  evt.data);
				  let odata=JSON.parse(evt.data);
				  
				 if(odata.message){
					 _self.finger.push(odata.message);
				 }
				 if(odata.command=="Error"){
					 _self.$message.error("生成失败，请重新录入");
					 _self.finger=[];
					 ws.send(JSON.stringify(obj)); 
				 }
				 
				 
				 if(odata.command=="GetFingerprint"){
					 _self.fingerData.push(odata.data);
					 _self.oindex=_self.fingerData.length;
					 console.log("oindex",_self.oindex);
					 if(_self.oindex==1){
						_self.left="左手大拇指"; 
						_self.speak('左手大拇指录入成功,请换右手指录入指纹');  
					 }
					 if(_self.oindex==2){
						_self.left="右手大拇指"; 
						_self.speak('右手大拇指录入成功');  
					 }
					 
					 _self.$alert(_self.left+'录入成功', '指纹录入', {
					   confirmButtonText: '确定',
					   callback: action => {
						 _self.finger=[];
						 if(_self.oindex==2){  // 后面改3
							 _self.progress=60;  //  进度百分之80
							 _self.speak('两次指纹录入成功,请点击合同拍摄按钮进行拍照'); 
						 	 ws.close(); 
						 }else{
						 	 ws.send(JSON.stringify(obj)); 
						 }
					   }
					 }); 
				 }
				 
				 if(odata.message.slice(0,4)=="模块信息"){
					 console.log("oindex",_self.oindex);
					 
					 if(_self.oindex==0){  // 刚开始
						_self.speak("请放左手大拇指,录入指纹");  
					 }else if(_self.oindex==1){  // 第二次
						 _self.speak("请放右手大拇指,录入指纹");  
					 }
				 }
				 
				 
				 if(odata.command=="Message"){  //  录入指纹:请放手指
				    if(_self.oindex==0){  // 刚开始
						
						if(odata.message.slice(6,7)==1){
							_self.speak("请再次放左手大拇指");  
						}
				    	if(odata.message.slice(6,7)==2){
				    		_self.speak("请第三次放左手大拇指");  
				    	}
						if(odata.message.slice(6,7)==3){
							_self.speak("请第四次放左手大拇指");  
						}
				    }else if(_self.oindex==1){  // 第二次
				    	if(odata.message.slice(6,7)==1){
				    		_self.speak("请再次放右手大拇指");  
				    	}
				    	if(odata.message.slice(6,7)==2){
				    		_self.speak("请第三次放右手大拇指");  
				    	}
				    	if(odata.message.slice(6,7)==3){
				    		_self.speak("请第四次放右手大拇指");  
				    	}					 
				    }
				 }
				 
				};
				ws.onclose = function(evt) {
				  console.log("closed");
				  _self.loading=false;
				};  	   
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
			save(){   // 权限下发    
			    var patt = /^[1][2-9][\d]{9}/;
			    if(!this.$route.query.orderId){
					if(this.searchData.Name==""){
						this.$message.error("请输入姓名");
						return false;
					}
					if(this.searchData.Sex==""){
						this.$message.error("请输入性别");
						return false;
					}
					if(this.searchData.mobile1==""){
						this.$message.error("请输入联系电话");
						return false;
					}
					if(!patt.test(this.searchData.mobile1)){
						this.$message.error("联系电话不正确!");
						return false;
					 }
				}
			    
				// if(this.searchData.mobile2==""){
				// 	this.$message.error("请输入备用电话");
				// 	return false;
				// }
				// if(!patt.test(this.searchData.mobile2)){
				// 	this.$message.error("备用电话不正确!");
				// 	return false;
				// }
				if(!this.searchData.orderStart){
					this.$message.error("请选择开始时间");
					return false;
				}
				if(!this.searchData.orderEnd){
					this.$message.error("请选择结束时间");
					return false;
				}
				
				if(!this.$route.query.orderId){
					//  时间转换
					let star_time=new Date(this.searchData.orderStart).getTime();
					let end_time=new Date(this.searchData.orderEnd).getTime();
					if(end_time<star_time){
						this.$message.error("结束时间要大于开始时间");
						return false;
					}
					this.searchData.orderStart=this.auto_time(star_time);
					this.searchData.orderEnd=this.auto_time(end_time);
			    }
		
				// if(!this.imgContract && !this.orderId){
				// 	this.$message.error("请先操作合同拍摄");
				// 	return false;
				// }
				
				this.one=false;
				this.two=false;
				this.three=false;
				this.four=false;
				this.five=false;
				this.six=true;
				
				let Birthday=[
				this.Certificate.Birthday?this.Certificate.Birthday.slice(0,4):"",
				this.Certificate.Birthday?this.Certificate.Birthday.slice(4,6):"",
				this.Certificate.Birthdav?this.Certificate.Birthdav.slice(6.8):"",
				]

				let ValidDate=[
				this.Certificate.ValidDate?this.Certificate.ValidDate.slice(0,4):"",
				this.Certificate.ValidDate?this.Certificate.ValidDate.slice(4,6):"",
				this.Certificate.ValidDate?this.Certificate.ValidDate.slice(6.8):"",
				]

				let IssuedData=[
				this.Certificate.IssuedData?this.Certificate.IssuedData.slice(0,4):"",
				this.Certificate.IssuedData?this.Certificate.IssuedData.slice(4,6):"",
				this.Certificate.IssuedData?this.Certificate.IssuedData.slice(6,8):"",
				]

				let orderJson={
					chargeTime:this.searchData.orderStart,      //  房租计费日期
					customers:[{
						address:this.Certificate.Address,  //   身份证地址(add)
						birth:Birthday[0]+"-"+Birthday[1]+"-"+Birthday[1],  //   出生年月
						cardNo:this.idsnr,  //  开门卡号
						company:this.searchData.company,  // 公司
						customerName: this.searchData.Name?this.searchData.Name:this.Certificate.Name,  //  姓名
						nation:this.Certificate.Nation,  //  民族
						customerType:"",   // 租客类型
						fingerData1:this.fingerData[0],     // 指纹数据1
						fingerData2:this.fingerData[1],    // 指纹数据2
						// fingerData3:this.fingerData[2],   // 指纹数据3
						idcard:this.Certificate.IDNumber,      //  身份证号
						idcardEnd:ValidDate[0]+"-"+ValidDate[1]+"-"+ValidDate[1],   //  证件过期时间
						idcardStart:IssuedData[0]+"-"+IssuedData[1]+"-"+IssuedData[1],  //  证件发证时间
						issuing:this.Certificate.IDIssued,   //  发证机关
						mobile1:this.searchData.mobile1,  // 手机1
						mobile2:this.searchData.mobile2,   // 手机2
						// pwd:this.searchData.pwd,   //  开门密码(暂时不需要)
						sex:this.searchData.Sex?this.searchData.Sex:this.Certificate.Sex ,   //  性别
					}],
					deposit:this.searchData.deposit,  // 	押金
					orderEnd:this.searchData.orderEnd,   //  订单到期时间
					orderStart:this.searchData.orderStart,  //  订单开始时间
					powerPrice:this.searchData.powerPrice,  // 电费单价
					powerValue:this.searchData.powerValue,  // 电表读数
					rent:this.searchData.rent,   //  租金
					roomId:this.searchData.roomId,  // 房间编号
					roomInfo:{   // 房间信息
						areaName:this.searchData.areaName,  //  小区名称
						building:this.searchData.building,   // 楼栋
						unit:this.searchData.unit,   //  单元
						roomNo:this.searchData.roomNo,   //  房间号
					},  
					waterPrice:this.searchData.waterPrice,   // 水费单价
					waterValue:this.searchData.waterValue   // 水表读数	
				}
				console.log("orderJson",orderJson);
				let img1= this.dataURLtoFile(this.imgSrc);
				let img2= this.dataURLtoFile(this.img2);
				let img3="";
				if(!this.orderId){
					img3= this.dataURLtoFile(this.imgContract);
					orderJson.roomInfo=JSON.stringify(orderJson.roomInfo);
					console.log("roomInfo",orderJson.roomInfo);
				}else{
					orderJson.customers[0].orderId=this.orderId;
				}
				
				this.loading=true;
				let formdatas = new FormData();
				   
				   formdatas.append("imgCompare", img2);
				let url="";
				   if(!this.orderId){
					   formdatas.append("orderJson", JSON.stringify(orderJson));
					   formdatas.append("imgContract", img3);
					   url=this.url+'/iotwebapi/api/publicrental/rental/addOrder';
				   }else{
					   
					   formdatas.append("customerJson", JSON.stringify(orderJson.customers[0]));
					   url=this.url+'/iotwebapi/api/publicrental/rental/addCustomer';
				   }
				   formdatas.append("imgIdcard", img1);
				   
				this.$http.post(url,formdatas).then((res)=>{
					console.log(res,'办理入住成功');
					if(res.resultCode==0){
						// this.thisVideo.srcObject.getTracks()[0].stop();
						this.speak('办理入住成功');  
						this.loading=false;
						
						//  数据清空
						 orderJson={};
						 this.searchData.Name="";
						 this.searchData.Sex="";
						 this.searchData.Address="";
						 this.searchData.Nation="";
						 this.searchData.mobile1="";
						 this.searchData.mobile2="";
						 this.searchData.company="";
						 this.searchData.orderStart=""; 
						 this.searchData.orderEnd="";
						 this.progress=0;
						 this.cdcardImg="";
					     this.imgSrc="";
						 this.idsnr="";
						 this.img2="";
						 this.tab=1;
						 this.one=false;
						 this.two=false;
						 this.three=false;
						 this.four=false;
						 this.five=false;
						 this.six=false;
						  
						this.$message({
							message: '入住成功',
							type: 'success',
							duration:1300,
							onClose:res=>{
								this.progress=100; 
						        setTimeout(function(){
						        	window.location.reload();
						        },200);
								this.$router.replace({
									path:'/rent-relet',
									query:{
										
									}
								})
							}
						});
					}else{
						this.$message.error(res.message);
						this.loading=false;
					}
				 })
				
			},
			fingerprint(tab){   //  指纹采集
				// if(this.progress!=40){
				// 	this.$message.error("请先操作人证核验");
				// 	return false;
				// }
			    // this.thisVideo.srcObject.getTracks()[0].stop();
				this.one=false;
				this.two=false;
				this.three=false;
				this.four=true;
				this.five=false;
				this.six=false;
				this.tab=tab;
				let obj = {
                        command: 'GetFingerprint',
                        message: '',
                        data: ''
                    }
			   this.loading=true;
				this.finger_socket(obj);
			},
			getCompetence (tab) {   //  人脸拍照      
			     
				if(tab==2){
					if(!this.imgSrc){
						this.$message.error("请先操作证件读取");
						return false;
					}
					this.one=false;
					this.two=true;
					this.three=false;
					this.four=false;
					this.five=false;
					this.six=false;
				}else if(tab==4){
					if(this.fingerData.length!=2){   //  后面改3
						this.$message.error("请先操作指纹采集");
						return false;
					}
					this.one=false;
					this.two=false;
					this.three=false;
					this.four=false;
					this.five=true;
					this.six=false;
				}
				this.tab=tab;
				let _self=this;
				setTimeout(function(){
					_self.open_cremd();
				},500);
			    
			   },
			   changephon(){  //  切换摄像头
				   this.type=!this.type;
				   this.open_cremd(this.type);
			   },
			// 绘制图片（拍照功能）
			   setImage () {
			    var _this = this
				if(!_this.thisVideo){
					this.$message.error("请打开摄像头");
					return false;
				}
			    // 点击，canvas画图
			
			    _this.thisContext.drawImage(_this.thisVideo, 0, 0, _this.videoWidth, _this.videoHeight)
				
			    // 获取图片base64链接
			    var image = this.thisCancas.toDataURL();
				if(this.tab==2){
					_this.img2 = image;
					_this.loading=true;
					this.stopNavigator(); // 人脸校验
					// this.speak('拍照完成，点击人证核验进行人脸校验');
					console.log("_this.img2",_this.img2);
				}else if(this.tab==4){
					this.progress=80;
					this.speak('拍照完成，请检查联系电话和日期是否有误，确认无误后，点击确认入住按钮'); 
					_this.imgContract = image;
					console.log("_this.imgContract",_this.imgContract);
				}   
			    
			    // this.$emit('refreshDataList', this.img2)
			   },
			// base64转文件
			   dataURLtoFile (str, fileName, type) {
				   if (str) {
				    //    throw new Error("str不能为空");
				     
				     const arr = str.split(","),
				       mime = arr[0].match(/:(.*?);/)[1],
				       bstr = window.atob(arr[1]);
				     let n = bstr.length;
				     const uArr = new Uint8Array(n);
				     while (n--) {
				       uArr[n] = bstr.charCodeAt(n);
				     }
				     fileName = fileName || Date.now().toString();
				     return new File([uArr], fileName, {
				       type: type || mime,
				     });
					 }
			   },
			   //  打开摄像头
			   open_cremd(type){
				   var _this = this;
				  
				    _this.thisVideo = document.getElementById('videoCamera');
				    _this.thisCancas = document.getElementById('canvasCamera');
				    _this.thisContext = _this.thisCancas.getContext('2d');
				
				   // _this.loading=true;
				    //访问用户媒体设备的兼容方法
				        function getUserMedia(constraints, success, error) {
				          if (navigator.mediaDevices.getUserMedia) {
				            //最新的标准API

				            navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
				          } else if (navigator.webkitGetUserMedia) {
				            //webkit核心浏览器
				            navigator.webkitGetUserMedia(constraints, success, error)
				          } else if (navigator.mozGetUserMedia) {
				            //firfox浏览器
				            navigator.mozGetUserMedia(constraints, success, error);
				          } else if (navigator.getUserMedia) {
				            //旧版API
				            navigator.getUserMedia(constraints, success, error);
				          }
						  
				        }
				        
				        function success(stream) {
				          //兼容webkit核心浏览器
				          let CompatibleURL = window.URL || window.webkitURL;
				          //将视频流设置为video元素的源
				          console.log("stream",stream);
				    
				          //video.src = CompatibleURL.createObjectURL(stream);
						
							_this.thisVideo.srcObject = stream;
							_this.thisVideo.play();
						
						  _this.off=1;
				        }
				    
				        function error(error) {
				          console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
						   _this.speak('摄像头可能没插好，请换个插口，重新点击开摄像头按钮');
						  if(type){
							 _this.open_cremd(type); 
						  }else{
							 _this.open_cremd(); 
						  } 
						}
					
				    navigator.mediaDevices.enumerateDevices().then((devices) => {
						 let deviceId=[];
						 console.log("devices",devices); 
						 for(let i in devices){
							 if(devices[i].kind=="videoinput"){
								 deviceId.push(devices[i].deviceId);
							 }
						 }
						 console.log("deviceId",deviceId); 
						 _this.videolength=deviceId.length;
						
						 
				        if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
				          //调用用户媒体设备, 访问摄像头
						      let auto_deviceId="";
						      if(deviceId.length==1){ 
								  auto_deviceId=deviceId[0];
							  }else if(deviceId.length==2){
								  if(_this.tab==2){  //  拍人脸    
									 auto_deviceId=deviceId[0];		 
								  }else if(_this.tab==4){   //  拍合同   
								  	  auto_deviceId=deviceId[1];
								  }
							  }
							  
							  console.log("type",type);
							  if(type){
								   this.thisVideo.srcObject.getTracks()[0].stop();
								   if(type==false){							 
									  if(auto_deviceId==deviceId[0]){
										 auto_deviceId=deviceId[1]; 
									  }else{
										 auto_deviceId=deviceId[0]; 
									  }
								   }else if(type==true){
									  if(auto_deviceId==deviceId[0]){
										auto_deviceId=deviceId[1]; 
									  }else{
										auto_deviceId=deviceId[0]; 
									  }
								   }
							  }else{
								  if(_this.tab==2){  //  拍人脸
								  	 _this.speak('目前有'+deviceId.length+'个摄像头能使用');
								  }
								 
							  }
							  
							  console.log("auto_deviceId",auto_deviceId);
							  getUserMedia({
							  	video: {
							  	  deviceId: { exact: auto_deviceId},
							  	  width:320,
							  	  height: 260
							  	}
							  }, success, error);			
						
				        } else {
				          alert('不支持访问用户媒体');
				        }
					 })
			   },
			// 关闭摄像头  同时人证校验
			   stopNavigator () {
				   if(!this.img2){
					   this.$message.error("请先操作人脸拍照");
					   return false;
				   }
				   this.one=false;
				   this.two=false;
				   this.three=true;
				   this.four=false;
				   this.five=false;
				   this.six=false;
				   
				   if(this.imgSrc && this.img2){
					   let img1= this.dataURLtoFile(this.imgSrc);
					   let img2= this.dataURLtoFile(this.img2);
					    
					   let formdatas = new FormData();
					      formdatas.append("img1", img1);
						  formdatas.append("img2", img2);
						  this.$http.post(this.url+'/iotwebapi/api/face/compareFace',formdatas).then((res)=>{
							console.log(res);
							this.loading=false;
							if(res.resultCode==0){
								if(res.data>0.6){
									this.$message({
									  message: '人脸对比成功',
									  type: 'success',
									  duration:2000,
									  offset:400,
									  onClose:res=>{
										
										this.progress=40;
										this.tab=3;
										this.speak('人脸校验成功，请先开启“指纹设备接口”软件，再点击“指纹采集”按钮');
									  }
									});
								}else{
									
									this.$message.error("人脸对比失败");
								}
								
							}else{
								
								this.$message.error(res.message);
							}
						  })
				   }else{
					  this.$message.error("请先读取证件和人脸拍照"); 
				   }
				   
			          
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
			   }
		}
	}
</script>

<style scoped lang="scss">
	.main{
		width:100%;
		height:100%;
	}
	.oneActive,.twoActive,.threeActive,.fourActive,.fiveActive,.sixActive{
		background: #409EFF;
		color:#fff;
	}
	.header{
		position: relative;
		height:50px;
		line-height:50px;
		div{
			position: absolute;
			right:10px;
			top:0px;
			color:#aaa;
			span{
				font-size:19px;
				font-weight:bold;
				color:#f00;
				padding-right:5px;
			}
		}
	}
	.card{
		padding:20px;
		box-sizing:border-box;
		
		div{
			display:inline-block;
			vertical-align:top;
			border:1px dashed;
			height:260px;
			border-radius:10px;
			
		}
		.cd_card{
			width:460px;
			margin-right:120px;
			text-align:center;
			position: relative;
			span{
				line-height:260px;
				
			}
			button{
				position:absolute;
				bottom:78px;
				right:-111px;
			}
			.buttontwo{
				bottom:150px;
			    right: -119px;
			}
		}
		.face{
			width:320px;
			position: relative;
			span{
				position: absolute;
				line-height:25px;
				display:inline-block;
				top:50px;
				padding:0px 10px;
				box-sizing:border-box;
			}
			.card_img{
				border:none;
				position:relative;
				img{
					// width:320px;
					// height:260px;
					width:130px;
					height:auto;
					position: relative;
					top:35px;
					left:90px;
				}
				video,canvas,img{
				 -moz-transform:scaleX(-1);
				 -webkit-transform:scaleX(-1);
				 -o-transform:scaleX(-1);
				 transform:scaleX(-1);
				}
			}
		}
	}
	.bottom{
		div.box{
			display:inline-block;
			vertical-align:top;
			width:130px;
		}
	}
	
</style>