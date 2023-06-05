/** @jsxImportSource @emotion/react */
import React, {FC, Fragment, useEffect, useState} from "react";
import {AppBar, Tab, Tabs} from "@mui/material";
import {css} from "@emotion/react";
import {BrowserRouter, useHref, useLocation, useNavigate} from "react-router-dom";
import {Projects} from "./pages/projects";
import {About} from "./pages/about";
import {Blog} from "./pages/blog";
import {TabPanel} from "./tabPanel";
import Handyman from "@mui/icons-material/Handyman";
import EmojiPeople from "@mui/icons-material/EmojiPeople";
import ChatBubble from "@mui/icons-material/ChatBubble";

const LinkTab: FC<{ icon: React.ReactElement, label: string; href: string }> = (props) => {
    const navigate = useNavigate();
    return <Tab
        css={css`color: white`}
        component="a"
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            event.preventDefault();
            navigate(props.href)
        }}
        {...props}
    />
        ;
}


export function NavBar() {
    const [value, setValue] = React.useState(fromPathToIndex(useLocation().pathname));

    const [fullWidth, setfullWidth] = useState(window.innerWidth < 550);
    const updater = () => setfullWidth(window.innerWidth < 550);
    useEffect(() => {
            window.addEventListener("resize", updater);
            return () => window.removeEventListener("resize", updater);
        }
    );

    function fromPathToIndex(path: string): number {
        switch (path) {
            case "/about":
                return 0;
            case "/projects":
                return 1;
            case "/blog":
                return 2;
            default:
                if (path.includes("/blog")) return 2;
                return 0;
        }
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    };
    return (
        <Fragment>
            <AppBar position={"static"} color={"transparent"}
                    css={css`box-shadow: none;
                      width: 100%;`}
            >
                <Tabs value={value} onChange={handleChange} textColor={"primary"} indicatorColor={"primary"}
                      variant={fullWidth ? "fullWidth" : undefined}
                      centered={true}>
                    <LinkTab label={"About"} icon=<EmojiPeople/> href={"/about"}/>
                    <LinkTab label={"Projects"} icon=<Handyman/> href={"/projects"}/>
                    <LinkTab label={"Blog"} icon=<ChatBubble/> href={"/blog"}/>
                </Tabs>

            </AppBar>
            <Fragment>
                <TabPanel value={value} index={0}><About/></TabPanel>
                <TabPanel value={value} index={1} keepMountedOnHide={false}><Projects/></TabPanel>
                <TabPanel value={value} index={2}><Blog/></TabPanel>
            </Fragment>
        </Fragment>
    )
}

