import React from 'react';
type EditorProps = {
    content: string,
    onLineChanged?: (line: number, start: number, length: number, content: string) => void,
};

type EditorState = {
    lines: string[],

}
class Editor extends React.Component<EditorProps, EditorState> {
    constructor(props: EditorProps) {
        super(props);
        const content = this.props.content;
        this.state = {
            lines: content.split('\n')
        };
    }

    onLineChanged(event: React.FormEvent<HTMLParagraphElement>) {
        console.log(event);
        console.log(this);
    }

    render() {
        const lines = this.state.lines;
        const lineViews = lines.map((line, i) => <p key={i} onChange={this.onLineChanged}>{line}</p>)
        return (
            <div id="editor" contentEditable={true}>
                {lineViews}
            </div>
        );
    }
}

export default Editor;