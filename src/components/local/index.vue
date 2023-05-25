<template>
  <article class="wrap">
    <iframe id="mapPage" width="100%" height="100%" frameborder=0
            :src="getLocations">
    </iframe>
  </article>
</template>

<script>
    export default {
        name: "Local",
        data() {
            return {
							getLocations:"https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=S4IBZ-6TLHO-WGVWC-SC7QS-23THH-OFFUN&referer=myapp",
						}
        },
        created() {
          let that = this;
					if(localStorage.getItem("log")){
						this.getLocations="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=S4IBZ-6TLHO-WGVWC-SC7QS-23THH-OFFUN&referer=myapp&coord="+localStorage.getItem("log");
					}else{
						this.getLocations="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=S4IBZ-6TLHO-WGVWC-SC7QS-23THH-OFFUN&referer=myapp";
					}
          window.addEventListener('message', (e)=>{
            if (e.data && e.data.module == 'locationPicker') {
              let data = {
                lat:e.data.latlng.lat,
                lng:e.data.latlng.lng,
                address:e.data.poiaddress,
                poiname:e.data.poiname
              };
              this.$emit('getLocation',data);
            }
          }, false);
        },
        mounted() {

        },
        methods: {
          
		  qqMapToBMap(lng, lat) {
		  	if (lng == null || lng == '' || lat == null || lat == '')
		  		return [lng, lat];
		  	var x_pi = 3.14159265358979324;
		  	var x = parseFloat(lng);
		  	var y = parseFloat(lat);
		  	var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
		  	var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
		  	var lng = (z * Math.cos(theta) + 0.0065).toFixed(5);
		  	var lat = (z * Math.sin(theta) + 0.006).toFixed(5);
		  	return [lng, lat];
		  },
        }
    }
</script>

<style scoped lang="scss">

</style>
