<template>
  <transition name="fade">
    <router-view>
		
	</router-view>
  </transition>
</template>

<script>
  export default {
  }
</script>
<style>
	.el-button [class*=el-icon-]+span {
	    margin-left: 0px;
	}
	.el-dialog__header{
		border-bottom: 1px solid #EBEEF5;
	}
	.el-button{
		margin-bottom:5px !important;
	}
	.title{
		height:60px;
		line-height:60px;
		font-size:18px;
		font-weight:bold;
	}
	.btn{
		height:45px;
		line-height:45px;
		padding-left:100px;
		padding-top:20px;
	}
	.btn div{
		display:inline-block;
		width:160px;
		text-align:center;
		border-radius:5px;
		vertical-align:top;
	}
	.btn div:nth-child(1){
		background:#169BD5;
		color:#fff;
		margin-right:30px;
	}
	.btn div:nth-child(2){
		border:1px solid #333;
		height:43px;
		line-height:43px;
		margin-top:1px;
	}
	
	/* el-table 滚动条加粗 */
	.el-table__body-wrapper::-webkit-scrollbar { 
	  height: 13px;
	}
	.el-form-item  .col input.el-input__inner{
		color:#4dcb0f;
	}
	.cell button{
		margin-left: 10px;
	}
	.cell button:nth-child(4),.cell button:nth-child(1){
		margin-left: 0px;
	}
	.cell button.marginLeft{
		margin-left: 0px;
	}
	.cell button.marginLeft1{
		margin-left: 10px;
	}
	/* .site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item.is-active{
		color: #1bb567;
	}
	.site-sidebar--dark .site-sidebar__menu.el-menu .el-submenu.is-active > .el-submenu__title{
		color: #1bb567;
	} */
</style>