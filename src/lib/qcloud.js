import * as COS from 'cos-js-sdk-v5';
// import { commonService } from '@/api';
import config from '@/config';
import { uuid } from '@/lib/utils';

const { protocol, bucketName, region } = config.qcloud;

/**
 * cos访问权限
 * @param  {[type]}   options  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
const getAuthorization = (options, callback) => {
	// 方法一（推荐）
	let method = (options.Method || 'get').toLowerCase();
	let key = options.Key || '';
	let pathname = key.indexOf('/') === 0 ? key : '/' + key;

	// commonService.getQCloudAuth({ method, pathname }).then(res => {
	// 	callback(res);
	// })

	// 方法二（适用于前端调试）
	var authorization = COS.getAuthorization({
		SecretId: 'AKIDXXXXXXXXXXX',
		SecretKey: 'MjwzXXXXXXXXXX',
		Method: options.Method,
		Key: options.Key,
	});
	callback(authorization);

};

/**
 * cos实例
 * @type {COS}
 */
export const cos = new COS({
	// 必选参数
	getAuthorization: getAuthorization,
	// 可选参数
	FileParallelLimit: 3, // 控制文件上传并发数
	ChunkParallelLimit: 3, // 控制单个文件下分片上传并发数
	ChunkSize: 1024 * 1024, // 控制分片大小，单位 B
	ProgressInterval: 1000, // 控制 onProgress 回调的间隔
});

/**
 * 上传
 * @param  {[type]} dirPath   [description]
 * @param  {[type]} vueUpload [description]
 * @return {[type]}           [description]
 */
const vueSliceUploadFile = (staticPath, vueUpload) => {
	let filePath = `${staticPath}/${uuid()}`;
	cos.sliceUploadFile({
		Bucket: bucketName, // Bucket 格式：test-1250000000
		Region: region,
		Key: filePath,
		/* 必须 */
		Body: vueUpload.file,
		TaskReady: function(tid) {
			// TaskId = tid;
		},
		onHashProgress: function(progressData) {},
		onProgress: function(progressData) {
			// {"loaded":1179648,"total":24720838,"speed":48521.22,"percent":0.05}
			//转化为vue进度
			let progressEvent = {
				loaded: progressData.loaded,
				percent: progressData.percent * 100,
				total: progressData.total,
			}
			//触发vue进度条
			vueUpload.onProgress(progressEvent, vueUpload.file)
		},
	}, function(err, data) {
		data.url = protocol + '://' + data.Location;
		data.savePath = data.Key;
		vueUpload.file.response = data;
		//触发vue成功事件
		vueUpload.onSuccess(data, vueUpload.file)
	});
}

export const sliceUploadImage = (vueUpload) => {
	vueSliceUploadFile('/image', vueUpload);
}
