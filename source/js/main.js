const markdownConverter = markdown => {
  marked.setOptions({
    breaks: true,
  });

  const renderer = new marked.Renderer();
  renderer.link = (href, title, text) => {
    return `<a target="_blank" href="${href}">${text}</a>`;
  }

  if (markdown) {
    return marked(markdown, {renderer: renderer});
  } else {
    return '';
  }
}

const Toolbar = props => {
  return (
    <div className='row align-items-center justify-content-between mb-3'>
      <span className='badge badge-pill badge-secondary ml-3 py-2 px-3'>{props.label}</span>
      <button onClick={props.onClick} type='button' className='btn p-0 mr-3 not-outline'>
          {props.maximized? <i className='fas fa-compress'></i>: <i className='fas fa-expand'></i>}
      </button>
    </div>
    );
}

class Editor extends React.Component {
  componentDidMount() {
    autosize(document.querySelector('#editor'));
  }
  render() {
    return (
      <div className='col'>
        <Toolbar onClick={this.props.onClick} maximized={this.props.maximized} label='Editor' />
        <textarea onChange={this.props.onChange} placeholder="Write markdown text formatted here..." type='text' id='editor' className='form-control text-monospace'>{this.props.value}</textarea>
      </div>
    );
  }
}

const Previewer = props => {
  return (
    <div className='col'>
      <Toolbar onClick={props.onClick} maximized={props.maximized} label='Previewer' />
      <div dangerouslySetInnerHTML={{__html: markdownConverter(props.value)}} id='preview'></div>
    </div>
  );
}

class EditorBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      markdown: defaultMarkdown,
      maximized: {
        editor: false,
        previewer: false
      }
    }

    this.handleInput = this.handleInput.bind(this);
    this.handleEditorMaximize = this.handleEditorMaximize.bind(this);
    this.handlePreviewerMaximize= this.handlePreviewerMaximize.bind(this);
  }

  handleInput(event) {
    this.setState({
      markdown: event.target.value,
    });
  }

  handleEditorMaximize() {
    this.setState({
      maximized: {
        editor: !this.state.maximized.editor,
        previewer: false
      }
    });
  }

  handlePreviewerMaximize() {
    this.setState({
      maximized: {
        editor: false,
        previewer: !this.state.maximized.previewer,
      }
    });
  }

  render() {
    if (this.state.maximized.editor) {      
      return (
        <div className='container'>
          <div className='row'>
            <Editor onClick={this.handleEditorMaximize} onChange={this.handleInput} maximized={this.state.maximized.editor} value={this.state.markdown} />
          </div>
        </div>
      );
    } else if (this.state.maximized.previewer) {
      return (
        <div className='container'>
          <div className='row'>
            <Previewer onClick={this.handlePreviewerMaximize} maximized={this.state.maximized.previewer} value={this.state.markdown} />
          </div>
        </div>
      );
    } else {
      return (
        <div className='container'>
          <div className='row'>
            <Editor onClick={this.handleEditorMaximize} onChange={this.handleInput} maximized={this.state.maximized.editor} value={this.state.markdown} />
            <Previewer onClick={this.handlePreviewerMaximize} maximized={this.state.maximized.previewer} value={this.state.markdown} />
          </div>
        </div>
      );
    }
  }
}

const Header = props => {
  return (
    <header className='container text-center text-muted mt my-4'>
      <h1 className='display-4'>Markdown Editor</h1>
    </header>
  );
}

const Footer = props => {
  return (
    <footer className='container text-center text-muted mt-4'>
      <p className=''>by Carlos Silva</p>
    </footer>
  );
}

const App = props => {
  return (
    <div className='container-fluid'>
      <Header />
      <EditorBox />
      <Footer />
    </div>
  )
}

const defaultMarkdown = 
`# Welcome to my Markdown Previewer!

---

## Structured documents

Sometimes it's useful to have different levels of headings to structure your documents. Start lines with a \`#\` to create headings. Multiple \`##\` in a row denote smaller heading sizes.

### This is a third-tier heading

You can use one \`#\` all the way up to \`######\` six for different heading sizes.

## Code

There are many different ways to style code with markdown. If you have inline code blocks, wrap them in backticks: \`int foo = 2\`.  

Multiple lines of code can be written as follows:

\`\`\`
/* this is multi-line code: */
int main(int arg, char *argc) 
{
    printf("Hello World!");
    return 0;
}
\`\`\`

## Text

It's very easy to make some words **bold** and other words *italic* with Markdown, or both, **_italic and bold!_**.

You can even [link to Google!](http://google.com)

If you'd like to quote someone, use the > character before the line:

> Coffee. The finest organic suspension ever devised... I beat the Borg with it.
> > Captain Janeway

## Lists

Sometimes you want numbered lists:

1. One
2. Two
3. Three

Sometimes you want bullet points:

* Start a line with a star
* Profit!

Or mixed,

1. Something
2. If you have sub points, put two spaces before the dash or star:
  - Like this
  - And this

## Images

![React Logo](https://goo.gl/Umyytc)
`

ReactDOM.render(<App />, document.getElementById('root'));

