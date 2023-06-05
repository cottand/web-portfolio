
import React, {FC} from 'react';
import logo from '../logo.svg';

const PageShell: (c: FC) => FC = (Page) => {
    return props =>
    <div >
        <Page {...props} />
    </div>;
};

export default PageShell;