/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import React, {FC} from "react";
import {
    Card,
    Grid,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import {Email, GitHub, LinkedIn, SaveAlt} from "@mui/icons-material";
import {Link as RouterLink} from "react-router-dom";

export const About: FC = () => {
    return <div css={css`width: 100%`}>
        <Card elevation={0}
              css={css`
                  top: 50%;
                  padding: 50px;
                  border-width: 10px;
                  border-radius: 0px;
                  background-color: transparent;
              `}>
            <Card elevation={0}
                  css={css`
                      text-align: center;
                      margin-bottom: 50px;
                  `}>

                <Typography variant={"h4"}>Hi</Typography>
                <br/>
                <Typography fontSize={20}>
                    I work as a senior backend software engineer at <Link
                    href={"https://monzo.com"}>Monzo</Link>, building products customers love.
                    <br/>
                    <br/>
                    I enjoy building things, music, bouldering, and kite surfing.
                </Typography>
            </Card>


            <Grid container spacing={0}
                  alignItems={"center"}
                  justifySelf={"center"}
                  direction={"row"}
                  justifyContent={"center"}
            >
                <Grid item xs={4}>
                    <ListItem disablePadding divider={true}>
                        <ListItemButton component={RouterLink as any} to={"/blog"}>
                            <ListItemText primary={"read blog"} primaryTypographyProps={{align: "center"}}/>
                            {/*{icon}*/}
                        </ListItemButton>
                    </ListItem>
                </Grid>
                <Grid item xs={1} flexGrow={0}>
                    <ListItem disablePadding>
                        <ListItemText primary={""} primaryTypographyProps={{align: "center"}}/>
                    </ListItem>
                </Grid>
                <Grid item xs={4}>
                    <ListItem disablePadding divider={true}>
                        <ListItemButton component={RouterLink as any} to={"/projects"}>
                            <ListItemText primary={"see projects"} primaryTypographyProps={{align: "center"}}/>
                            {/*{icon}*/}
                        </ListItemButton>
                    </ListItem>
                </Grid>
            </Grid>
            <Grid container spacing={0}
                  alignItems={"center"}
                  justifySelf={"center"}
                  direction={"column"}
            >
                <Grid item xs={8}>
                    <List component={"nav"}>
                        <ListItem disablePadding>
                            <ListItemButton component={"a"} href={"https://github.com/cottand"}>
                                <ListItemIcon><GitHub/></ListItemIcon>
                                <ListItemText>github.com/cottand</ListItemText>
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><Email/></ListItemIcon>
                            <ListItemText>nico (at) dcotta.com</ListItemText>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={"a"} href={"https://www.linkedin.com/in/ndcotta/"}>
                                <ListItemIcon><LinkedIn/></ListItemIcon>
                                <ListItemText>linkedin.com/in/ndcotta</ListItemText>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={"a"}
                                            href={"https://github.com/Cottand/resume/raw/master/out/nicoDCottaResume.pdf"}>
                                <ListItemIcon><SaveAlt/></ListItemIcon>
                                <ListItemText>download resumé</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </List>

                </Grid>
            </Grid>
        </Card>
    </div>;
};
