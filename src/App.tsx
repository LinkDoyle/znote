import React from 'react';
import './App.css';
import Editor from './Editor';
import Preview from './Preview';

const content = `# Hello Link Note
## this a list
* item 1
* item 2
* item 3
`;
class App extends React.Component {
  constructor(props: {}) {
    super(props);
  }

  markdownToHTML(text: string) {
    const lines = text.split('\n');
    const previews = lines.map((line, i) => {
      return <p key={i}>{line}</p>;
    });
    return previews;
  }

  render() {
    const preview = this.markdownToHTML(content);

    return (
      <div id="container" className="App">
        <div id="left">
          <Editor content={content}></Editor>
        </div>
        <div id="right">
          <Preview content={preview}></Preview>
        </div>
      </div>
    );
  }
}

export default App;
