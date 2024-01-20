/** @jsxImportSource @emotion/react */
import React, {FC} from "react";
// import {MdRenderer} from "../markdown/MdFile";
import {css} from "@emotion/react";
import {MdRenderer} from "../markdown/MdFile";
// noinspection HtmlUnknownAttribute
export const BlogEntry: FC<{ file: string }> = (props) =>
    <div css={css`padding: 20px`}>
        <MdRenderer foldCode={true} extendGhm={true} makeAnchors={true} {...props}/>
    </div>
