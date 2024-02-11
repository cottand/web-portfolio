/** @jsxImportSource @emotion/react */
import {FC, ImgHTMLAttributes, Suspense, useState} from "react";
import {Typography} from "@mui/material";
import {css} from "@emotion/react";
import {Spinner} from "../spinner";
import {Await} from "react-router-dom";

export const PicWithCaption: FC<{ caption?: string } & ImgHTMLAttributes<HTMLImageElement>> = (props) => {
    const [imageSourceUrl, setImageSourceUrl] = useState("");

    return (props.caption === undefined) ?
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
        ><Suspense fallback={<Spinner/>}>
            <Await resolve={fetch(props.src ?? "").then(it => it.blob())}>{(pic) =>
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
                    src={URL.createObjectURL(pic)}
                    {...props}
                />
            }
                </Await>
                </Suspense>
                <Typography variant="caption" component={"figcaption"} align={"center"}>
                {props.caption}
            </Typography>
        </div>;
}
