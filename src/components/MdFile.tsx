/** @jsxImportSource @emotion/react */
import {FC, useCallback, useEffect, useMemo, useState} from "react";
import ReactMarkdown from "react-markdown";
import {Util} from "../util";
import rehypeRaw from "rehype-raw";
import {Prism as SyntaxHighlighter, SyntaxHighlighterProps} from 'react-syntax-highlighter'
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {css} from "@emotion/react";
import {
    Accordion,
    AccordionDetails,
    AccordionProps,
    AccordionSummary,
    AccordionSummaryProps,
    styled,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const MdRenderer: FC<{ file: string, foldCode: boolean }> = ({foldCode, file}) => {
    const makemSourceRequest = useCallback(
        () => fetch(file).then((r) => r.text()),
        [file]
    )
    const [content, setContent] = useState<string>("")
    useEffect(() => {
        const req = makemSourceRequest();
        if (!req) return
        req.then(setContent);
    }, [makemSourceRequest])


    return useMemo(() => (
        <ReactMarkdown
            css={css`font-size: 15px;`}
            components={{
                a: Util.mdAsMuiLink,
                img: Util.pictureWithPadding,
                code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    const filenameMatch = /# file: (.+) #/.exec(String(children) || '')
                    console.log(filenameMatch)
                    return !inline && match ? (
                        <FoldingHighlighter
                            foldCode={foldCode}
                            children={String(children).replace(/\n$/, '')}
                            filename={filenameMatch ? filenameMatch[1] : undefined}
                            // @ts-ignore
                            style={atomDark}
                            css={css`font-size: 12px`}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        />
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                }
            }}
            rehypePlugins={[rehypeRaw]}
            children={content}
        />

    ), [content, foldCode])
};

const FoldingHighlighter: FC<SyntaxHighlighterProps & { filename?: string, foldCode: boolean }> = (props) => {

    const [expanded, setExpanded] = useState(true)
    if (!props.foldCode) return <SyntaxHighlighter {...props}/>;

    return <CodeAccordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <CodeAccordionSummary
            expandIcon={<ExpandMoreIcon sx={{fontSize: '0.9rem'}}/>}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography fontSize={13}
                        fontFamily={'Fira Code'}>{props.filename ? props.filename : "code block"}</Typography>
        </CodeAccordionSummary>
        <AccordionDetails css={css`padding: 0;
          height: min-content`}>
            <SyntaxHighlighter {...props}/>
        </AccordionDetails>

    </CodeAccordion>
}

const CodeAccordion = styled((props: AccordionProps) => (
    <Accordion disableGutters elevation={0} square {...props} />
))(({theme}) => ({
    border: `0px solid ${theme.palette.divider}`,
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
