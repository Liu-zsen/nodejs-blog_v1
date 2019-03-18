const crypto = require('crypto');


//加密对象 --》 返回加密成功的数据

module.exports = function(password, key = 'sumberkey'){
    const hmac = crypto.createHmac('sha256',key);
    hmac.update(password);
    // 将加密后的密码 导出
    const passwordHMAC = hmac.digest('hex');    //加密为16进制格式
    return passwordHMAC;
}