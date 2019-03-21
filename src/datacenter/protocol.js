const PROTOCAL_REQUEST = {
  '9001': 'inshn_dtimao/huibao/req/dev_info', //电梯设备信息接口
  '9002': 'inshn_dtimao/huibao/req/dev_onoff_info', // 每月设备离线信息获取接口
  '9003': 'inshn_dtimao/huibao/req/dev_onoff_num', // 每月设备离线数量获取接口
  '9004': 'inshn_dtimao/huibao/req/dev_alarm_repeat', // 故障接警未处理接口
  '9005': 'inshn_dtimao/huibao/req/month_dev_num', // 电梯安装数量获取
  '9006': 'inshn_dtimao/huibao/req/month_dev_status', // 电梯总在线、离线数获取
  '9007': 'inshn_dtimao/huibao/req/dev_alarm_num', // 电梯故障数量查看接口
  '9009': 'inshn_dtimao/huibao/req/mai_dev_num', // 每月维保审核数目接口
  '9010': 'inshn_dtimao/huibao/req/mai_user_info', // 维保人员信息接口
  '9011': 'inshn_dtimao/huibao/req/mai_dev_info', // 电梯维保记录查询接口
  '9012': 'inshn_dtimao/huibao/req/dev_run_day/user', // 电梯安装日期到当前日期的总天数查询接口
};

const PROTOCAL_RESPONSE = {
  '9001': 'inshn_dtimao/huibao/resp/dev_info', //电梯设备信息接口
  '9002': 'inshn_dtimao/huibao/resp/dev_onoff_info', // 每月设备离线信息获取接口
  '9003': 'inshn_dtimao/huibao/resp/dev_onoff_num', // 每月设备离线数量获取接口
  '9004': 'inshn_dtimao/huibao/resp/dev_alarm_repeat', // 故障接警未处理接口
  '9005': 'inshn_dtimao/huibao/resp/month_dev_num', // 电梯安装数量获取
  '9006': 'inshn_dtimao/huibao/resp/month_dev_status', // 电梯总在线、离线数获取
  '9007': 'inshn_dtimao/huibao/resp/dev_alarm_num', // 电梯故障数量查看接口
  '9009': 'inshn_dtimao/huibao/resp/mai_dev_num', // 每月维保审核数目接口
  '9010': 'inshn_dtimao/huibao/resp/mai_user_info', // 维保人员信息接口
  '9011': 'inshn_dtimao/huibao/resp/mai_dev_info', // 电梯维保记录查询接口
  '9012': 'inshn_dtimao/huibao/resp/dev_run_day/user', // 电梯安装日期到当前日期的总天数查询接口
};

const PROTOCAL_MAP = [];

export {PROTOCAL_REQUEST, PROTOCAL_RESPONSE};
