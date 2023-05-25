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
					iottag:this.$route.query.iotTag,
					start:"",
					end:"",
				},
				searchForm: [
				   {label: "设备编号",type: "input",  prop: "iottag", width: 160},
				   {label: "开始时间", type: "dateT",  prop: "start", width: 220},
				   {label: "结束时间", type: "dateT",  prop: "end", width: 220},
				],
				searchHandle:[
				  {type: "info",icon: "el-icon-refresh", handle: e => this.searchFromReset()},
				  {label: "查询",type: "primary",icon: "el-icon-search",handle: e =>this.seach()} 
				],
				tableData: [],
				tableCols: [
				  { label: "设备编号", prop: "iotTag"},
				  { label: "开门类型", prop: "logType"},
				  { label: "开门时间", prop: "logTime"},
				]
			}
		},
		created() {
			let end=new Date().getTime();
			let str= new Date().getTime()-3600*24*1000*7;
			this.searchData.start=this.auto_time(str);
			this.searchData.end=this.auto_time(end);
			console.log("end",this.auto_time(end));
			
			console.log("str",this.auto_time(str));
			
			this.init();
		},
		methods:{
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
			seach(){
				this.tableData=[];
				this.pagination.pageNumber=1;
				if(this.searchData.start && this.searchData.end){
					let star_time=new Date(this.searchData.start).getTime();
					let end_time=new Date(this.searchData.end).getTime();
					if(end_time<star_time){
						this.$message.error("结束时间要大于开始时间");
						return false;
					}
					this.searchData.start=this.auto_time(star_time);
					this.searchData.end=this.auto_time(end_time);
				}else{
					this.searchData.start="";
					this.searchData.end="";
				}
				this.init();
			},
			init(){
				this.load=true;
				
				let params = {...this.pagination,...this.searchData};
				this.$http.post(this.url+'/iotwebapi/api/netlock/getNetlockLogListPage',params).then((res)=>{
					console.log(res);
					this.load=false;
					if(res.resultCode==0){
						this.pagination.total=res.data.dataCount;
						this.tableData=res.data.datas;
					}else{
						this.$message.error(res.msg);
					}
				})
			}
		}
	}
</script>

<style>
</style>