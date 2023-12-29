'use client'

import dynamic from 'next/dynamic';
import React from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts').then((mod) => mod.default), { ssr: false });

interface ChartProps {
  chartData: any[];
  chartOptions: any;
}

interface ChartState {
  chartData: any[];
  chartOptions: any;
}

class PieChart extends React.Component<ChartProps, ChartState> {
  private chartRef: React.RefObject<HTMLDivElement>;

  constructor(props: ChartProps) {
    super(props);
    this.state = {
      chartData: props.chartData,
      chartOptions: props.chartOptions,
    };
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    if (this.chartRef.current) {
      this.setState({
        chartData: this.props.chartData,
        chartOptions: this.props.chartOptions,
      });
    } else {
      console.error('Chart element not mounted.');
    }
  }

  render() {
    if (typeof window === 'undefined') return null; // SSR guard

    return (
      <div ref={this.chartRef}>
        <ReactApexChart
          options={this.state.chartOptions}
          series={this.state.chartData}
          type="pie"
          width="100%"
          height="100%"
        />
      </div>
    );
  }
}

export default PieChart;