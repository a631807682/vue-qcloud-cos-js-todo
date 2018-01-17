<template>
	<section>
	<ul>
		<li>修改lib/config中bucketName</li>
		<li>腾讯cos后台添加cors</li>
		<li>前端授权测试阶段修改lib/qcloud文件SecretId与MjwzXXXXXXXXXX值</li>
	</ul>
		<el-upload action="" :http-request="handleCosUpload" list-type="picture-card" :on-success="handleUploadSuccess" accept="image/*">
			<i class="el-icon-plus"></i>
		</el-upload>
	</section>
</template>
<script>
import { sliceUploadImage } from '@/lib/qcloud';

export default {
	data() {
		return {

		}
	},
	methods: {
		handleCosUpload: sliceUploadImage,
		handleUploadSuccess(response, file, fileList) {
			console.log('response', response)
			console.log('file', file)
			console.log('fileList', fileList)
		}
	}
}

</script>
<style scoped>


</style>
