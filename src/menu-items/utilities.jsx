import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

// icons
const icons = {
  AirplanemodeActiveIcon,
  CategoryOutlinedIcon
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'jets',
  title: 'Jets',
  type: 'group',
  children: [
    {
      id: 'jets',
      title: 'Jets',
      type: 'item',
      url: '/jets',
      icon: icons.AirplanemodeActiveIcon
    },
    {
      id: 'jets-categories',
      title: 'Jets Categories',
      type: 'item',
      url: '/jets-categories',
      icon: icons.CategoryOutlinedIcon
    }
  ]
};

export default utilities;
