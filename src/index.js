/** @jsx View.createElement */
import View from "./view.js";

const Heading = (props) => <h1 className="title">{props.children}</h1>;

class App extends View {
  constructor(props) {
    super(props);

    this.state = { counter: 0 };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      counter: this.state.counter + 1
    });
  }

  render() {
    return (
      <div>
        <Heading>count: {this.state.counter}</Heading>
        <button onclick={this.handleClick}>count++</button>
      </div>
    );
  }
}

View.render(<App />, document.getElementById("app"));
