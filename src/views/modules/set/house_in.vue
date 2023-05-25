<template>
  <div>
		<r-search
			:searchData="searchData" 
			:searchForm="searchForm" 
		/>
		
    <div class="header">
     <!-- <el-upload
	    accept=".xlsx"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-success="handleChange"
        :file-list="fileList"
        class="el-upload"
      > -->
	  <el-upload
	      class="el-upload"
	      action=""
	      :on-change="handleChange2"
	      :auto-upload="false">
	  
	  <div slot="tip" class="el-upload-tip">
	    只能上传xlsx文件，且不超过5MB
	  </div>
        <el-button size="small" type="primary" class="el-btn"
          >导入excel表</el-button
        >
        
      </el-upload>
	  <el-button class="bttn del" type="danger" @click="del">删除数据</el-button>
	  <el-button class="bttn save" type="primary" @click="buitn">保存数据</el-button>
	  
	 
    </div>
    <!-- <el-table v-if="tableHead.length" :data="tableData[0]" style="width: 100%">
      <el-table-column
        v-for="(data, key) in tableHead"
        :prop="data"
        :label="data"
        :key="key"
        width="180"
      >
      </el-table-column>
    </el-table> -->
     
	<r-table
	  :isIndex="true"
	  :tableData="tableDatas"
	  :tableCols="tableCols"
	   v-loading="load"
	   @refresh="init()"
	/>
	
	
  </div>
</template>
<script>

// import "element-ui/lib/theme-chalk/index.css";
// import { read, utils } from "xlsx";


