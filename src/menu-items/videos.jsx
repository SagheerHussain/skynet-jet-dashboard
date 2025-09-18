import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';

// icons
const icons = {
    SlowMotionVideoIcon,
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const videos = {
    id: 'videos',
    title: 'Videos',
    type: 'group',
    children: [
        {
            id: 'videos',
            title: 'Videos',
            type: 'item',
            url: '/videos',
            icon: icons.SlowMotionVideoIcon
        }
    ]
};

export default videos;
