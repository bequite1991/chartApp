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
export const encode = (cmd, num_id, timestap, src, resp, token, filter) => {
  return JSON.stringify ({
    cmd: cmd,
    num_id: num_id,
    timestap: timestap,
    src: src,
    resp: resp,
    token: token,
    filter: filter,
  });
};

export const randomData = function() {
    return Math.round(Math.random()*10000);
  };
