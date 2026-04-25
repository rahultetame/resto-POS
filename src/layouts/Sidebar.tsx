import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton, Tooltip } from '@mui/material';
import { NavLink } from 'react-router-dom';
import './Sidebar.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { PATH } from '../routes/path';

export interface SidebarItem {
  label: string;
  path: string;
  icon: any;
}

export const sidebarConfig: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: PATH.DASHBOARD,
    icon: DashboardIcon,
  },
  {
    label: 'Order Screen',
    path: PATH.POS,
    icon: PointOfSaleIcon,
  },
  // {
  //   label: 'Kiosk',
  //   path: PATH.KIOSK,
  //   icon: StorefrontIcon,
  // },
];

interface Props {
  isOpen: boolean;
  setSidebarToggle: any;
}

const Sidebar = ({ isOpen, setSidebarToggle }: Props) => {
  return (
    <Box className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      {/* Top Section */}
      <Box className='sidebar__top'>
        {isOpen && <span className='sidebar__brand'>Restaurant POS</span>}

        <Tooltip sx={{ ml: 1.5 }} title='Toggle Sidebar'>
          <IconButton onClick={() => setSidebarToggle(!isOpen)}>
            <MenuIcon sx={{ color: '#fff' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Nav */}
      <Box className='sidebar__nav'>
        {sidebarConfig?.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink key={item.path} to={item.path} className='sidebar__link'>
              <Icon fontSize='small' />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </Box>
    </Box>
  );
};

export default Sidebar;
