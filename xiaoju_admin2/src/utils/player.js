// 播放器
var player = {
	pl: null,
	// 乐视云播放器 获取 设置
	CloudVodPlayer: function () {
		if (!this.pl) {
			this.pl = new window.CloudVodPlayer()
		}
		return this.pl
	}
}

export default player
