import md5 from 'js-md5';

let Base64 = require ('js-base64').Base64;

export const getKey = (data, salt = 'inshn_gwapi') => {
  return md5 (data + salt);
};

export const getToken = (cmd, key, timestamp) => {
  return Base64.encode ({cmd: cmd, key: key, timestamp: timestamp});
};
/**
 cmd: '9001',
        num_id: time + '' + messageIndex,
        // num_id: 201803031010250202,
        timestap: time,
        // src: 'inshn_dtimao.huibao.resp.dev_info',
        src: 'inshn_dtimao.huibao.resp.dev_info.xiaoye',
        resp: 200,
        token: token,
        // filter: ,
 */
export const encode = (
  cmd,
  num_id,
  timestap,
  src,
  user,
  resp,
  token,
  filter,
  rows
) => {
  return JSON.stringify ({
    cmd: cmd,
    num_id: num_id,
    timestap: timestap,
    src: src,
    user: user,
    resp: resp,
    token: token,
    filter: filter,
    rows: rows,
  });
};

export const timestampToTime = timestamp => {
  if (timestamp) {
    var date = new Date (timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear () + '-';
    var M =
      (date.getMonth () + 1 < 10
        ? '0' + (date.getMonth () + 1)
        : date.getMonth () + 1) + '-';
    var D =
      (date.getDate () < 10 ? '0' + date.getDate () : date.getDate ()) + ' ';
    var h =
      (date.getHours () < 10 ? '0' + date.getHours () : date.getHours ()) + ':';
    var m =
      (date.getMinutes () < 10
        ? '0' + date.getMinutes ()
        : date.getMinutes ()) + ':';
    var s = date.getSeconds () < 10
      ? '0' + date.getSeconds ()
      : date.getSeconds ();
    return Y + M + D + h + m + s;
  } else {
    return '';
  }
};

export const randomData = function () {
  return Math.round (Math.random () * 10000);
};
