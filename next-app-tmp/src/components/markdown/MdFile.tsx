/** @jsxImportSource @emotion/react */
import {FC, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {Prism as SyntaxHighlighter, SyntaxHighlighterProps} from 'react-syntax-highlighter'
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {css} from "@emotion/react";
import remarkGfm from 'remark-gfm'
import {
    Accordion,
    AccordionDetails,
    AccordionProps,
    AccordionSummary,
    AccordionSummaryProps, Card, CardContent, Link,
    styled,
    Typography, useTheme
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {PicWithCaption} from "./PicWithCaption";
import {HeadingProps} from "react-markdown/lib/ast-to-react";
import {Util} from "@/app/util";

const withoutWhitespace = (s: string) => s.replaceAll(" ", "")


const HWithAnchor: FC<{ children: ReactNode, href: ReactNode | undefined }> = (props) => {

    const href = props.href ? withoutWhitespace(props.href.toString()) : ""
    return <>
        <a id={href}></a>
        {/*<Link href={`#${href}`}>mylink</Link>*/}
        {props.children}
    </>
}

export const MdRenderer: FC<{ file: string, foldCode: boolean, extendGhm?: boolean }> =
    ({
         foldCode,
         file,
         extendGhm
     }) => {
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
                css={css`
                  font-size: 17px;
                  font-family: Roboto, serif;

                  h1 {
                    font-weight: normal;
                  }

                  h2 {
                    font-weight: normal;
                  }

                  h3 {
                    font-weight: normal;
                  }

                  strong {
                    font-weight: 500;
                  }
                `}
                components={{
                    a: Util.mdAsMuiLink,
                    img: (props) => <PicWithCaption {...props}/>,
                    // h1: (props) => <h1 {...props}></h1>,
                    // @ts-ignore
                    h2: (props) => <HWithAnchor href={props.children[0]}><h2 {...props}></h2></HWithAnchor>,
                    h3: (props) => <h3 {...props}></h3>,
                    code: ({node, inline, className, children, ...props}) => {
                        const match = /language-(\w+)/.exec(className || '')
                        const filenameMatch = /# file: (.+) #/.exec(String(children) || '')
                        return !inline && match ? (
                            <FoldingHighlighter
                                foldCode={foldCode}
                                highlighting={{
                                    children: [String(children).replace(/\n$/, '')],
                                    css: css`font-size: 14px`,
                                    language: match[1],
                                    PreTag: "div",
                                    style: {...atomDark, ...{"pre[class*=\"language-\"]": {background: "transparent"}}},
                                }}
                                filename={filenameMatch ? filenameMatch[1] : undefined}
                                // @ts-ignore
                                {...props}
                            />
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    }
                }}
                rehypePlugins={extendGhm ? [rehypeRaw, remarkGfm] : [rehypeRaw]}
                children={content}
            />

        ), [content, foldCode, extendGhm])
    };

const FoldingHighlighter: FC<{
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
