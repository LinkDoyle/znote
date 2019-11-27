import React from 'react';

type PreviewProps = {
  content: JSX.Element[] | JSX.Element | string;
};

class Preview extends React.Component<PreviewProps> {
  constructor(props: PreviewProps) {
    super(props);
  }
  render() {
    const content = this.props.content;
    return <div id="preview">{content}</div>;
  }
}

export default Preview;
