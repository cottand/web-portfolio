/** @jsxImportSource @emotion/react */

import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Link, {LinkProps} from '@mui/material/Link';
import ListItem, {ListItemProps} from '@mui/material/ListItem';
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
    useLocation, BrowserRouter, createBrowserRouter, RouterProvider, Outlet, defer, Params,
} from 'react-router-dom';
import {About} from "./components/pages/about";
import {Grid, ListItemButton} from "@mui/material";
import {Blog, BlogEntriesList, BlogEntry, markdownBlogEntries} from "./components/pages/blog";
import Projects from "./components/pages/projects";
import {css} from "@emotion/react";
import {ChangeColorButton} from "./components/colorToggle";
import {Fragment} from "react";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {findMarkdownFileFromId} from "./components/projectPanels";
import {ProjPage} from "./components/pages/projPage";

interface ListItemLinkProps extends ListItemProps {
    to: string;
    open?: boolean;
}

const breadcrumbNameMap: { [key: string]: string } = {
    '/projects': 'Projects',
    '/blog': 'Blog',
};

interface LinkRouterProps extends LinkProps {
    to: string;
    replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => <Link {...props} component={RouterLink as any}/>;

const Page = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const fontProps = {fontSize: 22}

    return (
        <Grid container spacing={0}
              alignItems={"left"}
              justifySelf={"center"}
              direction={"row"}
              sx={{m: 1}}
        >
            <Grid item xs={2}>
                <ChangeColorButton/>
            </Grid>
            <Grid item xs={10}>
                <Breadcrumbs aria-label="breadcrumb" css={css`padding-bottom: 12px`}>
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
            </Grid>
        </Grid>
    );
};


const Layout = () => <Fragment>
    <Box sx={{display: 'flex', flexDirection: 'column', width: 360}}>
        <Page/>
    </Box>
    <Outlet/>
</Fragment>

const blogChildren = markdownBlogEntries.map(e => {
        const loader = async function () {
                return defer({
                        content: fetch(e.file).then(r => r.text())
                    }
                )
            }
        return {path: "blog/" + e.ref, element: <BlogEntry file={e.file}/>, loader: loader};
    }
)

const projectLoader: (args: {params: Params<string>}) => Promise<unknown> = async ({ params }) => {
    const md = findMarkdownFileFromId(params["projectId"] ?? "TODO") ?? "TODO2"
    return defer({
            content: fetch(md).then(r => r.text())
        }
    );
}

const router = createBrowserRouter([
    {
        Component: Layout,
        children: [
            {path: "*", element: <About/>},
            {path: "blog", element: <BlogEntriesList/>},
            {path: "projects", element: <Projects/>},
            {path: "projects/:projectId", element: <ProjPage gh={""} markdown={""}/>, loader: projectLoader},
        ].concat(blogChildren),
    },
], { future: { v7_fetcherPersist: true }})

export const Root = () => <RouterProvider router={router}/>
