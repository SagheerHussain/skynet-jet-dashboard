// project imports

import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import { useGetMenuMaster } from 'api/menu';

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  return (
    <>
      <SimpleBar sx={{ '& .simplebar-content': { minHeight: "90vh", overflow: "hidden", display: 'flex', marginTop: 10, flexDirection: 'column' } }}>
        <Navigation />
        {drawerOpen}
      </SimpleBar>
    </>
  );
}
