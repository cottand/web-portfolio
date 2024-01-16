/** @jsxImportSource @emotion/react */
import React, {FC, Fragment, lazy, Suspense} from "react";
import {AppBar, Tab, Tabs} from "@mui/material";
import {css} from "@emotion/react";
import {Route, Routes, useLocation, useMatch, useNavigate} from "react-router-dom";
import {About} from "./pages/about";
import {Blog} from "./pages/blog";
import {TabPanel} from "./tabPanel";
import Handyman from "@mui/icons-material/Handyman";
import EmojiPeople from "@mui/icons-material/EmojiPeople";
import ChatBubble from "@mui/icons-material/ChatBubble";
import {Header} from "./header";
import {Spinner} from "./spinner";

const LinkTab: FC<{ icon: React.ReactElement, label: string; href: string }> = (props) => {
    const navigate = useNavigate();
    return <Tab
        disableRipple
        css={css`
            //color: white;
            text-transform: lowercase;
            //justify-content: left
        `}
        iconPosition={"start"}
        component="span"
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            event.preventDefault();
            navigate(props.href)
        }}
        {...props}
    />
        ;
}

const Projects = lazy(() => import("./pages/projects"))

export function NavBar() {
    const [value, setValue] = React.useState(fromPathToIndex(useLocation().pathname));

    function fromPathToIndex(path: string): number {
        switch (path) {
            case "/#/about":
            case "/about/":
            case "/about":
                return 0;
            case "/#/blog":
            case "/#/blog/":
            case "/blog":
            case "/blog/":
                return 1;
            case "/projects":
            case "/projects/":
            case "/#/projects":
                return 2;
            default:
                if (path.includes("/blog")) return 1;
                return 0;
        }
    }

    function indexToPath(index: number): string {
        switch (index) {
            case 0:
                return "about";
            case 1: return "projects";
            case 2: return "blog";
            default:
                return "about";
        }
    }

    const nav = useNavigate()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        event.preventDefault()
        setValue(newValue)
    };
    return (
        <Fragment>
            <Header/>
            <AppBar position={"static"} color={"transparent"}
                    css={css`
                        box-shadow: none;
                        width: 100%;
                    `}
            >
                <Tabs value={value} onChange={handleChange} textColor={"primary"} indicatorColor={"primary"}
                      variant={"fullWidth"}
                      centered={true}
                      css={css`
                          & .MuiTabs-indicator {
                              justify-content: center;
                              place-content: center;
                              // a hack
                              margin-left: 13%;
                              margin-right: 13%;
                              max-width: 60px;
                              height: 4px;
                          }

                      `}
                >
                    <LinkTab label={"About"} icon=<EmojiPeople/> href={"/about"}/>
                    <LinkTab label={"Blog"} icon=<ChatBubble/> href={"/blog"}/>
                    <LinkTab label={"Projects"} icon=<Handyman/> href={"/projects"}/>
                </Tabs>

            </AppBar>
            <Suspense fallback={<Spinner/>}>
                <Fragment>
                    <TabPanel value={value} index={0}><About/></TabPanel>
                    <TabPanel value={value} index={1}><Blog/></TabPanel>
                    <TabPanel value={value} index={2} keepMountedOnHide={false}><Projects/></TabPanel>
                </Fragment>
            </Suspense>
        </Fragment>
    )
}

