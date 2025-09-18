import EditNoteIcon from '@mui/icons-material/EditNote';

// icons
const icons = {
    EditNoteIcon,
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const blogs = {
    id: 'blogs',
    title: 'Blogs',
    type: 'group',
    children: [
        {
            id: 'blogs',
            title: 'Blogs',
            type: 'item',
            url: '/blogs',
            icon: icons.EditNoteIcon
        }
    ]
};

export default blogs;
