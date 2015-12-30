var initLineChart = (function() {
	
    require.config({
        paths: {
            echarts: 'http://echarts.baidu.com/build/dist'
        }
    });

    /**
     * 渲染趋势图
     * @param  {[String]} xData     X轴数据
     * @param  {[Number]} monthData 当月数据
     * @param  {[Number]} weekData  当周数据
     * @param  {[Number]} dayData   当日数据
     * 后三个数组长度要与第一个数组长度相同
     */
    var initLineChart = function(xData, monthData, weekData, dayData) {
        require(
            [
                'echarts',
                'js/chart_theme',
                'echarts/chart/line',
                'echarts/chart/bar'
            ],
            function(ec, theme) {
                // 基于准备好的dom，初始化echarts图表
                var lineChart = ec.init(document.getElementById('line-chart'), theme);
                window.onresize = lineChart.resize;

                var option = {
                    timeline: {
                        data: [
                            '2010', '2011', '2012'
                        ],
                        padding: 10,
                        label: {
                            formatter: function(s) {
                                s = s.slice(3, 4) - 0;
                                if (s == 0)
                                    return '月报';
                                if (s == 1)
                                    return '周报';
                                return '今日';
                            }
                        },
                        controlPosition: 'none'
                    },
                    options: [{
                        backgroundColor: '#F4F4F4',
                        tooltip: {
                            trigger: 'axis'
                        },
                        xAxis: [{
                            type: 'category',
                            boundaryGap: false,
                            data: xData
                        }],
                        yAxis: [{
                            type: 'value'
                        }],
                        series: [{
                            name: '访问量',
                            type: 'line',
                            smooth: true,
                            itemStyle: {
                                normal: {
                                    areaStyle: {
                                        type: 'default'
                                    }
                                }
                            },
                            data: monthData
                        }]
                    }, {
                        series: [{
                            name: '访问量',
                            data: weekData
                        }]
                    }, {
                        series: [{
                            name: '访问量',
                            data: dayData
                        }]
                    }]
                };

                // 为echarts对象加载数据 
                lineChart.setOption(option);
            }
        );
    }
    return initLineChart;
})();

initLineChart(['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'], [710, 520, 1210, 540, 260, 830, 710], [110, 120, 121, 154, 260, 130, 210], [10, 12, 21, 54, 26, 80, 10]);
