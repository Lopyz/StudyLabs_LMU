import React from 'react';
import { Box } from '@chakra-ui/react';
import { getTableData } from '@/components/tables/variables/tableDataCheckOverview';
import CheckTable from '@/components/tables/CheckTableOverview';
import { adminProtectionBackend } from '@/utils/adminProtectionBackend';
import { GetServerSideProps, GetServerSidePropsResult, Redirect } from 'next';

interface Props {
  tableData: any;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Zuerst Admin-Schutz
  const adminProps = await adminProtectionBackend(ctx) as GetServerSidePropsResult<any> | { redirect: Redirect };

  // Wenn eine Weiterleitung erforderlich ist, brechen Sie ab und führen Sie die Weiterleitung durch.
  if ('redirect' in adminProps) {
    return adminProps;
  }

  // Wenn notFound gesetzt ist, brechen Sie ab und zeigen Sie die 404-Seite an.
  if ('notFound' in adminProps && adminProps.notFound === true) {
    return { notFound: true };
  }

  // Ansonsten führen Sie die Logik Ihrer ursprünglichen getServerSideProps-Funktion aus.
  const tableData = await getTableData();

  // Hier stellen wir sicher, dass 'props' in adminProps existiert, bevor wir darauf zugreifen.
  const adminPropsData = 'props' in adminProps ? adminProps.props : {};

  return {
    props: {
      ...adminPropsData,
      tableData,
    },
  };
};

export default function Settings({ tableData }: Props) {
  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
      <CheckTable tableData={tableData} />
    </Box>
  );
}
