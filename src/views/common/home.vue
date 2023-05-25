<template>
	<div class="plr30">
		<div class="left clearfix">
			<section class="statistics">
				<span class="title">订单数量</span>
				<img src="../../assets/img/four.png">
				<div class="echart" id="one" style="width: 540px;height:260px;">
					
				</div>
			</section>
			
			<section class="statistics">
				<span class="title">房源</span>
				<img src="../../assets/img/four.png">
				<div class="echart" id="two" style="width: 540px;height:270px;">
				
				</div>
			</section>
			
			<section class="statistics">
				<span class="title">小区</span>
				<img src="../../assets/img/four.png">
				<div class="boxt">
					<ul style="margin-top: 8px;">
						<li class="top">
							<span>省</span>
							<span>市</span>
							<span>区</span>
							<span>街道</span>
							<span>小区名称</span>
						</li>
						<div id="con1" ref="con1" :class="{'anim':animate==true}">
							<div>
								<li v-for="item in arealist">
									<span>{{item.provinceName}}</span>
									<span>{{item.cityName}}</span>
									<span>{{item.countyName}}</span>
									<span>{{item.streetName}}</span>
									<span>{{item.areaName}}</span>
								</li>
							</div>
						 </div>
					</ul>
				</div>
			</section>
		</div>
		
		
		<div class="left clearfix">
			<section id="total" class="box" style="margin-top:25px;">
				<ul>
					<li>
						<p>订单（个）</p>

						<count-to style="color:#E86464;"  :start-val="0" :end-val="orderCount" :duration="4000" class="UnidreamLED" />
					
						<img src="../../assets/img/two.png">
					</li>
					<li>
						<p>房源（套）</p>
						
						<count-to style="color:#91CC75;" :start-val="0" :end-val="roomCount" :duration="4000" class="UnidreamLED" />
						<img src="../../assets/img/two.png">
					</li>
					<li>
						<p>租客（人）</p>
						
						<count-to style="color:#4861AB;" :start-val="0" :end-val="customerCount" :duration="4000" class="UnidreamLED" />
					</li>
				</ul>
			</section>
			<section id="map" class="box mt20">
				<div id="maps" style="width:1090px;height:458px;">
					
				</div>
				
				<div class="left clearfix">
					<section class="statistics">
						<span class="title">租客分布</span>
						<img src="../../assets/img/four.png" style="width:1097px;">
						
						<div class="echart" id="five" style="width: 350px;height:310px;">
							
						</div>
						
						<div class="echart" id="three" style="width: 320px;height:310px;left:350px;">
							
						</div>
						
						<div class="echart" id="four" style="width: 440px;height:310px;right:0px;left: inherit;">
							
						</div>
						
					</section>
				</div>
			</section>
		</div>
		
		
	</div>
</template>

