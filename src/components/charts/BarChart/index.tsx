"use client"

import dynamic from "next/dynamic";
import React from "react";
const Chart = dynamic(() => import("react-apexcharts").then((mod) => mod.default), { ssr: false });

import { isWindowAvailable } from "@/utils/navigation";

type ChartProps = {
  [x: string]: any;
};
type ChartState = {
  chartData: any[];
  chartOptions: any;
};

class BarChart extends React.Component<ChartProps, ChartState> {
  constructor(props: { chartData: any[]; chartOptions: any }) {
    super(props);
    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    let newChartOptions = this.props.chartOptions;
    if (this.props.chartLabels) {
        newChartOptions.xaxis.categories = this.props.chartLabels;
    }
    this.setState({
        chartData: this.props.chartData,
        chartOptions: newChartOptions,
    });
}

  render() {
    if (!isWindowAvailable()) return <></>;

    return (
      <Chart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type="bar"
        width="100%"
        height="100%"
      />
    );
  }
}

export default BarChart;
