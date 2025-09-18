import GroupsIcon from '@mui/icons-material/Groups';

// icons
const icons = {
    GroupsIcon,
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const teams = {
    id: 'teams',
    title: 'Teams',
    type: 'group',
    children: [
        {
            id: 'teams',
            title: 'Teams',
            type: 'item',
            url: '/teams',
            icon: icons.GroupsIcon
        }
    ]
};

export default teams;
