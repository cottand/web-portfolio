/** @jsxImportSource @emotion/react */
'use client'
import React, {FC, Fragment} from "react";
import {AppBar, Tab, Tabs} from "@mui/material";
import {css} from "@emotion/react";
import {Projects} from "../app/projects/page";
import {About} from "./pages/about";
import {Blog} from "./pages/blog";
import {TabPanel} from "./tabPanel";
import Handyman from "@mui/icons-material/Handyman";
import EmojiPeople from "@mui/icons-material/EmojiPeople";
import ChatBubble from "@mui/icons-material/ChatBubble";
import {Header} from "./header";
import {usePathname, useRouter} from "next/navigation";
import ReactMarkdown from "react-markdown";
import children = ReactMarkdown.propTypes.children;

const LinkTab: FC<{ icon: React.ReactElement, label: string; href: string }> = (props) => {
    // const navigate = useNavigate();
    const router = useRouter()
    return <Tab
        disableRipple
        css={css`
          //color: white;
          text-transform: lowercase;
          //justify-content: left
        `}
        iconPosition={"start"}
        component="span"
        onClick={(event: React.MouseEvent<any, MouseEvent>) => {
            event.preventDefault();
            // navigate(props.href)
            router.push(props.href)
        }}
        {...props}
    />
        ;
}


export const NavBar = (props: {children: React.ReactNode}) => {
    const [value, setValue] = React.useState(fromPathToIndex(usePathname()));

    function fromPathToIndex(path: string): number {
        switch (path) {
            case "/#/about":
            case "/about/":
            case "/about":
                return 0;
            case "/#/blog":
            case "/blog":
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

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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
            <Fragment>
                {props.children}
                {/*<TabPanel value={value} index={0}><About/></TabPanel>*/}
                {/*<TabPanel value={value} index={1}><Blog/></TabPanel>*/}
                <TabPanel value={value} index={2} keepMountedOnHide={true}><Projects/></TabPanel>
            </Fragment>
        </Fragment>
    )
};

