import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import CodeBlock from "./code-block";

type Props = {
  content: string;
};

export default function PreviewContent({ content }: Props) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <CodeBlock
              {...props}
              language={match[1]}
              content={String(children).replace(/\n$/, "")}
            />
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
