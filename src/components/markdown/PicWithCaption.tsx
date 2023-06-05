/** @jsxImportSource @emotion/react */
import {FC} from "react";
import {Typography} from "@mui/material";
import {css} from "@emotion/react";

export const PicWithCaption: FC<{ caption?: string }> = (props) =>
    (props.caption === undefined) ?
        <img
            alt=""
            className={"centered border-radius"}
            css={css`
              padding-top: 40px;
              padding-bottom: 40px;
              //width: min(95%, 700px);
              //max-height: 400px;
              border-radius: 5px;
            `}
            {...props}
        />
        :
        <figure
            css={
                css`padding-top: 40px;
                  padding-bottom: 40px;
                  align-content: center`}>
            <img
                alt=""
                className="centered border-radius"
                css={css`
                  width: min(99%, 700px);
                  padding-bottom: 10px
                `}
                {...props}
            />
            <Typography variant="caption" component={"figcaption"} align={"center"}>
                {props.caption}
            </Typography>
        </figure>