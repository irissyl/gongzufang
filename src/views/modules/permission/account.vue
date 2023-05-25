<template>
  <div>
    <r-search
      ref="search"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    />
    <r-table
      :isSelection="false"
      :isHandle="false"
      :isPagination="true"
      :isIndex="true"
      :tableData="tableData"
      :tableCols="tableCols"
      :tablePage="pagination"
      :loading="tableLoading"
      @refresh="init()"
    />
    <r-form
		labelWidth="100px"
      :isHandle="true"
      :formRules="formRules"
      :formCols="formCols"
      :formHandle="formHandle"
      :formData="formData"
      ref="elForm"
    />
  </div>
</template>

<script>
export default {
	

  data() {
		var checkPhone = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('手机号不能为空'));
				} else {
					const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
					console.log(reg.test(value));
					if (reg.test(value)) {
						callback();
					} else {
						return callback(new Error('请输入正确的手机号'));
					}
				}
			};
    return {
      tableLoading: false,
      searchData: {
				// nickName:'',
				// phone:''
			},
      searchForm: [
        // { type: "input", placeholder: "手机号码", prop: "phone", width: 200 },
        // { type: "input", placeholder: "用户昵称", prop: "nickName", width: 200 },
      ],
      searchHandle: [
        // { label: "查询", type: "primary", handle: e => this.init() },
        // {label: "重置",type: "primary",handle: e => this.searchFromReset(),},
        {label: "新增账号",type: "primary", handle: e => this.createdAcc()},
      ],
      tableData: [],
      tableCols: [
        { label: "登录账号", prop: "account"},
				{ label: "手机号码",  prop: "phone" },
        { label: "管理员名称", prop: "nickName" },
				{ label: "所属角色", prop: "deptId",formatter:e=>  this.deptLabel(e) },
        { label: "状态", prop: "status",theme:e=>e.status?'primary':'danger', type: "tag",formatter:e=>e.status?'正常':'封禁' },
        {
          label: "操作",
          type: "button",
          width: 260,
          btnList: [
            {
							label: "编辑",
              type: "success",
              size: "mini",
              icon: "el-icon-search",
              handle: (row) => this.elFormDetail(row) ,
            },
            {
							label: "删除",
              type: "danger",
              size: "mini",
              icon: "el-icon-delete",
              handle: (row) => this.TableDel('/sysUser/delete',{userId:row.id}),
            },
          ]
        },
      ],
      pagination: { limit: 10, offset: 1, total: 1 },
      formData: {
				nickName:'',
        phone: "",
        account: "",
        roleids: "",
        pwd: "",
      },
      formCols: [
				{ type: "input", label: "登录账号", width: 350, prop: "account" },
        { type: "input", label: "登录密码", width: 350, prop: "pwd" },
				{ type: "input", label: "管理员名称", width: 350, prop: "nickName" },
				{ type: "input", label: "手机号码", width: 350, prop: "phone" },
        { type: "select", label: "选择角色", width: 350, prop: "roleids",options:[],focus:e=>this.role(e) },
      ],
      formRules: {
				nickName: [
					{required: true,message: '请输入管理员名称',trigger: 'blur'},
				],
				account: [
					{required: true,message: '请输入登录账号',trigger: 'blur'},
				],
				phone: [
					{required: true,validator: checkPhone,trigger: 'blur'},
				],
				pwd: [
					{required: true,message: '请输入登录密码',trigger: 'blur'},
				],
				roleids: [
					{required: true,message: '请选择角色',trigger: 'blur'},
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
		this.role(true)
	},
  methods: {
		init(){
			let params = {...this.pagination,...this.searchData}
			this.$http.post('/sysUser/getUserAll',params).then(({data})=>{
				this.tableData = data
			})
		},
		role(e){
			if(e){
				this.$http.get('/sysRole/getRoleAll').then(({data})=>{
					data.forEach(item=>{
						item.label = item.roleName;
						item.value = item.id;
					})
					this.formCols[this.labIndex(this.formCols,'选择角色')].options = data
				})
			}
		},
		deptLabel(e){
			let arr = this.formCols[this.labIndex(this.formCols,'选择角色')].options
			return  this.valIndex(arr,e.deptId*1)!=-1?arr[this.valIndex(arr,e.deptId*1)].label : '-'
		},
		createdAcc(){
			this.elFormVisible()
			if(this.formCols[1].label != '登录密码'){
				this.formCols.splice(1,0,{ type: "input", label: "登录密码", width: 350, prop: "pwd" })
			}
		},
		elFormDetail(row){
			Object.keys(this.formData).forEach(key=>{
				this.formData[key] = row[key]
			})
			this.formData.id = row.id;
			this.formData.roleids = row.deptId*1
			if(this.formCols[1].label == '登录密码'){
				this.formCols.splice(1,1)
			}
			
			this.elFormVisible()
		},
		elFormSubmit(){
			this.$refs.elForm.$refs.ruleForm.validate((valid) => {
				if (valid) {
					let api = this.formData.id?'/sysUser/update':'/sysUser/add'
					this.$http.post(api,this.formData).then(res=>{
						if(res && res.code==200){
							this.$message({
								type: 'success',
								message: this.formData.id ? "编辑成功!" : "添加成功!",
								duration:1300,
								onClose:res=>{
									this.elFormVisible()
									this.init()
								}
							});
						}
						
					})
			  }
			})
		},
	},
};
</script>

<style scoped lang="scss">
</style>
