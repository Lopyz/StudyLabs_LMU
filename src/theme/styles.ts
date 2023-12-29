import { mode } from '@chakra-ui/theme-tools';
export const globalStyles = {
  colors: {
    brand: {
      100: '#E9E3FF',
      200: '#422AFB',
      300: '#422AFB',
      400: '#7551FF',
      500: '#3556cb',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#11047A',
    },
    brandScheme: {
      100: '#E9E3FF',
      200: '#7551FF',
      300: '#7551FF',
      400: '#7551FF',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#02044A',
    },
    brandTabs: {
      100: '#E9E3FF',
      200: '#422AFB',
      300: '#422AFB',
      400: '#422AFB',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#02044A',
    },
    secondaryGray: {
      100: '#E0E5F2',
      200: '#E2E8F0',
      300: '#F4F7FE',
      400: '#E9EDF7',
      500: '#718096',
      600: '#A3AED0',
      700: '#707EAE',
      800: '#707EAE',
      900: '#1B2559',
    },
    red: {
      100: '#FEEFEE',
      500: '#EE5D50',
      600: '#E31A1A',
    },
    blue: {
      50: '#EFF4FB',
      500: '#3965FF',
    },
    orange: {
      100: '#FFF6DA',
      500: '#FFB547',
    },
    green: {
      100: '#E6FAF5',
      500: '#01B574',
    },
    white: {
      50: '#ffffff',
      100: '#ffffff',
      200: '#ffffff',
      300: '#ffffff',
      400: '#ffffff',
      500: '#ffffff',
      600: '#ffffff',
      700: '#ffffff',
      800: '#ffffff',
      900: '#ffffff',
    },
    navy: {
      50: '#19191A',
      100: '#19191A',
      200: '#19191A',
      300: '#19191A',
      400: '#19191A',
      500: '#19191A',
      600: '#19191A',
      700: '#19191A',
      800: '#19191A',
      900: '#19191A',
    },
    gray: {
      100: '#FAFCFE',
    },
    darkmode: {
      100: '#2C2C2E',
  },
  brandBlue: {
    500: '#3556CB',
  },
},
  styles: {
    global: (props: any) => ({
      body: {
        overflowX: 'hidden',
        bg: mode('#fdfeff', 'darkmode.100')(props),
        fontFamily: 'Poppins',
      },
      input: {
        color: 'gray.700',
      },
      html: {
        fontFamily: 'Poppins',
      },
    }),
  },
};
