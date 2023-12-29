import { Icon } from './lib/chakra';
import {
  MdFileCopy,
  MdHome,
  MdLock,
  MdLayers,
  MdAutoAwesome,
  MdOutlineManageAccounts,
} from 'react-icons/md';
import { IoStatsChartOutline } from "react-icons/io5";

// Auth Imports
import { IRoute } from './types/navigation';

const language = typeof window !== "undefined" ? window.localStorage.getItem("language") || "DE" : "DE";

const routes: IRoute[] = [
  {
    name: language === "DE" ? "Meine Aufgaben" : "My Tasks",
    path: '/my-tasks',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    collapse: false,
    rightElement: true,
  },
  {
    name: language === "DE" ? "Mein Feedback" : "My Feedback",
    path: '/my-feedback',
    icon: <Icon as={MdLayers} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  // { 
  //    name: language === "DE" ? "Nutzung" : "Usage",
  //  path: '/usage',
  //  icon: <Icon as={IoStatsChartOutline} width="20px" height="20px" color="inherit" />,
  //  collapse: false,
  //  },
  //{
  // name: language === "DE" ? "Mein Profil" : "My Profile",
  //  path: '/settings',
  //   icon: <Icon as={MdOutlineManageAccounts} width="20px" height="20px" color="inherit" />,
  //      collapse: false,
  //  },
  // --- Admin Pages ---
  {
    name: language === "DE" ? "Admin Konsole" : "Admin Console",
    path: '/admin',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: language === "DE" ? "Alle Rückmeldungen" : "All Feedback",
        layout: '/admin',
        path: '/all-feedback',
      },
      {
        name: language === "DE" ? "Alle Schemata" : "All Schemas",
        layout: '/admin',
        path: '/all-schemas',
      },
      {
        name: language === "DE" ? "Neues Schema" : "New Schema",
        layout: '/admin',
        path: '/new-schema',
      },
      {
        name: language === "DE" ? "Statistik" : "Statistic",
        layout: '/admin',
        path: '/statistic',
      },
      {
        name: language === "DE" ? "Benutzer" : "Users",
        layout: '/admin',
        path: '/overview',
      },
      {
        name: language === "DE" ? "Kosten" : "Costs",
        layout: '/admin',
        path: '/costs',
      },
      {
        name: language === "DE" ? "Interne Tools" : "Internal Tools",
        layout: '/admin',
        path: '/internal-tools',
      },
    ],
  },
  {
    name: language === "DE" ? "Mein Profil" : "My Profile",
    path: '/settings',
    icon: (
      <Icon
        as={MdOutlineManageAccounts}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    invisible: true,
    collapse: false,
  },
  {
    name: language === "DE" ? "Nutzung" : "Usage",
    path: '/usage',
    icon: <Icon as={IoStatsChartOutline} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: language === "DE" ? "Impressum" : "Imprint",
    path: '/impressum',
    icon: <Icon as={MdLayers} width="20px" height="20px" color="inherit" />,
    collapse: false,
    invisible: true,
  },
  {
    name: language === "DE" ? "Datenschutzerklärung" : "Privacy",
    path: '/datenschutz',
    icon: <Icon as={MdLayers} width="20px" height="20px" color="inherit" />,
    collapse: false,
    invisible: true,
  },
];

export default routes;