<script>
	// import echarts from 'echarts'
	// require('echarts/theme/macarons') // echarts theme
	import CountTo from 'vue-count-to'
	export default{
		components: {
		  CountTo
		},
		data(){
			return{
				url:process.env.VUE_APP_URL,
				customerCount:0,
				orderCount:0,
				roomCount:0,
				arealist:[],   //  滚动效果
				areatableData:[], // 小区列表,放在地图上
				year:(new Date()).getFullYear(),
				animate:false,
				timer1:"",
			}
		},
		created() {
			console.log("year",this.year);
		},
		mounted() {
			this.areaName();
			this.all();
			this.order_list();
			
			this.piedata("nation");
			this.piedata("sex"); 
			this.piedata("province");
			
		},
		beforeDestroy(){
			if(this.timer1){
				clearInterval(this.timer1); //关闭	
			}
			
		},
		methods:{
			order(month_list,unRegisterUser){
				var myChart = echarts.init(document.getElementById('one'));
				var option = {
					color: ['#5470A8'],
					textStyle:{
						color:"#fff",	
					},
					title: {
					  subtext: "单位(个)",	
					},
				  tooltip: {
					trigger: 'axis',
					backgroundColor:'rgba(255,255,255,0.8)',//经过设置rgba调节背景颜色与透明度
					color:'#000',
					textStyle:{
						color:'#000',
					}
				  },
				  legend: {
					  selectedMode:false,
					  textStyle: {
					     color: '#fff'
					  }
				  },
				  grid:{
					  top:"35px",
					  left:'20px',
					  right:'25px',
					  bottom:'10px',
					  containLabel:true
				  },
				  xAxis: {
					type: 'category',
					boundaryGap: false,
					data: month_list,
					// name: "月" //坐标名字
				  },
				  yAxis: {
					type: 'value',
					splitLine:{
						lineStyle:{
						   type:"dashed",
						   color:"#5470c6"
						}
					}
				  },
				  series: [
					{
					  name: '订单数量',
					  type: 'line',
					  data: unRegisterUser,
					  // symbol:'none',  // 显示圆点
					  smooth:true
					}
				  ]
				};
				myChart.setOption(option);
			},
			roomOrder(month_list,roomList,orderList){
				var myChart = echarts.init(document.getElementById('two'));
				let option = {
				  color: ['#DA8F1A','#91CC75'],
					textStyle:{
						color:"#fff",	
					},
					title: {
					  subtext: "单位(套)",	
					},
				  tooltip: {
					trigger: 'axis',
					backgroundColor:'rgba(255,255,255,0.8)',//经过设置rgba调节背景颜色与透明度
					color:'#000',
					textStyle:{
						color:'#000',
					}
				  },
				  legend: {
					selectedMode:false,
					textStyle: {
					 color: '#fff'
					},
					data:[
						{name:'房源'},
						// {name:'订单'},
					]
				  },
				  grid: {
				    top:"35px",
				    left:'20px',
				    right:'25px',
				    bottom:'10px',
				    containLabel:true
				  },
				  calculable: true,
				  xAxis: {
				    type: 'category',
				    data: month_list
				  },
				  yAxis: {
				     type: 'value',
					 splitLine:{
					 	lineStyle:{
					 	   type:"dashed",
					 	   color:"#5470c6"
					 	}
					 }
				  },
				  series: [
				    {
				      name: '房源',
				      type: 'bar',
				      // stack: 'total',
				      barWidth:10,
				      label: {
				        show: true,
						color:"#fff"
				      },
				      emphasis: {
				        focus: 'series'
				      },
					  itemStyle:{
						normal:{   //  圆角
							barBorderRadius:[20,20,0,0]
						}  
					  },
				      data: roomList
				    },
				  //   {
				  //     name: '订单',
				  //     type: 'bar',
				  //     // stack: 'total',
				  //     barWidth:10,
				  //     label: {
				  //       show: true,
						// color:"#fff"
				  //     },
				  //     emphasis: {
				  //       focus: 'series'
				  //     },
				  //     itemStyle:{
						// normal:{   //  圆角
						// 	barBorderRadius:[20,20,0,0]
						// }  
					 //  },
				  //     data: orderList
				  //   },
				   
				  ]
				}
				myChart.setOption(option);
			},
			pie(title,color,datas,formatter,name){  // 饼图
				var myChart = echarts.init(document.getElementById(title));
			
				var option = {
				  title: [
				      {
						top: '0px',
				        left: '40px',
				        text: name,
						textStyle:{
							color:"#fff"
						}
				      }
				    ],
				  tooltip: {
				    trigger: 'item',
					show:false
				  },
				  legend: {
				    top: '0px',
					selectedMode:false,
				    right: 'right',
					textStyle:{
						color:'#fff'
					},
				  },
				  series: [
				    {
				      type: 'pie',
					  color:color,
				      radius: ['30%', '55%'],
					  center: ['35%', '40%'],
					  itemStyle: {
					    borderRadius: 5,
					    borderColor: '#000',
					    borderWidth: 1
					  },
				      label: {
				        show: false,
				        position: 'center',
						// formatter: '{name|{b}}\n {time|  {c}kg}',
						formatter:formatter,
						lineHeight: 20,
						fontSize: 12,
						rich: {
						  time: {	
							color: '#fff',
							fontSize: 12,
						  }
						},
				      },
				      emphasis: {
				        label: {
				          show: true,
				          fontSize: 12,
				          fontWeight: 'bold',
						  color:'#fff'
				        }
				      },
				      labelLine: {
				        show: false
				      },
				      data: datas
				    }
				  ]
				};
				myChart.setOption(option);
				
				var max = datas[0].value;
				    //声明了个变量 保存下标值
				    var index = 0;
				    for (var i = 0; i < datas.length; i++) {
				        if (max < datas[i].value) {
				            max = datas[i].value;
				            index = i;
				        }
				    }
				console.log("oindex",index);
				myChart.dispatchAction({ type: 'highlight', dataIndex: index }); // dataIndex属性伟data传入的索引值
				myChart.dispatchAction({ type: 'showTip', seriesIndex: index, position: [120, 220], dataIndex: index }); // 点击生成detip工具条位置
				myChart.on('mouseover', (e) => {
					
				  if (e.dataIndex !== index) { // 当鼠标移除的时候 使默认的索引值去除默认选中
				  
					myChart.dispatchAction({ type: 'downplay', dataIndex: index });
				  }
				});
				myChart.on('mouseout', (e) => {
					
					myChart.dispatchAction({ type: 'highlight', dataIndex: index }); // dataIndex属性伟data传入的索引值
				})
				
			},	
			map(lat,lng,area_list){   // 地图 
			    var center = new TMap.LatLng(lat,lng);//设置中心点坐标
			    //初始化地图
			    var map = new TMap.Map('maps', {
			        center: center,
					zoom: 13,
			    });
			    
			    //创建并初始化MultiMarker
			    var markerLayer = new TMap.MultiMarker({
			        map: map,  //指定地图容器
					draggable: true,//手势控制, 用来设置地图是否能够鼠标拖拽，默认值为“可以”；
					scrollwheel: false,//用来配置地图是否能够通过鼠标滚轮操作进行放大，默认值为“可以”；
					disableDoubleClickZoom: false,// 用来配置地图是否可以通过鼠标双击进行放大，默认值为“可以”。
			        //点标记数据数组
			        geometries: area_list
			    });
				
			
				let infoWindow ="";
				
				markerLayer.on("mousemove", function (evt) {
					//设置infoWindow
					
					if(infoWindow){
						infoWindow.close();//初始关闭信息窗关闭
					}
					infoWindow = new TMap.InfoWindow({
						map: map, 
						position: new TMap.LatLng(evt.geometry.position.lat,evt.geometry.position.lng), //设置信息框位置
						offset: { x: 0, y: -45 }, //向上偏移35像素坐标，向左偏移3像素坐标
						content:"<div><span style='font-weight: bold;'>"+evt.geometry.name+"</span><p style='height:25px;line-height:25px;'>待入住:<span style='color:#41ad0c;'>"+evt.geometry.unused+" </span>,  已入住:<span style='color:#f56c6c;'>"+evt.geometry.used+"</span></p></div>",//设置信息框内容
						
					});
					
					markerLayer.on("mouseout", function (evt) {	 // 鼠标移出事件
						infoWindow.close();//初始关闭信息窗关闭	
					})
				})
				markerLayer.on("click", function (evt) {
					console.log("evt",evt);
				})
				
				
				
	
			},
			areaName(){  //  小区列表
				this.$http.get(this.url+'/iotwebapi/api/publicrental/store/roomStateAnalyse').then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						this.areatableData=res.data;
						this.arealist=res.data;
						if(this.arealist.length>2){
							this.timer1= setInterval(this.scroll,1000);
						}
						
						// setInterval(this.scroll,1000)
						// if(this.areatableData[0].coord){
						// 	let coord=this.areatableData[0].coord.split(',');
						// }
						let coord="";
						for(let i in this.areatableData){
							if(this.areatableData[i].coord){
								coord=this.areatableData[i].coord.split(',');
							}
						}
						
						console.log("coord",coord);
						let lat='';let lng='';
						let area_list=[];
						if(res.data.length>0){
							lat=parseFloat(coord[0]);
							lng=parseFloat(coord[1]);
							for(let i in res.data){
								if(res.data[i].coord){
									res.data[i].pos=res.data[i].coord.split(',');
									
									area_list.push({
										id:"label",
										styleId:"styleId",
										position:new TMap.LatLng(res.data[i].pos[0],res.data[i].pos[1]),
										properties:{
											"title": "marker2"
										},
										name:res.data[i].areaName,
										unused:res.data[i].unused,
										used:res.data[i].used
									})
								}
							}
						}else{
							lat=39.984104;
							lng=116.307503;
						}
						this.map(lat,lng,area_list);
						
						
						
					}
				})
			},
			all(){
				this.$http.get(this.url+'/iotwebapi/api/publicrental/store/storeAnalyseCount').then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						this.customerCount=res.data.customerCount;
						this.orderCount=res.data.orderCount;
						this.roomCount=res.data.roomCount;
					}
				})
			},
			order_list(){   //  订单按月统计添加数量
			    let month_list=[];
			    let unRegisterUser=[];
				this.$http.get(this.url+'/iotwebapi/api/publicrental/store/orderAnalyse',{year:this.year}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){	
						// month_list=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
						// unRegisterUser=[23,54,23,15,89,21,85,45,71,59,98,45];
						for(let i in res.data){ 
							month_list.push(res.data[i].month+"月");
							unRegisterUser.push(res.data[i].count);
						}
						
						this.order(month_list,unRegisterUser);
						this.room_list(month_list,unRegisterUser);
					}
				})
			},
			room_list(month_list,unRegisterUser){  //  房源按月统计导入数量
				this.$http.get(this.url+'/iotwebapi/api/publicrental/store/roomAnalyse',{year:this.year}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){	
						let roomList=[];
						for(let i in res.data){ 
							roomList.push(res.data[i].count);
						}
						this.roomOrder(month_list,roomList,unRegisterUser);
					}
				})
			},
			piedata(type){   //  饼图数据
				this.$http.get(this.url+'/iotwebapi/api/publicrental/store/customerAnalyseOther',{analyseType:type}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){	
						let color=['#5470c6','#ee6666','#178310','#66b1ff',
						   '#e1a04f','#cb4fe1','#4fe183','#dbede1','#108349','#ab1d72','#ab8c1d',
						   '#470ed1','#b4eb49','#182234','#f56c98','#1ac79f','#183234','#8047db','#d71d61','#d7b81d'
						   ];
						if(type=="nation"){  //  民族
							let fourdatas=[];
							if(res.data.length>0){
								for(let i in res.data){
									if(res.data[i].key.slice(res.data[i].key.length-1,res.data[i].key.length)=="族"){
										fourdatas.push({ value:res.data[i].value, name:res.data[i].key})
									}else{
										fourdatas.push({ value:res.data[i].value, name:res.data[i].key+"族"})
									}
									
								}
								this.pie("four",color,fourdatas,'{name|{b}}\n {time|  {c}人}',"民族");
							}
						}else if(type=="sex"){   //  男女
							let threedatas=[{ value:0, name: "男"},{ value:0, name: "女"}];
							if(res.data.length>0){
								for(let i in res.data){
									if(res.data[i].key=="男"){
										threedatas[0].value=res.data[i].value;
									}
									if(res.data[i].key=="女"){
										threedatas[1].value=res.data[i].value;
									}
								}
							}
							this.pie("three",color,threedatas,'{name|{b}}\n {time|  {c}人}',"男/女");
						
						}else if(type=="province"){  // 省
							let fivedatas=[];
							if(res.data.length>0){
								for(let i in res.data){
									fivedatas.push({ value:res.data[i].value, name:res.data[i].key})
								}
								this.pie("five",color,fivedatas,'{name|{b}}\n {time|  {c}人}',"省");
							}
							
						   
						}
					}
				})
			},
			scroll(){
				let con1 = this.$refs.con1;
				con1.style.marginTop='0px';
				this.animate=!this.animate;
				var that = this; // 在异步函数中会出现this的偏移问题，此处一定要先保存好this的指向
				if(that.arealist.length>2){
					setTimeout(function(){
					that.arealist.push(that.arealist[0]);
					that.arealist.shift();
					con1.style.marginTop='0px';
					that.animate=!that.animate; // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
					},1000)
				}	
			},
			// mEnter () {
			//   clearInterval(this.timer1)
			// },
			// mLeave () { 
			// 	// this.timer1= setInterval(this.scroll,1000)
			// },
		}
	}
