<template>
  <div>
		<r-table
			:isHandle="true"
			:isBorder="true"
			:tableData="tableData"
			:tableCols="tableCols"
			:tableHandles="tableHandles"
			rowKey="id"
			:treeProps="{children: 'children', hasChildren: 'data'}"/>
			
			<r-form
			  :isHandle="true"
			  :formRules="formRules"
			  :formCols="formCols"
			  :formHandle="formHandle"
			  :formData="formData"
				labelWidth="100px"
			  dialogWidth="550px"
				:destroy="false"
			  :inline="false"
			  ref="elForm"
				:defaultProps="{children: 'children',label: 'label'}"
				/>
  </div>
</template>

<script>
export default {
  data() {
    return {
			tableData: [],
			tableCols: [
				{ label: "菜单名称", prop: "label",align:'left',width: 250 },
				{
					type:'tag', 
					label: "类型", 
					prop: "type",
					width:100,
					theme:e=>e.type=="M"?'':e.type=="C"?'success':'warning',
					formatter:e=>e.type=="M"?'目录':e.type=="C"?'菜单':'按钮',
				},
				// { label: "上级目录", prop: "text",width:100},
				{ label: "图标", prop: "icon",width:100},
				{ label: "排序", prop: "order",width:100},
				{ label: "菜单URL", prop: "path",width:200},
				// { label: "授权标识", prop: "perms"},
				{label: "操作",type: "button",width: 200,btnList: [
					{type: "primary",size: "mini",icon: "el-icon-edit",label: "编辑",handle: row => this.elFormDetail(row)},
					{type: "danger",size: "mini",icon: "el-icon-delete",label: "删除",handle: row => this.TableDel('/system/menu/'+row.id)},
				]}
			],
			tableHandles: [
				{
					label: "添加菜单",
					type: "primary",
					icon:'el-icon-plus',
					handle: (that) => this.elFormVisible() ,
				},
			],
			formData: {
			  menuName: "",
				menuId:"",    //  当前菜单id 
				parentId:0,   //  	上级菜单ID
				menuLable:"目录",
				orderNum:0,
				menuType:"M",
				status:0,     //  0正常 1停用
				icon:'',
				path:''   //   路由地址
			},
			formCols: [
				{ 
					type: "radio", 
					label: "类型", 
					width: 350, 
					prop: "menuType",
					radios:[{label:'目录',value:"M"},{label:'菜单',value:"C"},{label:'按钮',value:"F"}] ,
					change:e=>this.menuList(e)
				},
			  { type: "input", label:"菜单名称", width: 350, prop: "menuName" },
				{ type:'popover', label: "上级目录", prop: "menuLable",width: 350,options:[],handleNodeClick:e=>this.nodeClick(e) },
				{ type:'number', label: "排序", prop: "orderNum",width: 200,  },
				{ type: "input", label: "菜单URL", width: 350, prop: "path" },
				{ type: "input", label: "图标", width: 350, prop: "icon" },
			],
			formRules: {
			  // menuName: [
			  //   { required: true, message: "请输入角色名称", trigger: "blur" },
			  // ],
				menuLable: [
			    { required: true, message: "请选择上级目录", trigger: "change" },
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
			    handle: e => this.elFormVisible(),
			  },
			],
			
    };
  },
  created() {},
  mounted() {
		this.init()
	},
  methods: {
		init(){
			this.$http.get("/system/menu/treeselect").then(({ data }) => {
				console.log(data);
			  this.tableData = data;
				this.formCols[this.labIndex(this.formCols,'上级目录')].options = data;
			});
		},
		nodeClick(data){    //  下拉目录
			console.log(data);
			this.formData.menuLable = data.label;
			this.formData.parentId = data.id;
		},
		elFormDetail(row) {
		  Object.keys(this.formData).forEach((key) => {
		    this.formData[key] = row[key];
		  });
		  this.formData.menuId = row.id;
			this.formData.menuName = row.label;
			this.formData.menuType = row.type;
			this.formData.status = 0;
			this.formData.orderNum = row.order;
			
			this.menuList(row.type)
			this.treeMenu(row)
			this.formData.menuLable="目录";
			this.formData.parentId=0;
			console.log(this.formData)
		  this.elFormVisible("编辑");
		},
		elFormSubmit() {
		  this.$refs.elForm.$refs.ruleForm.validate((valid) => {
		    if (valid) {
					let url="";
					if(this.formData.menuId){   // 编辑
						url=this.$http.put;
					}else{
						url=this.$http.post;
					}
		      url("/system/menu",this.formData).then(res=>{
						if(res && res.code==200){
							this.$message({
								type: 'success',
								message: this.formData.menuId ? "编辑成功!" : "添加成功!",
								duration:1300,
								onClose:res=>{
									this.elFormVisible()
									this.init()
									this.menuList("M")
								}
							});
						}
		      	
		      })
		    }
		  });
		},
		treeMenu(row){
			console.log(row);
			let menuLable = ''
			if(row.menuType!="M"){
				let arr =  this.formCols[this.labIndex(this.formCols,'上级目录')].options
				let idx = arr.map(item => item.menuId).indexOf(row.menuType)
				if(idx==-1) return
				menuLable = arr[idx].menuName
			}else{
				menuLable = '目录'
			}
			this.formData.menuLable = menuLable
		},
		menuList(e){
			let arr = this.formCols.splice(0,3)
			switch(true){
				case e=="M":
				this.formCols = [
					...arr,
					{ type:'number', label: "排序", prop: "orderNum",width: 200,  },
					{ type: "input", label: "菜单URL", width: 350, prop: "path" },
					{ type: "input", label: "图标", width: 350, prop: "icon" },
				]
					break;
				case e=="C":
				this.formCols = [
					...arr,
				  { type:'number', label: "排序", prop: "orderNum",width: 200,  },
				  { type: "input", label: "菜单URL", width: 350, prop: "path" },
				  { type: "input", label: "授权标识", width: 350, prop: "preams" },
				  { type: "input", label: "图标", width: 350, prop: "icon" },
				]
					break;
				case e=="F":
				this.formCols = [
					...arr,
				  { type: "input", label: "授权标识", width: 350, prop: "preams" },
				]
					break;
			}
		}
	},
};
</script>

<style scoped lang="scss">
</style>