export default {
  data() {
    return {
		provinces:"",
		citys:"",
		countys:"",
		streets:"",
		searchData: {
			province:"",
			city:"",
			county:"",
			street:"",
		},
		searchForm: [
		  { type: "select",label: "省份",  prop: "province", width: 160,options:[],change: e => this.city(e)},
		  { type: "select",label: "城市",  prop: "city", width: 160,options:[],change: e => this.county(e)},
		  { type: "select",label: "县市",  prop: "county", width: 160,options:[],change: e => this.street(e)},
		  { type: "select",label: "街道",  prop: "street",options:[], width: 160,change: e => this.areaName(e)},
		],
	  url:process.env.VUE_APP_URL,
      fileList: [], //上传文件列表
      tableHead: [], //表头
      tableData: [], // 表数据
	  tables_data:[],//  显示表数据
	  data:"",
	  load:false,
	  tableDatas: [],
	  tableCols: [
	    { label: "小区名称", prop: "areaName"},
	    { label: "楼栋", prop: "building"},
	    { label: "单元", prop: "unit"},
	    { label: "楼层", prop: "floor"},
	    { label: "房间号", prop: "roomNo"},
	    { label: "房屋类别", prop: "roomType"},
	    { label: "面积", prop: "size"},
	    { label: "房东姓名", prop: "landlord"},
	    { label: "房东电话", prop: "landlordPhone"},
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
	    { label: "门锁编码", prop: "lockTag"}, 
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
	    { label: "椅", prop: "chair"}
	  ],
    };
  },
  created(){ 
	 this.province(); 
  },
  methods: {
	del(){
		this.$confirm("确定要删除数据？", '提示', {
			 confirmButtonText: '确定',
			 cancelButtonText: '取消',
			 type: 'warning'
		}).then(() => {
			this.tableDatas=[];
			this.$message({
				message: '删除成功',
				type: 'success',
				duration:3000,
				offset:400,
			});
		  }).catch(() => {
			 this.$message({
				 type: 'info',
				 message: '已取消'
			 });          
		});		
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
		
		for(let i in this.searchForm[0].options){
			if(e==this.searchForm[0].options[i].value){
				this.provinces=this.searchForm[0].options[i].label;
				console.log(this.provinces);
			}
		}
		
		
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
		
		for(let i in this.searchForm[1].options){
			if(e==this.searchForm[1].options[i].value){
				this.citys=this.searchForm[1].options[i].label;
				console.log(this.citys);
			}
		}
		
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
		
		for(let i in this.searchForm[2].options){
			if(e==this.searchForm[2].options[i].value){
				this.countys=this.searchForm[2].options[i].label;
				console.log(this.countys);
			}
		}
		
		this.$http.post(this.url+'/iotwebapi/api/dic/listStreet',{code:e,pageSize: 1000, pageNumber: 1}).then((res)=>{
			console.log(res);
			if(res.resultCode==0){
				for(let i in res.data.datas){
					this.searchForm[3].options.push({label:res.data.datas[i].name,value:res.data.datas[i].code});
				}
			}
		})
	},
	areaName(e){
		for(let i in this.searchForm[3].options){
			if(e==this.searchForm[3].options[i].value){
				this.streets=this.searchForm[3].options[i].label;
				console.log(this.streets);
			}
		}
	},
    handleChange2(file){
		const fileName = file.name;
		const fileType = fileName.substring(fileName.lastIndexOf('.') + 1)
		if (file.raw) {	
		  if (fileType === 'xlsx' || fileType === 'xls') {	
		    this.importfile(file.raw)
		  } else {	
		    this.$message({	
		      type: 'warning',
		      message: '附件格式错误，请重新上传！'
		    })
		  }
		} else {	
		  this.$message({		
		    type: 'warning',
		    message: '请上传附件！'
		  })
		}
	},
	importfile (obj) {
	   console.log("obj",obj);
	  const reader = new FileReader()
	  const _this = this
	  reader.readAsArrayBuffer(obj)
	  reader.onload = function () {
	   
	    const buffer = reader.result
	    const bytes = new Uint8Array(buffer)
	    const length = bytes.byteLength
	    let binary = ''
	    for (let i = 0; i < length; i++) {
	   
	      binary += String.fromCharCode(bytes[i])
	    }
	     const XLSX = require('xlsx')
	     const wb = XLSX.read(binary, {
	   
	       type: 'binary'
	     })
	     const outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
	     _this.data = [...outdata]
	     const one_data = []
	     _this.data.map(v => {
	       
	        one_data.push(v)
	     })
		 _this.tableDatas=[];
		 console.log("one_data",one_data);
		 for(let i=2;i<one_data.length;i++){
		 	one_data[i].__EMPTY_3=one_data[i].__EMPTY_3.toString();
		 	if(one_data[i].__EMPTY_3.length==3){
		 		one_data[i].__EMPTY_3="0"+one_data[i].__EMPTY_3;
		 	}
		 	_this.tableDatas.push({
		 		roomId:0,
		 		areaName:one_data[i][Object.keys(one_data[i])[0]],
		 		building:one_data[i].__EMPTY,
		 		unit:one_data[i].__EMPTY_1,
		 		floor:one_data[i].__EMPTY_2,
		 		roomNo:one_data[i].__EMPTY_3,
		 		roomType:one_data[i].__EMPTY_4,
		 		size:one_data[i].__EMPTY_5,
		 		landlord:one_data[i].__EMPTY_7,
		 		landlordPhone:one_data[i].__EMPTY_8,
		 		roomAttrib:one_data[i].__EMPTY_9,
		 		rentType:one_data[i].__EMPTY_10,
		 		m1:one_data[i].__EMPTY_11,
		 		d1:one_data[i].__EMPTY_12,
		 		m3:one_data[i].__EMPTY_13,
		 		d3:one_data[i].__EMPTY_14,
		 		m6:one_data[i].__EMPTY_15,
		 		d6:one_data[i].__EMPTY_16,
		 		m12:one_data[i].__EMPTY_17,
		 		d12:one_data[i].__EMPTY_18,
		 		lockTag:one_data[i].__EMPTY_19,
		 		waterTag:one_data[i].__EMPTY_20,
		 		meterTag:one_data[i].__EMPTY_21,
		 		icebox:one_data[i].__EMPTY_22,
		 		airConditioner:one_data[i].__EMPTY_23,
		 		tv:one_data[i].__EMPTY_24,
		 		waterHeater:one_data[i].__EMPTY_25,
		 		gasStove:one_data[i].__EMPTY_26,
		 		toilet:one_data[i].__EMPTY_27,
		 		rangeHood:one_data[i].__EMPTY_28,
		 		bed:one_data[i].__EMPTY_29,
		 		cabinet:one_data[i].__EMPTY_30,
		 		desk:one_data[i].__EMPTY_31,
		 		chair:one_data[i].__EMPTY_32,
		 	})
		 }
		 console.log("_this.tableDatas",_this.tableDatas);
		 _this.$confirm('是否保存数据?', '提示', {
		   confirmButtonText: '确定',
		   cancelButtonText: '取消',
		   type: 'warning'
		 }).then(() => {
		   _this.buitn();
		 }).catch(() => {
		   _this.$message({
		 	type: 'info',
		 	message: '已取消'
		   });          
		 });
		
	   }
	 },
	handleChange(res, file, fileList) {
      // 将文件放入
      for (let i = 0; i < fileList.length; i++) {
        if (file.name != fileList[i].name) {
          this.fileList.push({
            name: file.name,
            url: "",
            uid: file.uid
          });
        }
      }
      // this.fileList = fileList.slice(-3);
      const files = { 0: file };
      this.readExcel(files);
    },
    readExcel(file) {
      const fileReader = new FileReader();

      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = read(data, { type: "binary" });
          const params = [];
          // 取对应表生成json表格内容
          workbook.SheetNames.forEach(item => {
            params.push({
              name: item,
              dataList: utils.sheet_to_json(workbook.Sheets[item])
            });
            this.tableData.push(utils.sheet_to_json(workbook.Sheets[item]));
			console.log("tableData",this.tableData);
          });
          // 该算法仅针对表头无合并的情况
		  this.tableDatas=[];
          if (this.tableData.length > 0) {
            // 获取excel中第一个表格数据tableData[0][0]，并且将表头提取出来
            for (const key in this.tableData[0][0]) {
              this.tableHead.push(key);
            }
			console.log("tableHead",this.tableHead);
			console.log("tableHeaddfsafs",this.tableHead[0]);
			    let one_data=this.tableData[0];
				
				for(let i=2;i<one_data.length;i++){
					one_data[i].__EMPTY_3=one_data[i].__EMPTY_3.toString();
					if(one_data[i].__EMPTY_3.length==3){
						one_data[i].__EMPTY_3="0"+one_data[i].__EMPTY_3;
					}
					this.tableDatas.push({
						roomId:0,
						areaName:one_data[i][Object.keys(one_data[i])[0]],
						building:one_data[i].__EMPTY,
						unit:one_data[i].__EMPTY_1,
						floor:one_data[i].__EMPTY_2,
						roomNo:one_data[i].__EMPTY_3,
						roomType:one_data[i].__EMPTY_4,
						size:one_data[i].__EMPTY_5,
						landlord:one_data[i].__EMPTY_7,
						landlordPhone:one_data[i].__EMPTY_8,
						roomAttrib:one_data[i].__EMPTY_9,
						rentType:one_data[i].__EMPTY_10,
						m1:one_data[i].__EMPTY_11,
						d1:one_data[i].__EMPTY_12,
						m3:one_data[i].__EMPTY_13,
						d3:one_data[i].__EMPTY_14,
						m6:one_data[i].__EMPTY_15,
						d6:one_data[i].__EMPTY_16,
						m12:one_data[i].__EMPTY_17,
						d12:one_data[i].__EMPTY_18,
						lockTag:one_data[i].__EMPTY_19,
						waterTag:one_data[i].__EMPTY_20,
						meterTag:one_data[i].__EMPTY_21,
						icebox:one_data[i].__EMPTY_22,
						airConditioner:one_data[i].__EMPTY_23,
						tv:one_data[i].__EMPTY_24,
						waterHeater:one_data[i].__EMPTY_25,
						gasStove:one_data[i].__EMPTY_26,
						toilet:one_data[i].__EMPTY_27,
						rangeHood:one_data[i].__EMPTY_28,
						bed:one_data[i].__EMPTY_29,
						cabinet:one_data[i].__EMPTY_30,
						desk:one_data[i].__EMPTY_31,
						chair:one_data[i].__EMPTY_32,
					})
				}
				console.log('tableDatas',one_data)
			    
			    this.$confirm('是否保存数据?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  this.buitn();
				}).catch(() => {
				  this.$message({
					type: 'info',
					message: '已取消'
				  });          
				});
          }
          return params;
          // 重写数据
        } catch (e) {
          console.log("error:" + e);
          return false;
        }
      };
      fileReader.readAsBinaryString(file[0].raw);
    },
	buitn(){  //  提交保存
	    let _self=this;	
		if(this.tableDatas.length>0){
			if(this.searchData.street==""){
				this.$message.error("请选择省、市、区、街道");
				return false;
			}
			
			let addres=this.provinces+this.citys+this.countys+this.streets+this.tableDatas[0].areaName;
			
			
			let geocoder = new qq.maps.Geocoder();
			 geocoder.getLocation(addres); 
			 geocoder.setComplete(function(result) {
				 console.log(result);
				 console.log(result.detail.location);
				 if(result){
					for(let i in _self.tableDatas){  
						_self.tableDatas[i].coord= result.detail.location.lat+','+result.detail.location.lng;
						_self.tableDatas[i].size=parseFloat(_self.tableDatas[i].size);
						_self.tableDatas[i].lockTag=_self.tableDatas[i].lockTag.toString();
						_self.tableDatas[i].waterTag=_self.tableDatas[i].waterTag.toString();
						_self.tableDatas[i].meterTag=_self.tableDatas[i].meterTag.toString();
						_self.tableDatas[i].icebox=_self.tableDatas[i].icebox.toString();
						_self.tableDatas[i].airConditioner=_self.tableDatas[i].airConditioner.toString();
						_self.tableDatas[i].tv=_self.tableDatas[i].tv.toString();
						_self.tableDatas[i].waterHeater=_self.tableDatas[i].waterHeater.toString();
						_self.tableDatas[i].gasStove=_self.tableDatas[i].gasStove.toString();
						_self.tableDatas[i].toilet=_self.tableDatas[i].toilet.toString();
						_self.tableDatas[i].rangeHood=_self.tableDatas[i].rangeHood.toString();
						_self.tableDatas[i].bed=_self.tableDatas[i].bed.toString();
						_self.tableDatas[i].cabinet=_self.tableDatas[i].cabinet.toString();
						_self.tableDatas[i].desk=_self.tableDatas[i].desk.toString();
						_self.tableDatas[i].chair=_self.tableDatas[i].chair.toString();
						_self.tableDatas[i].streetCode=_self.searchData.street;
					}
					console.log("params",_self.tableDatas);
					_self.$http.post(_self.url+'/iotwebapi/api/publicrental/room/importRoom',_self.tableDatas).then((res)=>{
						console.log(res);
						if(res.resultCode==0){
							_self.$message({
							  message: '数据保存成功',
							  type: 'success',
							  duration:3000,
							  offset:400,
							  onClose:res=>{
								_self.$router.push({
									path:'/set-house_set',
									query:{
										
									}
								})
							  }
							});
						}else{
							_self.$message.error(res.message);
						}
					})
			   }
			});
			geocoder.setError(function() {
				 alert("出错了，请输入正确的地址！！！");
			 });
		 
		}else{
			this.$message.error("请先导入excel表");
		}
	}
  }
};
</script>
<style lang="scss" scoped>
.upload-demo {
  width: 100%;
}
.flex-display {
  margin: 50px 30px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  .left-box {
    margin: 20 30;
    height: 36px;
    line-height: 36px;
  }
}
.el-upload {
  margin-left: 40px;
  .el-btn {
    font-size: 16px;
  }
  .el-upload-tip {
    display: inline;
    font-size: 12px;
  }
}
.file-ipt {
  width: 200px;
  height: 36px;
  line-height: 36px;
  button {
    background-color: #409eff;
  }
}
input #file-upload-button {
  background-color: #409eff;
}
.header{
	position:relative;
	.bttn{
		position:absolute;
		
	}
	.del{
		left:370px;
	}
	.save{
		left:470px;
	}
}
</style>
