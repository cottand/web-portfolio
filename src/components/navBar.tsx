/** @jsxImportSource @emotion/react */
import React, {FC, Fragment} from "react";
import {AppBar, Tab, Tabs} from "@mui/material";
import {css} from "@emotion/react";
import {useLocation} from "react-router-dom";
import {Projects} from "./projects";
import {About} from "./about";
import {Blog} from "./blog";
import {TabPanel} from "./tabPanel";

const LinkTab: FC<{label: string; href: string}> = (props) => (
    <Tab
        css={css`color: white`}
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // event.preventDefault();
      }}
      {...props}
    />
  );


export function NavBar() {
    const [value, setValue] = React.useState(fromPathToIndex(useLocation().pathname));

    function fromPathToIndex(path: string): number {
        switch (path) {
            case "/about":
                return 0;
            case "/projects":
                return 1;
            case "/blog":
                return 2;
            default:
                return 0;
        }
    }
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {setValue(newValue)};

    return (
        <Fragment>
            <AppBar position={"static"} color={"transparent"}
                    css={css`box-shadow: none;width: 100%;`}
            >
                <Tabs value = {value} onChange={handleChange} textColor={"primary"} indicatorColor={"primary"} centered={true}>
                    <LinkTab label={"About"} href={"/#/about"}/>
                    <LinkTab label={"Projects"} href={"/#/projects"}/>
                    <LinkTab label={"Blog"} href={"/#/blog"}/>
                </Tabs>

            </AppBar>
            <Fragment>
                <TabPanel value={value} index={0}><About/></TabPanel>
                <TabPanel value={value} index={1}><Projects/></TabPanel>
                <TabPanel value={value} index={2}><Blog/></TabPanel>
            </Fragment>
        </Fragment>
    )
}

