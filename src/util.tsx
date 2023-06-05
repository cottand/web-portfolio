/** @jsxImportSource @emotion/react */
import {Link} from "@mui/material";
import {css} from "@emotion/react";
import {FC} from "react";

export abstract class Util {
    static mdAsMuiLink = ({...props}) => <Link {...props}></Link>;
    static pictureWithPadding = ({...props}) => <PicWithCaption {...props}></PicWithCaption>
}

export const PicWithCaption: FC<{ caption?: string }> = (props) => {
    if (props.caption === undefined)
        return <img
            alt=""
            className={"centered border-radius"}
            css={
                css`padding: 50px;
                  width: min(95%, 700px)`}
            {...props}
        />
    return <figure css={css`padding: 50px;
      align-content: center`}>

        <img
            alt=""
            className="centered border-radius"
            css={css`
              width: min(95%, 700px);
              padding-bottom: 10px
            `}
            {...props}
        />
        <figcaption
            // @ts-ignore
            align={"center"}
        ><i>{props.caption}</i></figcaption>
    </figure>
}
