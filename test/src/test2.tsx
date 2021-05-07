import { h, render, Component } from 'preact';

class App extends Component<{}, {
    works:boolean,
}> {
    constructor(props){
        super(props);
        this.state = {
            works: true,
        };
    }
  render() {
    return <h1>Hello, world! Did this work? {this.state.works ? "Yep!" : "Nope!"}</h1>;
  }
}
// @ts-ignore
render(<App />, document.body.querySelector("#test-2"));