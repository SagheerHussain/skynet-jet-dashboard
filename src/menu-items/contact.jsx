import CallIcon from '@mui/icons-material/Call';

// icons
const icons = {
    CallIcon,
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const testimonials = {
    id: 'contacts',
    title: 'Contacts',
    type: 'group',
    children: [
        {
            id: 'contacts',
            title: 'Contacts',
            type: 'item',
            url: '/contact',
            icon: icons.CallIcon
        }
    ]
};

export default testimonials;
