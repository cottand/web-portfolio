/** @jsxImportSource @emotion/react */

import * as React from 'react';
import {createRef, Fragment, useEffect} from 'react';
import Box from '@mui/material/Box';
import Link, {LinkProps} from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import {
    createBrowserRouter,
    defer,
    Link as RouterLink,
    Params,
    RouterProvider,
    useLocation, useOutlet,
} from 'react-router-dom';
import {Fade, Grid, Zoom} from "@mui/material";
import {css} from "@emotion/react";
import {ChangeColorButton} from "./components/colorToggle";
import {projectFromId} from "./components/projectPanels";
import {blogFromRef} from "./components/const/markdownBlogEntries";
import {SwitchTransition} from "react-transition-group";


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

    useEffect(() => {
        fetch('https://web.dcotta.com/s-web-portfolio/api/browse', {
            method: 'POST',
            body: JSON.stringify({url: location.pathname})
        }).then(r => {
        })
    }, [location]);

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


const Layout = () => {
    const outlet = useOutlet()
    const {nodeRef} = mainRoutes.find((route) => route.path === location.pathname) ?? {}
    return <Fragment>
        <Box sx={{display: 'flex', flexDirection: 'column', width: 360}}>
            <Page/>
        </Box>
        <SwitchTransition>
            <Fade
                key={useLocation().pathname}
                // @ts-ignore
                nodeRef={nodeRef as any}
                timeout={100}
            >
                <div ref={nodeRef as any} className="page">
                    {outlet}
                </div>
            </Fade>
        </SwitchTransition>
    </Fragment>;
}

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
    {
        path: "/",
        nodeRef: createRef(),
        lazy: async () =>
            ({Component: await import("./components/pages/about").then(c => c.About)}),
    },
    {
        path: "projects",
        lazy: async () =>
            ({Component: await import("./components/pages/projects").then(c => c.Projects)}),
    },
    {
        path: "blog",
        lazy: async () =>
            ({Component: await import("./components/pages/blog").then(c => c.BlogEntriesList)}),
    },
    {
        path: "projects/:projectId",
        lazy: async () =>
            ({Component: await import("./components/pages/projPage").then(c => c.ProjPage)}),
        // element: <ProjPage/>,
        loader: projectLoader,
    },
    {
        path: "blog/:blogId",
        lazy: async () =>
            ({Component: await import("./components/pages/blogPage").then(c => c.BlogEntry)}),
        loader: blogLoader,
    },
];
const router = createBrowserRouter([
    {
        Component: Layout,
        // children: [...mainRoutes]
        children: mainRoutes.map((route) => ({
            index: route.path === '/',
            path: route.path === '/' ? undefined : route.path,
            nodeRef: createRef(),
            loader: route.loader,
            lazy: route.lazy,
        }))
    },
], {future: {v7_fetcherPersist: true}})

export const Root = () => <RouterProvider router={router}/>
