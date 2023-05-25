<template>
  <div>
    <r-table
      :isPagination="true"
      :isIndex="true"
      :isHandle="true"
      :tableData="tableData"
      :tableCols="tableCols"
      :tablePage="pagination"
      :loading="tableLoading"
      :tableHandles="tableHandles"
			@refresh="init()"
    />

    <r-form
      :isHandle="true"
      :formRules="formRules"
      :formCols="formCols"
      :formHandle="formHandle"
      :formData="formData"
			labelWidth="100px"
      dialogWidth="550px"
      :inline="false"
      ref="elForm"
    />

  </div>
</template>

<script>
export default {
  data() {
    return {
      tableLoading: false,
      tableData: [],
      tableCols: [
        { label: "角色名称", prop: "roleName",  },
        {
          label: "操作",
          type: "button",
          width: 200,
          btnList: [
            {
              type: "primary",
              size: "mini",
              label: "编辑",
              handle: (row) => this.elFormDetail(row),
            }
          ],
        },
      ],
      tableHandles: [
        {
          label: "添加角色",
          type: "primary",
          handle: e => {this.elFormVisible();this.setCheckedNodes([])} ,
        },
      ],
      pagination: { limit: 10, offset: 1, total: 1 },

      formData: {
        roleName: "",
      },
      formCols: [
        { type: "input", label: "角色名称", width: 350, prop: "roleName" },
				{ type:'tree', label: "菜单权限", prop: "menu", options:[],check:(data, checked, indeterminate)=>this.checkTree(data, checked, indeterminate) },
      ],
      formRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
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
			checkBox:[]
    };
  },
  created() {},
  mounted() {
		this.formCols[this.labIndex(this.formCols,'菜单权限')].options = this.data
    this.init();
		this.treeInit()
  },
  methods: {
		checkTree(data, checked, indeterminate){
			this.checkBox = [...this.$refs.elForm.$refs.tree[0].getCheckedKeys(),...this.$refs.elForm.$refs.tree[0].getHalfCheckedKeys()]
			//console.log(this.$refs.elForm.$refs.tree[0].getCheckedKeys());
			//console.log(this.$refs.elForm.$refs.tree[0].getCheckedNodes())
			//console.log(checkBox)
		},
		setCheckedNodes(arr) {
			if(arr.length>=1){
				this.$refs.elForm.$refs.tree[0].setCheckedKeys(arr)
			}
			//this.$refs.elForm.$refs.tree[0].setCheckedNodes(arr);
			//console.log(this.$refs.elForm.$refs.tree[0].getCheckedNodes())
		},
    init() {
      this.$http.get("/sysRole/getRoleAll").then(({ data }) => {
        this.tableData = data;
      });
			
    },
		treeInit(id){
			this.$http.get("/sysMenu/getListAll",{roleId:id}).then(({ data }) => {
				data.forEach(item=>{
					 item.children.forEach(i=>{
						 delete i.children
					 })
				})
				this.formCols[this.labIndex(this.formCols,'菜单权限')].options = data
				if(id){
					let arr = []
					data.forEach(item=>{
						 item.children.forEach(i=>{
							 delete i.children
							 if(i.checked){
							 	arr.push(i.id*1)
							 }
						 })
					})
					this.setCheckedNodes(arr)
				}
			});
		},
		treeUpload(){
			this.$http.post("/sysRoleMenu/updateMenuByRoleId",{menuids:this.checkBox.toString(),roleid:this.formData.id})	
		},
    elFormDetail(row) {
      Object.keys(this.formData).forEach((key) => {
        this.formData[key] = row[key];
      });
      this.formData.id = row.id;
			this.treeInit(row.id)
      this.elFormVisible('修改本账号权限,页面将会自动刷新');
    },
    elFormSubmit() {
      this.$refs.elForm.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let api = this.formData.id ? "/sysRole/update" : "/sysRole/add";
          this.$http.post(api, this.formData).then((res) => {
            this.$message({
              type: "success",
              message: "添加成功!",
              duration: 1300,
              onClose: (res) => {
								if(this.formData.id == this.$cookie.get('userId')){
									location.reload()
									return
								}
                this.elFormVisible();
                this.init();
              },
            });
          });
					this.treeUpload()
        }
      });
    },
  },
};
</script>

<style scoped>
</style>
