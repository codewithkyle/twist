import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return <h1>Hello, world!</h1>;
  }
}

render(<App />, document.body);