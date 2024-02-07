/** @jsxImportSource @emotion/react */

import * as React from 'react';
import {Fragment} from 'react';
import Box from '@mui/material/Box';
import Link, {LinkProps} from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import {
    createBrowserRouter,
    defer,
    Link as RouterLink,
    Outlet,
    Params,
    RouterProvider,
    useLocation,
} from 'react-router-dom';
import {About} from "./components/pages/about";
import {Grid} from "@mui/material";
import {css} from "@emotion/react";
import {ChangeColorButton} from "./components/colorToggle";
import {projectFromId} from "./components/projectPanels";
import markdownBlogEntries, {blogFromRef} from "./components/const/markdownBlogEntries";


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
                        const breadcrumbName = breadcrumbNameMap[to] ?? "";

                        return last ? (
                            <Typography color="text.primary" key={to} {...fontProps}>
                                {breadcrumbName}
                            </Typography>
                        ) : (
                            <LinkRouter underline="hover" color="inherit" to={to} key={to} {...fontProps}>
                                {breadcrumbName}
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

// const blogChildren = markdownBlogEntries.map(e => {
//         const loader = async function () {
//             return defer({
//                     content: fetch(e.file).then(r => r.text())
//                 }
//             )
//         }
//         return {
//             path: "blog/" + e.ref,
//             async lazy() {
//                 let {BlogEntry} = await import("./components/pages/blogPage");
//                 return {element: <BlogEntry file={e.file}/>};
//             },
//             loader: loader,
//         };
//     }
// )

const blogLoader: (args: { params: Params<string> }) => Promise<unknown> = async ({params}) => {
    const b = blogFromRef(params["blogId"] ?? "")
    return defer({
            content: fetch(b?.file ?? "").then(r => r.text()),
        }
    );
}
const projectLoader: (args: { params: Params<string> }) => Promise<unknown> = async ({params}) => {
    const p = projectFromId(params["projectId"] ?? "")
    return defer({
            content: fetch(p?.markdown ?? "").then(r => r.text()),
        }
    );
}

let mainRoutes = [
    {path: "*", element: <About/>},
    {
        path: "projects",
        lazy: async () => {
            let {Projects} = await import("./components/pages/projects");
            return {Component: Projects};
        }
    },
    {
        path: "blog",
        lazy: async () => {
            let {BlogEntriesList} = await import("./components/pages/blog");
            return {Component: BlogEntriesList};
        }
    },
    {
        path: "projects/:projectId",
        async lazy() {
            let {ProjPage} = await import("./components/pages/projPage");
            return {Component: ProjPage};
        },
        // element: <ProjPage/>,
        loader: projectLoader,
    },
    {
        path: "blog/:blogId",
        async lazy() {
            let {BlogEntry} = await import("./components/pages/blogPage");
            return {Component: BlogEntry};
        },
        loader: blogLoader,
    },
];
const router = createBrowserRouter([
    {
        Component: Layout,
        children: [...mainRoutes]
    },
], {future: {v7_fetcherPersist: true}})

export const Root = () => <RouterProvider router={router}/>
