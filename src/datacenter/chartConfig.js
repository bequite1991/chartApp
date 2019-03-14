const Elevator_Running_Data_Chart_Options = {
  title: {
    text: '电梯运行数据',
    subtext: '数据来自网络',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['2019年', '2012年'],
  },
  toolbox: {
    show: true,
    feature: {
      mark: {show: true},
      dataView: {show: true, readOnly: false},
      magicType: {show: true, type: ['line', 'bar']},
      restore: {show: true},
      saveAsImage: {show: true},
    },
  },
  calculable: true,
  xAxis: [
    {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
  ],
  yAxis: [
    {
      type: 'category',
      data: ['总运行天数（天）'],
    },
  ],
  series: [
    {
      name: '2019年',
      type: 'bar',
      data: [],
    },
    // {
    //     name:'2012年',
    //     type:'bar',
    //     data:[300, 1200, 900]
    // }
  ],
};

const Elevator_System_Count_Chart_Options = {
  title: {
    text: '电梯系统安装数量',
    subtext: '纯属虚构',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['总数'],
  },
  toolbox: {
    show: true,
    feature: {
      mark: {show: true},
      dataView: {show: true, readOnly: false},
      magicType: {show: true, type: ['line', 'bar']},
      restore: {show: true},
      saveAsImage: {show: true},
    },
  },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      data: ['2019年'],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      name: '总数',
      type: 'bar',
      data: [],
      markPoint: {
        data: [{type: 'max', name: '最大值'}, {type: 'min', name: '最小值'}],
      },
      markLine: {
        data: [{type: 'average', name: '平均值'}],
      },
    },
  ],
};

const Elevator_Running_Distance_Every_Month_Chart_Option = {
  title: {
    text: '每月电梯运行距离',
    subtext: '大数据',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['运行距离', '故障数'],
  },
  toolbox: {
    show: true,
    feature: {
      mark: {show: true},
      dataView: {show: true, readOnly: false},
      magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
      restore: {show: true},
      saveAsImage: {show: true},
    },
  },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: [
        '2017-06',
        '2017-07',
        '2017-08',
        '2017-09',
        '2017-10',
        '2017-11',
        '2017-12',
        '2017-12',
        '2018-01',
        '2018-02',
        '2018-03',
        '2018-04',
        '2018-05',
        '2018-06',
        '2018-07',
      ],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    // {
    //     name: '运行距离',
    //     type: 'line',
    //     smooth: true,
    //     itemStyle: { normal: { areaStyle: { type: 'default' } } },
    //     data: [1000, 1200, 1200, 1100, 1300, 1500, 1600, 1800, 1400, 1200, 1500, 1200, 1100, 1300, 1500]
    // },
    // {
    //     name: '故障数',
    //     type: 'line',
    //     smooth: true,
    //     itemStyle: { normal: { areaStyle: { type: 'default' } } },
    //     data: [1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0]
    // },
  ],
};

export {
  Elevator_Running_Data_Chart_Options,
  Elevator_System_Count_Chart_Options,
  Elevator_Running_Distance_Every_Month_Chart_Option,
};
