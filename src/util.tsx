import {Link} from "@mui/material";

export abstract class Util {
    static mdAsMuiLink = ({ ...props}) => <Link {...props}></Link>;
}
