/** @jsxImportSource @emotion/react */
import React, {FC, useState} from "react";
import {Prism as SyntaxHighlighter, SyntaxHighlighterProps} from "react-syntax-highlighter";
import {
    Accordion,
    AccordionDetails,
    AccordionProps,
    AccordionSummary,
    AccordionSummaryProps,
    Card,
    CardContent,
    styled,
    Typography,
    useTheme
} from "@mui/material";
import {css} from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const FoldingHighlighter: FC<{
    filename?: string,
    foldCode: boolean,
    highlighting: SyntaxHighlighterProps
}> = (props) => {

    const theme = useTheme()
    const cardBg = theme.palette.mode === 'light' ? theme.palette.grey["900"] : null
    const [expanded, setExpanded] = useState(true)
    if (!props.foldCode)
        return <Card elevation={4} sx={{bgcolor: cardBg}}><CardContent>
            <SyntaxHighlighter {...props.highlighting}/>
        </CardContent></Card>

    return <Card>
        <CodeAccordion
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
            css={css`
                border: none;
                background-color: transparent;
            `}
        >
            <CodeAccordionSummary
                expandIcon={<ExpandMoreIcon sx={{fontSize: '1rem'}}/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography fontSize={15}
                            fontFamily={'Fira Code'}>{props.filename ? props.filename : "code block"}</Typography>
            </CodeAccordionSummary>
            <AccordionDetails css={css`
                padding: 6px 0 0;
                height: min-content`}>
                <Card elevation={3} sx={{bgcolor: cardBg}}>
                    <CardContent>
                        <SyntaxHighlighter {...props.highlighting}/>
                    </CardContent>
                </Card>
            </AccordionDetails>

        </CodeAccordion>
    </Card>
}

const CodeAccordion = styled((props: AccordionProps) => (
    <Accordion disableGutters elevation={0} {...props} />
))(({theme}) => ({
    border: `3px solid ${theme.palette.background.default}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));


const CodeAccordionSummary = styled((props: AccordionSummaryProps) =>
    <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{fontSize: '0.9rem'}}/>}
        {...props}
    />
)(({theme}) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-collapsed': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
        color: theme.palette.text.primary
        // marginLeft: theme.spacing(1),
    },
}));
