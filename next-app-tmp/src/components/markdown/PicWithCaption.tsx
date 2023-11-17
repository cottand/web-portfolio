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
        /> :
        <div
            css={css`padding-top: 40px;
              width: 100%;
              padding-bottom: 40px;
            `}
            className="centered border-radius"
        >
            <img
                alt=""
                css={css`
                  width: min(99%, 700px);
                  padding-bottom: 10px;
                  border-radius: 5px;
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
                `}
                {...props}
            />
            <Typography variant="caption" component={"figcaption"} align={"center"}>
                {props.caption}
            </Typography>
        </div>
