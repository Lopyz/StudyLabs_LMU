type ExcelDataType = {
  exercise_id: string;
  exercise_text: string;
  solution_student: string;
  points_achieved: number;
  points_achievable: number;
  solution_correct: string;
  feedback: string;
};

const defaultOpacity = 0;
const white = '#FFFFFF';
const lightGreen = '#00E396';

const baseGradient = (color: string, opacity: number) => [
  {
    offset: 0,
    color,
    opacity: 1,
  },
  {
    offset: 100,
    color,
    opacity,
  },
];

export const lineChartDataSidebar = [
  {
    name: 'Maximal Erreichbare Punkte',
    data: [8, 12, 60, 40, 80],
  },
  {
    name: 'Erreichte Punktanzahl',
    data: [25, 45, 10, 60, 72],
  },
];

export const lineChartOptionsSidebar = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  markers: {
    size: 1,
    colors: '#868CFF',
    strokeColors: 'white',
    strokeWidth: 2,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    shape: 'circle',
    radius: 2,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true,
  },
  tooltip: {
    theme: 'dark',

  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    type: 'gradient',
  },
  xaxis: {
    labels: {
      style: {
        colors: 'white',
        fontSize: '10px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: 'white',
        fontSize: '10px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  legend: {
    show: false,
  },
  grid: {
    show: false,
    column: {
      colors: ['transparent'], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 0.1,
      opacityFrom: 0.3,
      opacityTo: 0.9,
      colorStops: [
        [
          {
            offset: 0,
            color: '#FFFFFF',
            opacity: 1,
          },
          {
            offset: 100,
            color: '#FFFFFF',
            opacity: 0,
          },
        ],
        [
          {
            offset: 0,
            color: '#00E396',  // Hellgrün
            opacity: 1,
          },
          {
            offset: 100,
            color: '#00E396',
            opacity: 0.2,
          },
        ],
      ]
    },
  },
};

export const barChartDataSidebar = [
  {
    name: 'Credits Benutzt',
    data: [297, 410, 540, 390, 617, 520, 490],
  },
];

export const barChartOptionsSidebar = {
  chart: {
    toolbar: {
      show: true,
    },
  },
  tooltip: {
    style: {
      fontSize: '12px',
    },
    onDatasetHover: {
      style: {
        fontSize: '12px',
      },
    },
    theme: 'dark',
  },
  xaxis: {
    show: true,
    labels: {
      show: true,
      style: {
        fontSize: '12px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
  },
  yaxis: {
    show: true,
    labels: {
      show: true,
      style: {
        fontSize: '12px',
        fontWeight: '500',
      },
      formatter: (value: number) => `$${value.toFixed(3)}`,
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
  },
  grid: {
    show: true,
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: 'solid',
    opacity: 1,
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '15px',
    },
  },
  colors: ['#3556CB'], // Grün
};

export const barChartStatistics = {
  chart: {
    toolbar: {
      show: true,
    },
  },
  tooltip: {
    style: {
      fontSize: '12px',
    },
    onDatasetHover: {
      style: {
        fontSize: '12px',
      },
    },
    theme: 'dark',
  },
  xaxis: {
    show: true,
    labels: {
      show: true,
      style: {
        fontSize: '12px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
  },
  yaxis: {
    show: true,
    labels: {
      show: true,
      style: {
        fontSize: '12px',
        fontWeight: '500',
      },
      formatter: (value: number) => `${value.toFixed(1)}p`,
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
  },
  grid: {
    show: true,
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 0.1,
      opacityFrom: 0.3,
      opacityTo: 0.9,
      colorStops: [
        baseGradient('#3556CB', defaultOpacity),
        baseGradient(lightGreen, 0.2),
      ],
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      stacked: true,
      borderRadius: 4,
      columnWidth: '35px',
    },
  },
};

export const lineChartDataUsage = [
  {
    name: 'Placeholder',
    data: [
      7420, 6504, 8342, 6024, 9592, 10294, 8842, 11695, 10423, 12045, 12494,
      16642,
    ],
  },
];

export const lineChartOptionsUsage = {
  chart: {
    toolbar: {
      show: true,
    },
    dropShadow: {
      enabled: true,
      top: 13,
      left: 0,
      blur: 10,
      opacity: 0.1,
      color: '#3556CB',
    },
  },
  colors: ['#6699CC', '#3556CB'],
  markers: {
    size: 0,
    colors: 'white',
    strokeColors: '#3556CB',
    strokeWidth: 2,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    shape: 'circle',
    radius: 2,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true,
  },
  tooltip: {
    theme: 'dark',
  },
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: 'smooth',
    type: 'gradient',
  },
  xaxis: {

    labels: {
      style: {
        colors: '#718096',
        fontSize: '14px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
  },
  yaxis: {
    show: true,
  },
  legend: {
    show: true,
  },
  dropShadow: {
    enabled: true,
    top: 0,
    left: 0,
    blur: 3,
    opacity: 0.5,
  },
  grid: {
    show: true,
    column: {
      colors: ['transparent'],
      opacity: 0.5,
    },
  },
};


export const pieChartOptionsSidebar = (usedRequests: number, remainingRequests: number, language: string) => ({
  chart: {
    type: 'pie',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
  },
  labels: [
    `${language === 'DE' ? 'Genutzte Anfragen' : 'Used Requests'}: ${usedRequests}`,
    `   ${language === 'DE' ? 'Verfügbare Anfragen' : 'Remaining Requests'}: ${remainingRequests}`
  ], plotOptions: {
    pie: {
      customScale: 1.4,
      offsetY: 8,
      expandOnClick: true,
      dataLabels: {
        offset: 0,
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 0.1,
      opacityFrom: 0.3,
      opacityTo: 0.9,
      colorStops: [
        baseGradient(white, defaultOpacity),
        baseGradient(lightGreen, 0.2),
      ],
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    offsetY: 8,
    labels: {
      colors: white,
    },
  },
});

