<template>
	<div class="main">
		<div class="header">
			<h3>{{data.areaName}}</h3>
			<div>
				<!-- <el-button type="primary" style="font-size:12px;" @click="black">返回</el-button> -->
				<el-button v-if="data.roomState=='待入住'" type="primary" style="font-size:12px;" @click="next">入住</el-button>
			</div>
		</div>
		<div class="middle">
			<div class="left">
				<el-carousel indicator-position="outside" height="350px" v-if="bannerImg.length>0">
					<el-carousel-item v-for="item in bannerImg" :key="item">
					  <img :src="item"/>
					</el-carousel-item>
				  </el-carousel>
				<img v-else src="../../../assets/img/info.jpg"/>
			</div>
			<div class="right">
				<div class="list">
					<div>
						<p>{{data.m1}}</p>
						月租金
					</div>
					<div>
						<p>{{data.m3}}</p>
						季租金
					</div>
					<div>
						<p>{{data.m6}}</p>
						半年租金
					</div>
					<div>
						<p>{{data.m12}}</p>
						年租金
					</div>
				</div>
				<div class="list">
					<div>
						<p>{{data.d1}}</p>
						月押金
					</div>
					<div>
						<p>{{data.d3}}</p>
						季押金
					</div>
					<div>
						<p>{{data.d6}}</p>
						半年押金
					</div>
					<div>
						<p>{{data.d12}}</p>
						年押金
					</div>
				</div>
				<div class="list">
					<div>
						<p>{{data.rentType}}</p>
						出租方式
					</div>
					<div>
						<p>{{data.roomType}}</p>
						户型
					</div>
					<div>
						<p>{{data.size}}平米</p>
						建筑面积
					</div>
				</div>
				<!-- <div class="list">
					<div>
						<p>南</p>
						朝向
					</div>
					<div>
						<p>中层</p>
						楼层（共26层）
					</div>
					<div>
						<p>简单装修</p>
						装修
					</div>
				</div> -->
				<div class="address">
					<p><span>小区</span>{{data.areaName}}</p>
					<p><span>地址</span>{{data.address}}</p>
					<!-- <p><span>入住时间</span>2020年6月20日</p> -->
				</div>
			</div>
		</div>
		<div class="bottom">
			<div class="title">配套设施</div>
			<div class="list">
				<div>
					<img src="../../../assets/img/houer2.png"/>
					<p>床({{data.bed}})</p>
				</div>
				<div>
					<img src="../../../assets/img/houer4.png"/>
					<p>燃气灶({{data.gasStove}})</p>
				</div>
				<div>
					<img src="../../../assets/img/houer3.png"/>
					<p>电视({{data.tv}})</p>
				</div>
				<div>
					<img src="../../../assets/img/houer1.png"/>
					<p>冰箱({{data.icebox}})</p>
				</div>
				<!-- <div>
					<img src="../../../assets/img/houer6.png"/>
					<p>洗衣机({{data.}})</p>
				</div> -->
				<div>
					<img src="../../../assets/img/houer5.png"/>
					<p>热水器({{data.waterHeater}})</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				url:process.env.VUE_APP_URL,
				data:"",
				bannerImg:[],
				roomId:this.$route.query.roomId
			}
		},
		created() {
			this.init();
		},
		methods:{
		   async init(){
				this.$http.post(this.url+'/iotwebapi/api/publicrental/area/listRoom',{roomId:this.$route.query.roomId}).then((res)=>{
					console.log(res);
					if(res.resultCode==0){
						this.data=res.data;;
						console.log("data",this.data);
						if(this.data.img1 && this.data.img1.slice(0,6)!="https:"){
							this.data.img1=this.url+'/iotwebapi'+this.data.img1;
						}
						if(this.data.img2 && this.data.img2.slice(0,6)!="https:"){
							this.data.img2=this.url+'/iotwebapi'+this.data.img2;
						}
						if(this.data.img3 && this.data.img3.slice(0,6)!="https:"){
							this.data.img3=this.url+'/iotwebapi'+this.data.img3;
						}
						if(this.data.img5 && this.data.img5.slice(0,6)!="https:"){
							this.data.img5=this.url+'/iotwebapi'+this.data.img5;
						}
						if(this.data.img4 && this.data.img4.slice(0,6)!="https:"){
							this.data.img4=this.url+'/iotwebapi'+this.data.img4;
						}
						
						if(this.data.img1){
							this.bannerImg.push(this.data.img1);
						}
						if(this.data.img2){
							this.bannerImg.push(this.data.img2);
						}
						if(this.data.img3){
							this.bannerImg.push(this.data.img3);
						}
						if(this.data.img4){
							this.bannerImg.push(this.data.img4);
						}
						if(this.data.img5){
							this.bannerImg.push(this.data.img5);
						}
						
						console.log("banner",this.bannerImg);
					}
				})
			},
			black(){
				this.$router.push({
					path:'/rent-check',
					query:{
	
					}
				})
			},
			next(){  //  入住
				this.$router.push({
					path:'/rent-rent_in',
					query:{
						roomId:this.data.roomId,
						rent:this.data.m1,
						deposit:this.data.d1,
						areaName:this.data.areaName,  //  小区名称
						building:this.data.building,   // 楼栋
						unit:this.data.unit,   //  单元
						roomNo:this.data.roomNo,   //  房间号
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.header{
		position: relative;
		height:50px;
		line-height:50px;
		div{
			position: absolute;
			right:10px;
			top:0px;
		}
	}
	.el-carousel__item h3 {
	    color: #475669;
	    font-size: 18px;
	    opacity: 0.75;
	    line-height: 300px;
	    margin: 0;
	  }
	  
	  .el-carousel__item:nth-child(2n) {
	    background-color: #99a9bf;
	  }
	  
	  .el-carousel__item:nth-child(2n+1) {
	    background-color: #d3dce6;
	  }
	  .middle{
		  .left{
		  	 width:600px;	  
			 height:360px; 
			 display:inline-block;
			 text-align:center;
			 img{
				height:360px;
				 width:auto;
			 }
		  }
		  .right{
			  display:inline-block;
			  vertical-align:top;
			  padding:0px 10px;
			  box-sizing: border-box;
			  min-width:600px;
			  .line{
				  line-height:60px;
				  color:#aaa;
				  .col{
					  color:#f00;
					  font-size:19px;
					  font-weight:bold;
					  padding-right:15px;
					  
				  }
				 
			  }
			  .list{
				  height:60px;
				  border-bottom:1px solid #eee;
				  div{
					  display:inline-block;
					  vertical-align:top;
					  padding-top:9px;
					  box-sizing: border-box;
					  font-size:13px;
					  color:#aaa;
					  min-width:160px;
					  p{
						  height:25px;
						  line-height:25px;
						  color:#666;
						  font-size:14px;
					  }
				  }
			  }
			  .address{
				  padding:20px 0px;
				  p{
					  line-height:30px;
					  span{
						  display:inline-block;
						  text-align: justify;
						  text-align-last: justify;
						  width:70px;
						  color:#aaa;
						  margin-right:20px;
					  }
				  }
			  }
		  }
	  }
	  .bottom{
		  .title{
			  border-bottom:1px solid #eee;
		  }
		  .list{
			  padding:10px 0px;
			  div{
				  display:inline-block;
				  vertical-align:top;
				  width:120px;
				  text-align:center;
				  color:#aaa;
				  img{
					  height:40px;
					  
				  }
			  }
		  }
	  }
</style>