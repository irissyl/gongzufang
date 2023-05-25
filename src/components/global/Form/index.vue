<!-- 搜索表单 -->
<template>
  <div class="ces-form">
    <el-dialog
      :title="dialogFormTitle"
      :visible.sync="dialogFormVisible"
      @close="reset()"
      :close-on-click-modal="false"
      :width="dialogWidth"
			v-if="dialogFormVisible"
    >
      <el-form
        :size="size"
        :inline="inline"
        :label-width="labelWidth"
        :rules="formRules"
        :model="formData"
        ref="ruleForm"
      >
        <el-form-item
          v-for="item in formCols"
          :label="item.label"
          :key="item.label"
          :prop="item.prop"
					v-if="item.isShow != undefined ? item.isShow(formData[item.prop]) : true"
        >
          <!-- 输入框 -->
          <el-input
            v-if="item.type==='input'"
            v-model="formData[item.prop]"
            :size="size || item.size"
            :style="{width:item.width+'px'}"
            @change="item.change && item.change(formData[item.prop])"
            :placeholder="item.placeholder || '请输入'"
            :disabled="item.isDisabled && item.isDisabled(formData)"
          ></el-input>
          <!-- 文本域 -->
          <el-input
            v-if="item.type==='textarea'"
            type="textarea"
            :rows="4"
            :size="size || item.size"
            :style="{width:item.width+'px'}"
            :disabled="item.isDisabled && item.isDisabled(formData)"
            @change="item.change && item.change(formData[item.prop])"
            v-model="formData[item.prop]"
          ></el-input>
          <!-- 下拉框 -->
          <el-select
            v-if="item.type==='select'"
            v-model="formData[item.prop]"
            filterable
            :multiple="item.multiple"
            :size="size || item.size"
            :style="{width:item.width+'px'}"
            @change="item.change && item.change(formData[item.prop])"
            @visible-change="item.focus && item.focus($event,formData[item.prop])"
            :disabled="item.isDisabled && item.isDisabled(formData[item.prop])"
          >
            <el-option
              v-for="op in item.options"
              :label="op.label"
              :value="op.value"
              :key="op.value"
            ></el-option>
          </el-select>
          <!-- 级联省市区 -->
          <el-cascader
            v-if="item.type==='cascader'"
            :style="{width:item.width+'px'}"
            :placeholder="item.placeholder || '请选择'"
            :options="cascaderOptions"
            v-model="formData[item.prop]"
            @focus="item.focus && item.focus(formData[item.prop])"
            filterable
            clearable
            :show-all-levels="item.showAll && item.showAll(formData[item.prop])"
            :props="{ expandTrigger: 'hover',checkStrictly: item.checkStrictly && item.checkStrictly(formData[item.prop]) }"
            @change="item.change && item.change(formData[item.prop])"
          ></el-cascader>
          <!-- 单选 -->
          <el-radio-group
            v-if="item.type==='radio'"
            v-model="formData[item.prop]"
            :style="{width:item.width+'px'}"
            @change="item.change && item.change(formData[item.prop])"
            :size="size || item.size"
            :disabled="item.isDisabled && item.isDisabled(formData[item.prop])"
          >
            <el-radio v-for="ra in item.radios" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio>
          </el-radio-group>
          <!-- 复选框 -->
		  
		  <!-- <el-checkbox v-if="item.type==='checkbox'" :indeterminate="indeterminate" v-model="formData[item.prop]" @change="item.change && item.change(formData[item.prop])">全选</el-checkbox> -->
           
		       <el-checkbox-group
            v-if="item.type==='checkbox'"
            v-model="formData[item.prop]"
            :style="{width:item.width+'px'}"
            @change="item.change && item.change(formData[item.prop])"
            :size="size || item.size"
            :disabled="item.isDisabled && item.isDisabled(formData[item.prop])"
          >
		    
            <el-checkbox v-for="ch in item.checkboxs" :label="ch.value" :key="ch.value">{{ch.label}}</el-checkbox>
          </el-checkbox-group>
          <!-- 日期 -->
          <el-date-picker
            v-if="item.type==='date'"
            v-model="formData[item.prop]"
            :style="{width:item.width+'px'}"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
						:picker-options="expireTimeOption"
            @change="item.change && item.change(formData[item.prop])"
            :size="size || item.size"
            :disabled="item.isDisabled && item.isDisabled(formData[item.prop])"
          ></el-date-picker>
          <!-- 开始-结束日期 -->
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-if="item.type==='daterange'"
            type="daterange"
            v-model="formData[item.prop]"
            :style="{width:item.width+'px'}"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
						:picker-options="expireTimeOption"
            @change="item.change && item.change(formData[item.prop])"
            :size="size || item.size"
            :disabled="item.isDisabled && item.isDisabled(formData[item.prop])"
          ></el-date-picker>
          <!-- 时间 -->
          <el-time-select
            v-if="item.type==='time'"
            v-model="formData[item.prop]"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            :style="{width:item.width+'px'}"
            @change="item.change && item.change(formData[item.prop])"
            :size="size || item.size"
            :disabled="item.isDisabled && item.isDisabled(formData[item.prop])"
          ></el-time-select>
          <!-- 开始-结束时间 -->
          <el-time-picker
            v-if="item.type==='timePicker'"
            v-model="formData[item.prop]"
            is-range
            format="HH:mm"
            value-format="HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            :style="{width:item.width+'px'}"
            @change="item.change && item.change(formData[item.prop])"
            :size="size || item.size"
            :disabled="item.isDisabled && item.isDisabled(formData[item.prop])"
            :picker-options="{
						selectableRange:['00:00:00 - 23:59:59']
					}"
          ></el-time-picker>
          <!-- 日期时间 -->
          <el-date-picker
            v-if="item.type==='dateTime'"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :style="{width:item.width+'px'}"
            v-model="formData[item.prop]"
            @change="item.change && item.change(formData[item.prop])"
            :size="size || item.size"
            :disabled="item.isDisabled && item.isDisabled(formData[item.prop])"
          ></el-date-picker>
					<!-- 计数器 -->
					<el-input-number 
					v-if="item.type==='number'" 
					v-model="formData[item.prop]" 
					controls-position="right" 
					:style="{width:item.width+'px'}"
					@change="item.change && item.change(formData[item.prop])" 
					
					/>
          <!-- 滑块 -->
          <!-- <el-slider v-if="item.type==='Slider'" v-model="formData[item.prop]"></el-slider> -->
          <!-- 开关 -->
          <el-switch
            v-if="item.type==='switch'"
            v-model="formData[item.prop]"
            :size="size || item.size"
						:active-value="item.values&&item.values[0]"
						:inactive-value="item.values&&item.values[1]"
            @change="item.change && item.change(formData[item.prop])"
            :style="{width:item.width+'px'}"
            :disabled="item.isDisabled && item.isDisabled(formData[item.prop])"
          ></el-switch>
					<!-- 树形菜单弹出框 -->
					<el-popover
							v-if="item.type==='popover'"
					    placement="bottom-start"
					    width="200"
							ref="deptListPopover"
					    trigger="click">
							<el-tree
								:data="item.options" 
								accordion
								node-key="id" 
								ref="popoverTree" 
								:props="defaultProps"
								:highlight-current="true"
								:expand-on-click-node="false"
								@node-click="item.handleNodeClick"/>
					    <el-input
								slot="reference"
					      v-model="formData[item.prop]"
								:readonly="true"
					      :style="{width:item.width+'px'}"
					      :placeholder="item.placeholder || '请选择'"
					    ></el-input>
					  </el-popover>
					<!-- 树形控件 -->
					<el-tree 
						v-if="item.type==='tree'" 
						:data="item.options" 
						show-checkbox 
						node-key="id" 
						ref="tree" 
						:props="defaultProps" 
						@check-change="item.check"/>
          <!-- 图片上传 -->
          <section v-if="item.type==='upload'" :style="{width:item.width+'px'}">
            <el-upload
              v-loading="loading"
              class="avatar-uploader"
              :action="upload_url+'/common/upload'"
              :show-file-list="false"
              :on-success="item.success"
              :on-error="handleAvatarError"
              :on-progress="handleAvatarProgress"
              :before-upload="beforeAvatarUpload"
          
              name="file"
            >
              <img v-if="formData[item.prop]" :src="formData[item.prop]|formatImg" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </section>
					
          <!-- 多图片上传 -->
          <section v-if="item.type==='uploadList'" :style="{width:item.width+'px'}">
            <el-upload
              v-loading="loading"
              action="#"
              list-type="picture-card"
			  :file-list="fileList"
              :multiple="true"
              :limit="5"
              :on-success="item.success"
			  :on-change="item.change"
              :on-error="handleAvatarError"
              :on-progress="handleAvatarProgress"
              :before-upload="beforeAvatarUpload"
              :on-remove="item.handleRemove"
              :on-exceed="handleExceed"
			  :on-preview="handlePictureCardPreview"
               name="file"
			   :auto-upload="false"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" append-to-body title="预览">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </section>
		 
		
					<!-- 地图 -->
          <div v-if="item.type==='map'" id="container" :style="{width:(item.width||'900px'),height:(item.height||'300px')}"></div>
          <MapSearch v-if="item.type==='mapSearch'"  @getLocation="item.address":style="{width:(item.width||'900px'),height:(item.height||'500px'),border: 'solid 1px #efefef'}"></MapSearch>
          <!-- 默认 -->
          <span
            v-if="!item.type"
            :style="{width:item.width+'px','display': 'inline-block'}"
            :size="size"
            :class="item.itemClass && item.itemClass(formData[item.prop])"
          >{{(item.formatter && item.formatter(formData[item.prop])) || formData[item.prop]}}</span>
					
          <!-- 图片显示 -->
          <el-image
            v-if="item.type==='img'"
            :src="formData[item.prop]|formatImg"
            :style="{width:item.width+'px',height:item.width+'px'}"
          ></el-image>
          <!-- 富文本  -->
          <r-tinymce
            v-if="item.type==='tinymce'"
            v-model="formData[item.prop]"
            :height="300"
            :width="600"
          ></r-tinymce>
        </el-form-item>
				<slot></slot>
      </el-form>
      <el-form
        inline
        v-if="isHandle"
        :style="btnStyle || 'justify-content: flex-end;display: flex;margin-top:20px;'"
      >
        <el-form-item v-for="item in formHandle" :key="item.label" style="margin-bottom: 0;">
          <el-button
            :type="item.type"
            :size="item.size || size"
            :icon="item.icon"
						:disabled="item.disabled"
            @click="item.handle"
          >{{item.label}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import area from "@/utils/area2";
import MapSearch from "../../local";
import * as plugin from "@/utils/Tmap";
export default {
  props: {
    isHandle: {
      type: Boolean,
      default: true,
    },
    labelWidth: {
      type: String,
      default: "100px",
    },
    dialogWidth: {
      type: String,
      default: "1000px",
    },
    inline: {
      type: Boolean,
      default: true,
    },
    // 搜索框型号：mini,medium,small
    size: {
      type: String,
      default: "small",
    },
    formCols: {
      type: Array,
      default: () => [],
    },
    formHandle: {
      type: Array,
      default: () => [],
    },
    formData: {
      type: Object,
      default: () => {},
    },
    formRules: {
      type: Object,
      default: () => {},
    },
    btnStyle: {
      type: String,
      default: "",
    },
	auto_upload:{
		type: Boolean,
		default: true,
	},
    fileList: {
      type: Array,
      default: () =>[]
    },
		defaultProps: {
		  type: Object,
		  default: () => ({children: "sysMenuList",label: "interfaceName"}),
		},
		destroy: {
      type: Boolean,
      default: true,
    },
  },
  name: "Form",
  data() {
    return {
	  indeterminate:false,
      dialogFormVisible: false,
      dialogFormTitle: "新增",
      loading: false,
      imageUrl: "",
      upload_url: process.env.NODE_ENV !== 'production'?'/api':process.env.VUE_APP_URL,
      imgurl: process.env.VUE_APP_IMG,
      cascaderOptions: area,
      map: null,
			expireTimeOption:{
				disabledDate(date) {
					return date.getTime() < Date.now() - 8.64e7;
				}
			},
			dialogVisible: false,
			dialogImageUrl:[],
			// fileList: []
	 }
    
  },
	components:{MapSearch},
  created() {
	 
  },
  mounted() {
	
  },
  methods: {
    async plugin(point={lat:'',lng:''}) {
      var qq = await plugin.Tmap();
			if(point.lat==''|| point.lat==0){
				point = await this.getLocation()
			}
      this.map = await plugin.center(point.lat, point.lng);
      qq.maps.event.addListener(this.map.marker, "dragend", (e) => {
        this.map.map.setCenter(e.latLng);
        this.$emit("position", {
          lat: e.latLng.lat,
          lng: e.latLng.lng,
        });
      });
    },
    getLocation() {//腾讯api
      return new Promise((resolve, reject) => {
        this.$jsonp("https://apis.map.qq.com/ws/location/v1/ip",  {
             key: "N6RBZ-AJN35-AACI2-Q2ICF-HYV6O-JRBBZ",
             output: "jsonp"
         }).then((res) => {
            resolve({
              lat: res.result.location.lat,
              lng: res.result.location.lng,
            });
          });
      });
    },
    handleAvatarSuccess(res, file) {
      this.loading = false;
      this.imageUrl = URL.createObjectURL(file.raw);
			if(res.code==200){
				this.$message({
				  message: "上传成功",
				  type: "success",
				});
				this.$emit("imgs", res.data.value);
			}else{
				this.$message({
				  message: res.msg,
				  type: "error",
				});
			}
      
    },
    reset() {
			this.$refs.ruleForm.resetFields() 
      this.$parent.$data.formData = this.$parent.$options.data.call(this).formData;
			if(this.$parent.$data.formTable){
				this.$parent.$data.formTable.data = this.$parent.$options.data.call(this).formTable.data
			}
    },
	abort(file,fileList){
		console.log("submit",file);
		console.log("submit2",fileList);
	},
    handleAvatarError() {
      this.loading = false;
      this.$message.error("上传失败");
    },
    beforeAvatarUpload(file) {
	  console.log("beforeAvatarUpload",file);
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error("上传格式只能是图片格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isJPG && isLt5M;
    },
    handleAvatarProgress(event, file, fileList) {
      this.loading = true;
    },
    handleRemove(file, fileList) {
		
      let list = fileList.map((item) => {
				console.log(item)
				if(item.url.indexOf('http')!=-1){
					return item.url.split(process.env.VUE_APP_IMG)[1]
				}else{
					return item.url
				}
			});
      this.$emit("imgs", {
        type: "pictureCard",
        url: list,
      });
    },
    handleExceed() {
      this.$message({
        message: "最多上传5张图片",
        type: "warning",
      });
    },
		handlePictureCardPreview(file){
			
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		}
  },
};
</script>
<style scoped lang="scss">
.avatar-uploader,
.el-upload {
  border: 1px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 150px;
  height: 150px;
  display: block;
}

.avatar-uploader:hover,
.el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}

.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>
