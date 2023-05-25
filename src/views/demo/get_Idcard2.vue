<template>
  <div>
    <el-upload
        class="upload-demo"
        action=""
        :on-change="handleChange"
        :show-file-list="false"
        :auto-upload="false">
        <el-button size="small" type="primary" style="margin-bottom:15px;">读取excel文件</el-button>
      </el-upload>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column prop="id" label="Id" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
         <el-table-column prop="number" label="数量" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a @click="handleDelete(scope)">删除</a> |
            <a @click="handelEdit(scope)">修改</a>
          </template>
        </el-table-column>
      </el-table>
</div>
</template>

<script>
export default{
  data() {
      return {
         tableData: [],
		  fileContent: '',
		  file: '',
		  data: ''
		  };
		},

     methods: {
     // 核心部分代码(handleChange 和 importfile)
     handleChange (file) {
       console.log("file",file);
       this.fileContent = file.raw
       const fileName = file.name
       const fileType = fileName.substring(fileName.lastIndexOf('.') + 1)
         if (this.fileContent) {
         
           if (fileType === 'xlsx' || fileType === 'xls') {
         
             this.importfile(this.fileContent)
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
           this.data = [...outdata]
           const arr = []
           this.data.map(v => {
              console.log("v",v);
            
             arr.push(v)
           })
		   console.log("arr",arr);
           // _this.tableData = _this.tableData.concat(arr)
         }
       }
	}
  
}
</script>