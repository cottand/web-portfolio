
import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Link, { LinkProps } from '@mui/material/Link';
import ListItem, { ListItemProps } from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import {
  Link as RouterLink,
  Route,
  Routes,
  MemoryRouter,
  useLocation,
} from 'react-router-dom';
import {About} from "./components/pages/about";
import {ListItemButton} from "@mui/material";
import {Blog} from "./components/pages/blog";
import Projects from "./components/pages/projects";

interface ListItemLinkProps extends ListItemProps {
  to: string;
  open?: boolean;
}

const breadcrumbNameMap: { [key: string]: string } = {
  '/projects': 'Projects',
  '/blog': 'Blog',
  '/blog/important': 'Important',
};

function ListItemLink(props: ListItemLinkProps) {
  const { to, open, ...other } = props;
  const primary = breadcrumbNameMap[to];

  let icon = null;
  if (open != null) {
    icon = open ? <ExpandLess /> : <ExpandMore />;
  }

  return (
    <li>
      <ListItemButton component={RouterLink as any} to={to} {...other}>
        <ListItemText primary={primary} />
        {icon}
      </ListItemButton>
    </li>
  );
}

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => <Link {...props} component={RouterLink as any}/>;

const Page = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const fontProps = { fontSize: 22 }

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <LinkRouter underline="hover" color="inherit" to="/">
        <Typography {...fontProps}>
          Nico D'Cotta
        </Typography>
      </LinkRouter>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography color="text.primary" key={to} {...fontProps}>
            {breadcrumbNameMap[to]}
          </Typography>
        ) : (
          <LinkRouter underline="hover" color="inherit" to={to} key={to} {...fontProps}>
            {breadcrumbNameMap[to]}
          </LinkRouter>
        );
      })}
    </Breadcrumbs>
  );
};

export default function RouterBreadcrumbs() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <MemoryRouter initialEntries={['/about']} initialIndex={0}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: 360 }}>
        <Routes>
          <Route path="*" element={<Page />} />
        </Routes>
      </Box>
      <Routes>
        <Route path={"/"} element={<About/>}/>
        <Route path={"blog/*"} element={<Blog/>}/>
        <Route path={"projects/*"} element={<Projects/>}/>
      </Routes>
    </MemoryRouter>
  );
}
