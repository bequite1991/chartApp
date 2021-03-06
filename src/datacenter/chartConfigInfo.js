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
  ]
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

const Elevator_Map_China_Options = {
  title: {
    text: '设备分布',
    subtext: '慧保电梯设备分布图',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data:['全部型号']
  },
  visualMap: {
    min: 100,
    max: 10000,
    left: 'left',
    top: 'center',
    text: ['设备分布多','设备分布少'],       // 文本，默认为数值文本
    calculable: false,
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    feature: {
      dataView: {readOnly: false},
      restore: {},
      saveAsImage: {}
    }
  },
  series: [
    {
        name: '全部型号',
        type: 'map',
        mapType: 'china',
        label: {
            normal: {
            show: true,
            // shadowBlur: 10,
            // shadowColor: '#333'
            },
            emphasis: {
                show: true
            }
        },
        zlevel: 1,
        data:[
            // {name: '北京',value: randomData() },
            // {name: '天津',value: randomData() },
            // {name: '上海',value: randomData() },
            // {name: '广东',value: randomData() },
            // {name: '台湾',value: randomData() },
            // {name: '香港',value: randomData() },
            // {name: '澳门',value: randomData() }
        ]
    }
  ]
}

const Elevator_Error_Every_Month_Chart_Options = {
    title: {
      text: '每月电梯故障数',
      subtext: '',
      left: 'center'
    },
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['1', '2', '3', '4', '5', '6', '7','8','9','10','11','12'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        // {
        //     name:'直接访问',
        //     type:'bar',
        //     barWidth: '60%',
        //     data:[10, 52, 200, 334, 390, 330, 220]
        // }
    ]
}
const Elevator_Error_Ratio_Chart_Options = {
    title : {
        text: '故障问题比例',
        subtext: '',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['电气强度降低','磨损与污损','整体故障','贯穿','其他故障']
    },
    series : [
        // {
        //     name: '访问来源',
        //     type: 'pie',
        //     radius : '55%',
        //     center: ['50%', '60%'],
        //     data:[
        //         {value:335, name:'直接访问'},
        //         {value:310, name:'邮件营销'},
        //         {value:234, name:'联盟广告'},
        //         {value:135, name:'视频广告'},
        //         {value:1548, name:'搜索引擎'}
        //     ],
        //     itemStyle: {
        //         emphasis: {
        //             shadowBlur: 10,
        //             shadowOffsetX: 0,
        //             shadowColor: 'rgba(0, 0, 0, 0.5)'
        //         }
        //     }
        // }
    ]
};
// const Elevator_Maintenance_OrdersAndFinish_Chart_Options = {
//     title : {
//         text: '',
//         subtext: '维保人员派单量和完成量',
//     },
//     tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//             type: 'shadow'
//         }
//     },
//     legend: {
//         data: ['派单量', '完成量']
//     },
//     grid: {
//         left: '3%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true
//     },
//     xAxis: {
//         type: 'value',
//         boundaryGap: [0, 0.01]
//     },
//     yAxis: {
//         type: 'category',
//         data: ['H级','B级','K级','E级','F级']
//     },
//     series: [
//         // {
//         //     name: '2011年',
//         //     type: 'bar',
//         //     data: [18203, 23489, 29034, 104970, 131744, 630230]
//         // },
//         // {
//         //     name: '2012年',
//         //     type: 'bar',
//         //     data: [19325, 23438, 31000, 121594, 134141, 681807]
//         // }
//     ]
// };
const Elevator_Maintenance_OrdersAndFinish_Chart_Options = {
    title : {
        text: '维保人员派单量和完成量',
        subtext: '',
        x:'center'

    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        left: 'left',
        orient: 'vertical',
        data: ['完成量', '未完成量']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis:  {
        type: 'value'
    },
    yAxis: {
        type: 'category',
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    series: [
        // {
        //     name: '直接访问',
        //     type: 'bar',
        //     stack: '总量',
        //     label: {
        //         normal: {
        //             show: true,
        //             position: 'insideRight'
        //         }
        //     },
        //     data: [320, 302, 301, 334, 390, 330, 320]
        // },
        // {
        //     name: '邮件营销',
        //     type: 'bar',
        //     stack: '总量',
        //     label: {
        //         normal: {
        //             show: true,
        //             position: 'insideRight'
        //         }
        //     },
        //     data: [120, 132, 101, 134, 90, 230, 210]
        // }
    ]
};;


const Elevator_maintenance_Orders_Month_Chart_Options = {
    title: {
      text: '每月电梯故障数',
      subtext: '',
      left: 'center'
    },
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['1', '2', '3', '4', '5', '6', '7','8','9','10','11','12'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        // {
        //     name:'直接访问',
        //     type:'bar',
        //     barWidth: '60%',
        //     data:[10, 52, 200, 334, 390, 330, 220]
        // }
    ]
}



export {
  Elevator_Running_Data_Chart_Options,
  Elevator_System_Count_Chart_Options,
  Elevator_Running_Distance_Every_Month_Chart_Option,
  Elevator_Map_China_Options,
  Elevator_Error_Every_Month_Chart_Options,
  Elevator_Error_Ratio_Chart_Options,
  Elevator_Maintenance_OrdersAndFinish_Chart_Options,
  Elevator_maintenance_Orders_Month_Chart_Options
};