</script>

<style lang="scss" scoped>
	
	   @font-face {
	        font-family: "UnidreamLED";
	        src: url("../../font/UnidreamLED.ttf") format("truetype"); //UnidreamLED.ttf在项目中的位置
	    }
	    .UnidreamLED {
			font-size:50px;
	        font-family: "UnidreamLED", "Helvetica Neue", Helvetica, Arial, sans-serif;
	    }
	
	.plr30{
		background-image:url('../../assets/img/background.png'); 
		background-size:100% 100%;
		min-height:880px;
		min-width:1650px;
		overflow-y: scroll;
		position: absolute;
		top:20px;
		left:20px;
		padding-left:0px;
		padding-right:0px;
	}
	.mt20{
		margin-top:0px;
	}
	.card-panel-num{
		font-size: 20px;
		color: #77ffff;
	}
	.left,.right{
		// float: left;
		display: inline-block;
		vertical-align:top;
	}
	// .right{float: left;}
	// .box{
	// 	border: 1px solid #0a174a;
	// 	box-shadow:inset 0px 0px 10px 1px #011f86;
	// 	.tit{padding: 10px 0 10px 30px;}
	// }
	.statistics{
		position:relative;
		margin-top:10px;
		span.title{
			position:absolute;
			color:#fff;
			font-size:15px;
			font-weight:bold;
			top:0px;
			left:50%;
			display:inline-block;
			width:120px;
			text-align:center;
			margin-left:-60px;
			height:0px;
			line-height:16px;
		}
		img{
			width: 540px;
			height: 270px;
		}
		.echart{
			padding:30px 10px 0px 10px;
			box-sizing:border-box;
			position:absolute;
			top:0px;
			left:0px;
			width:100%;
			height:100%;
		}
		.boxt{
			width: 496px;
			position:absolute;
			z-index:9;
			top:20px;
			left:20px;
			text-align:center;
			p{
				height:40px;
				line-height:40px;
				font-size:13px;
				// color:#91CC75;
				.num{
					font-size:16px;
				}
				.rights{
					padding-left:40px;
				}
			}
			li{
				height:40px;
				line-height:40px;
				font-size:13px;
				color:#aaa;
				span{
					display:inline-block;
					width:96px;
					text-align:center;
					white-space:nowrap;
					overflow:hidden;
					text-overflow:ellipsis;
				}
				
			}
			.top{
				background:#2A343C;
				color:#fff;
			}
			div li:nth-child(2n){
				background:#111C26;
			}
		}
	}
	#orderRecord{
		width: 450px;
		height: 250px;
		ul{
			padding: 20px 30px 0;
			li{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px 0;
				font-size: 14px;
				background: #002b49;
				span{
					flex: 1;
					text-align: center;
				}
			}
			#con1{
				height: 125px;
				transition: all 0.5s;
				overflow:hidden;
				/*position:relative;*/
				div{	
					overflow:hidden;
					transition: all 0.5s;
					
					/*overflow-y: scroll;*/
					height: 125px;
					/*transition:all 1s;
					transform: translateY(0px);*/
					
					li:nth-child(2n-1){
						background: none;
						padding: 25px 0;
					}
				}
				
			}
		}
		
	}
	
	#total{
		width: 1090px;
		// height: 120px;
		// padding-top:40px;
		box-sizing:border-box;
		color:#eee;
		ul{
			height: calc(100% - 45px);
			// display: flex;
			justify-content: space-around;
			align-items: center;
			li{
				text-align: center;
				font-size: 18px;
				position:relative;
				width:358px;
				display:inline-block;
				div{
					padding-top:10px;
					span{
						font-size:25px;
						padding-right:10px;
						letter-spacing:2px;
						font-weight:bold;
					}
				}
				.total_one span{
					color:#E86464;
				}
				.total_two span{
					color:#91CC75;
				}
				.total_three span{
					color:#4861AB;
				}
				.card-panel-num{
					font-size: 40px;
					font-family: Unid;
					letter-spacing: 5px;
				}
				img{
					
					position:absolute;
					top:0px;
					right:0px;
				}
			}
		}
	}
	
	#orderTotal{
		width: 450px;
		height: 250px;
	}
	// #maps{
	// 	transform:rotateX(80deg); 
	// }
	#map{
		// width: 910px;
		// height: 665px;
		position: relative;
		.bg{
			width:880px;
			height:385px;
		}
		.statistics{
			display:inline-block;
			img{
				width:430px;
			}
		}
		p{
			text-align:center;
			font-size:25px;
			color:#eee;
			margin-bottom:7px;
			span{
				display:inline-block;
				width:100px;
				height:1px;
				border-top:1px solid #ccc;
				box-shadow:0px 0px 5px #fff;
				vertical-align: top;
				margin-top:16px;
			}
		}
		.divceNum{
			width: 200px;
			height: 150px;
			position: absolute;
			bottom: 30px;
			left: 30px;
			.shadow{
				background: #4090fd;
				opacity: 0.5;
				width: 100%;
				height: 100%;
			}
			.divce{
				width: 100%;
				height: 100%;
				position: absolute;
				top: 34px;
				text-align: center;
				font-size: 25px;
				p{margin-top: 6px;}
				.card-panel-num{
					margin-top: 10px;
					font-size: 40px;
				    font-family: Unid;
					letter-spacing: 5px;
				}
			}
		}
	}
	
	
	#ranking{
		width: 450px;
		height: 366px;
		ul{
			padding: 20px 30px 0;
			li{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px 0;
				font-size: 14px;
				background: #002b49;
				span{
					flex: 1;
					text-align: center;
				}
			}
			
				
				div{
					height: 245px;
				    overflow:hidden;
					scrollbar-width: none; /* firefox */
					-ms-overflow-style: none; /* IE 10+ */
					overflow-y: scroll;
					li:nth-child(2n-1){
						background: none;
						padding: 25px 0;
					}
				}
				div::-webkit-scrollbar {
				  display: none; /* Chrome Safari */
				}
			
			
		}
	}
	.anim{
	  transition: all 0.5s;
	}
	.tac{
		position: relative;
		span{
			position: absolute;
			z-index:9;
			left: 50%;
			display:inline-block;
			font-size:32px;
			letter-spacing:2px;
			font-weight:bold;
			font-family: monospace;
			width:460px;
			margin-left:-246px;
			top:20px;
			text-shadow: 5px 5px 10px;
		}
	}
	
</style>