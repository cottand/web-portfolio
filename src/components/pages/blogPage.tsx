/** @jsxImportSource @emotion/react */
import React, {FC} from "react";
import {css} from "@emotion/react";
import {MdRenderer} from "../markdown/MdFile";
import {useParams} from "react-router-dom";
import {blogFromRef} from "../const/markdownBlogEntries";
import {Typography} from "@mui/material";
import {RepeatingBar} from "../repeatingBar";
// noinspection HtmlUnknownAttribute
export const BlogEntry: FC = (props) => {
    let blogRef = useParams<{blogId: string}>().blogId
    let blog = blogFromRef(blogRef)
    return <div css={css`padding: 20px`}>
        <Typography variant={"h3"}>{blog?.title}</Typography>
        <RepeatingBar/>
        <MdRenderer foldCode={true} extendGhm={true} makeAnchors={true} {...props}/>
    </div>
}
