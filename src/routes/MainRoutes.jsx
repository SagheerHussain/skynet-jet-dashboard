import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ViewJets from '../pages/jets/ViewJets';
import ViewTeam from '../pages/team/ViewTeam';
import ViewTestimonials from '../pages/testimonials/ViewTestimonials';
import ContactInfo from '../pages/contact/ContactInfo';
import ViewBrands from '../pages/brands/ViewBrands';
import ViewBlogs from '../pages/blogs/ViewBlogs';
import AddJet from '../pages/jets/AddJet';
import EditJet from '../pages/jets/Editjet';
import AddBrand from '../pages/brands/AddBrand';
import EditBrand from '../pages/brands/EditBrand';
import AddTestimonial from '../pages/testimonials/AddTestimonial';
import EditTestimonial from '../pages/testimonials/EditTestimonial';
import AddContact from '../pages/contact/AddContact';
import EditContact from '../pages/contact/EditContact';
import AddTeam from '../pages/team/AddTeam';
import EditTeam from '../pages/team/EditTeam';
import AddVideo from '../pages/videos/AddVideo';
import ViewVideos from '../pages/videos/ViewVideos';
import EditVideo from '../pages/videos/EditVideo';
import AddBlog from '../pages/blogs/AddBlog';
import EditBlog from '../pages/blogs/EditBlog';
import ViewJetCategories from '../pages/jets/ViewJetCategories';
import AddAircraftCategory from '../pages/jets/AddAircraftCategory';
import EditJetCategory from '../pages/jets/EditJetCategory';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'jets',
      element: <ViewJets />
    },
    {
      path: 'jets/add',
      element: <AddJet />
    },
    {
      path: 'jets/edit/:id',
      element: <EditJet />
    },
    {
      path: 'jets-categories',
      element: <ViewJetCategories />
    },
    {
      path: 'jets-categories/add',
      element: <AddAircraftCategory />
    },
    {
      path: 'jets-categories/edit/:id',
      element: <EditJetCategory />
    },
    {
      path: 'teams',
      element: <ViewTeam />
    },
    {
      path: 'teams/add',
      element: <AddTeam />
    },
    {
      path: 'teams/edit/:id',
      element: <EditTeam />
    },
    {
      path: 'testimonials',
      element: <ViewTestimonials />
    },
    {
      path: 'testimonials/add',
      element: <AddTestimonial />
    },
    {
      path: 'testimonials/edit/:id',
      element: <EditTestimonial />
    },
    {
      path: 'contact',
      element: <ContactInfo />
    },
    {
      path: 'contact/add',
      element: <AddContact />
    },
    {
      path: 'contact/edit/:id',
      element: <EditContact />
    },
    {
      path: 'brands',
      element: <ViewBrands />
    },
    {
      path: 'brands/add',
      element: <AddBrand />
    },
    {
      path: 'brands/edit/:id',
      element: <EditBrand />
    },
    {
      path: 'blogs',
      element: <ViewBlogs />
    },
    {
      path: 'blogs/add',
      element: <AddBlog />
    },
    {
      path: 'blogs/edit/:id',
      element: <EditBlog />
    },
    {
      path: 'videos',
      element: <ViewVideos />
    },
    {
      path: 'videos/add',
      element: <AddVideo />
    },
    {
      path: 'videos/edit/:id',
      element: <EditVideo />
    },
  ]
};

export default MainRoutes;
