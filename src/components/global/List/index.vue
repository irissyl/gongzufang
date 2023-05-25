<template>
	<section>
		<p class="ft16 mtb20">{{title}}</p>
		<table>
			<tbody v-for="(item,index) in ListCols" :key="`${index}`">
				<tr>
					<th v-for="(op,idx) in item" :key="`th${idx}`" :style="{width:item.width||width+'px'}">{{op.label}}</th>
				</tr>
				<tr >
					<td v-for="(op,idx) in item" :key="`td${idx}`" :style="{width:item.width||width+'px',color:op.color}">
						<el-popover
						  v-if="op.type==='image'"
						  :placement="op.placement || 'left'"
						  trigger="click"
						>
						  <div>
						    <el-image
						      style="width: 300px;height: auto;"
						      :src="ListData[op.prop]|formatImg"
						      fit="fill"
						    ></el-image>
						  </div>
						  <el-image
						    :style="op.style || 'width: 80px;height: 80px;'"
						    :src="ListData[op.prop]|formatImg"
						    fit="contain"
						    slot="reference"
						  ></el-image>
						</el-popover>
						<span v-if="!op.type">{{(op.formatter && op.formatter(ListData)) || (ListData[op.prop]===0?0:ListData[op.prop]?ListData[op.prop]:'-')}}</span>
					</td>
				</tr>
			</tbody>
		</table>
	</section>
</template>

<script>
export default {
  name: "List",
	props: {
		title: {
		  type: String,
		  default: "列表格",
		},
		width:{
			type: Number,
			default:175
		},
		ListCols: {
		  type: Array,
		  default: () => [],
		},
		ListData: {
		  type: Object,
		  default: () => ({}),
		},
	},
	data() {
	  return {
			
	  };
	},
}
</script>

<style scoped lang="scss">
	table,table tr th, table tr td { 
		border:1px solid #e4e4e4; 
	}
	table { 
		min-height: 45px; 
		line-height: 45px; 
		text-align: center; 
		border-collapse: collapse; 
		padding:2px;
	} 
	table tr th {
		background-color: #f9fafc;
	}
</style>
