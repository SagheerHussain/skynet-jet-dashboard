import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

// icons
const icons = {
    PhotoLibraryIcon,
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const brands = {
    id: 'brands',
    title: 'Brands',
    type: 'group',
    children: [
        {
            id: 'brands',
            title: 'Brands',
            type: 'item',
            url: '/brands',
            icon: icons.PhotoLibraryIcon
        }
    ]
};

export default brands;
