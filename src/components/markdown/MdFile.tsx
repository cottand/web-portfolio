/** @jsxImportSource @emotion/react */
import React, {FC, ReactElement, ReactNode, Suspense, useEffect, useMemo, useRef} from "react";
// import ReactMarkdown from "react-markdown";
import {Util} from "../../util";
import rehypeRaw from "rehype-raw";
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {css} from "@emotion/react";
import remarkGfm from 'remark-gfm';
import {Link, useTheme} from "@mui/material";
import {PicWithCaption} from "./PicWithCaption";
import {Await, useLoaderData, useLocation, useNavigation} from "react-router-dom";
import {Spinner} from "../spinner";
import ReactMarkdown from "react-markdown";
import {CodeProps, ComponentType} from "react-markdown/lib/ast-to-react";
import {FoldingHighlighter} from "./FoldingHighlighter";
import {MermaidDiagram} from "./Mermaid";

const encode = (s: string) => encodeURI(s.replaceAll(" ", ""))


const HWithAnchor: FC<{ children: ReactElement, href: ReactNode | undefined }> = (props) => {

    const location = useLocation()
    const href = props.href ? encode(props.href.toString()) : ""
    const ref = useRef<HTMLAnchorElement>(null)
    let loading = useNavigation().state == "loading"

    // when the hash is set, it means we loaded the page to go to this h
    const scroll = () => {
        if (href !== "" && location.hash.includes(href) && !loading) {
            ref.current?.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
        }
    }
    useEffect(scroll, [href, location.hash])

    return props.href ?
        <Link
            ref={ref} href={`#${href}`} underline={"hover"} color={(t) => t.palette.text.primary}>
            {props.children}
        </Link>
        : props.children
}


export const MdRenderer: FC<{
    foldCode: boolean,
    extendGhm?: boolean,
    makeAnchors?: boolean,
}> =
    ({
         foldCode,
         extendGhm,
         makeAnchors,
     }) => {
        // @ts-ignore
        const promise: { content: Promise<string> } = useLoaderData()
        const theme = useTheme()

        return useMemo(() => <Suspense fallback={<Spinner/>}>
                <Await resolve={promise.content}>{(content) =>
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

                            h4 {
                                font-weight: normal;
                            }

                            strong {
                                font-weight: 500;
                            }
                            
                            
                            th, td {
                                padding: 8px;
                                border-left: 1px solid grey;
                                border-right: 1px solid grey;
                            }
                            
                            table {
                                border-collapse: collapse;
                            }
                            th {
                                border-bottom: 1px solid grey;
                            }
                            td {
                                border-bottom: 0;
                            }

                            blockquote {
                                margin: 0;
                                padding: 5px 15px;
                                background-color: rgba(115, 124, 140, 0.18);
                                border-radius: 7px;
                            }
                        `}
                        components={{
                            a: Util.mdAsMuiLink,
                            img: (props) => <PicWithCaption {...props}/>,
                            // h1: (props) => <h1 {...props}></h1>,
                            // @ts-ignore
                            // eslint-disable-next-line
                            h2: (props) => <HWithAnchor href={makeAnchors ? props.children[0] : undefined}>
                                <h2 {...props}/>
                            </HWithAnchor>,
                            // eslint-disable-next-line
                            h3: (props) => <HWithAnchor href={makeAnchors ? props.children[0] : undefined}>
                                <h3 {...props}/>
                            </HWithAnchor>,
                            // eslint-disable-next-line
                            h4: (props) => <HWithAnchor href={makeAnchors ? props.children[0] : undefined}>
                                <h4 {...props}/>
                            </HWithAnchor>,
                            code: (props) => <MdCode foldCode={foldCode} {...props}/>,
                        }}
                        rehypePlugins={extendGhm ? [rehypeRaw, remarkGfm] : [rehypeRaw]}
                        children={content}
                    />
                }
                </Await>
            </Suspense>
            , [makeAnchors, foldCode, extendGhm, theme])
    }


const MdCode: ComponentType<CodeProps & {foldCode: boolean}> = ({node, inline, className, children, foldCode, ...props}) => {
    const match = /language-(\w+)/.exec(className || '')
    const filenameMatch = /# file: (.+) #/.exec(String(children) || '')
    const hiddenFilenameRegex = /# hiddenfile: (.+) #\n/
    const hiddenFilenameMatch = hiddenFilenameRegex.exec(String(children) || '')
    const isMermaid = !inline && match && match[1] == "mermaid"

    if (isMermaid) {
        const captionMatch = /!caption: (.+)/.exec(String(children) || '')
        const caption = captionMatch?.at(1)

        return <MermaidDiagram children={children} caption={caption}/>
    }

    return !inline && match ? (
        <FoldingHighlighter
            foldCode={foldCode}
            highlighting={{
                children: [String(children).replace(/\n$/, '').replace(hiddenFilenameRegex, "")],
                css: css`font-size: 14px`,
                language: match[1],
                PreTag: "div",
                style: {...atomDark, ...{"pre[class*=\"language-\"]": {background: "transparent"}}},
            }}
            filename={filenameMatch ? filenameMatch[1] : (hiddenFilenameMatch ? hiddenFilenameMatch[1] : undefined)}
            // @ts-ignore
            {...props}
        />
    ) : (
        <code className={className} {...props}>
            {children}
        </code>
    )
}


