
var bigInt = require('big-integer') 
class init {
  /**
   * 构造函数
   */
    constructor (_workerId, _dataCenterId, _sequence) {
        this.twepoch = 1288834974657
        // this.twepoch = 0
        this.workerIdBits = 5
        this.dataCenterIdBits = 5
        this.maxWrokerId = -1 ^ (-1 << this.workerIdBits) // 值为：31
        this.maxDataCenterId = -1 ^ (-1 << this.dataCenterIdBits) // 值为：31
        this.sequenceBits = 12
        this.workerIdShift = this.sequenceBits // 值为：12
        this.dataCenterIdShift = this.sequenceBits + this.workerIdBits // 值为：17
        this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.dataCenterIdBits // 值为：22
        this.sequenceMask = -1 ^ (-1 << this.sequenceBits) // 值为：4095
        this.lastTimestamp = -1
        // 设置默认值,从环境变量取
        this.workerId = 1
        this.dataCenterId = 1
        this.sequence = 0
        if (this.workerId > this.maxWrokerId || this.workerId < 0) {
            throw new Error('config.worker_id must max than 0 and small than maxWrokerId-[' + this.maxWrokerId + ']')
        }
        if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) {
            throw new Error('config.data_center_id must max than 0 and small than maxDataCenterId-[' + this.maxDataCenterId + ']')
        }
        this.workerId = _workerId
        this.dataCenterId = _dataCenterId
        this.sequence = _sequence
    }
    /**
   * 阻塞到下一个毫秒，直到获得新的时间戳
   * @param {bigint} lastTimestamp 上次生成ID的时间截
   * @return {bigint} 当前时间戳
   */
    tilNextMillis (lastTimestamp) {
      var timestamp = this.timeGen()
      while (timestamp <= lastTimestamp) {
          timestamp = this.timeGen()
      }
      return timestamp
    }
    /**
   * 返回以毫秒为单位的当前时间
   * @return {bigint} 当前时间(毫秒)
   */
    timeGen () {
      return Date.now()
    }
    /**
   * 获得下一个ID (该方法是线程安全的)
   *
   * @returns {bigint} SnowflakeId 返回 id
   */
    createID () {
      var timestamp = this.timeGen()
      if (timestamp < this.lastTimestamp) {
          throw new Error('Clock moved backwards. Refusing to generate id for ' +
              (this.lastTimestamp - timestamp))
      }
      if (this.lastTimestamp === timestamp) {
          this.sequence = (this.sequence + 1) & this.sequenceMask
          if (this.sequence === 0) {
              timestamp = this.tilNextMillis(this.lastTimestamp)
          }
      } else {
          this.sequence = 0
      }
      this.lastTimestamp = timestamp
      var shiftNum = (this.dataCenterId << this.dataCenterIdShift) |
          (this.workerId << this.workerIdShift) |
          this.sequence // dataCenterId:1,workerId:1,sequence:0  shiftNum:135168
      // eslint-disable-next-line new-cap
      var nfirst = new bigInt(String(timestamp - this.twepoch), 10)
      nfirst = nfirst.shiftLeft(this.timestampLeftShift)
      // eslint-disable-next-line new-cap
      var nnextId = nfirst.or(new bigInt(String(shiftNum), 10))
      var ID = nnextId.toString(10)
      return ID
  }
}

//  ========== TEST ==========
// function main () {
//   console.time('id')
//   const idWorker = new SnowFlake(1, 1, 0)

//   const tempIds = []
//   for (let i = 0; i < 10000; i++) {
//     const id = idWorker.createID()
//     tempIds.push(id)
//   }
//   console.log(tempIds.length)
//   console.timeEnd('id')
// }
// main()
module.exports = {
  init
} 
