import React, { Component } from "react";

const URL = "https://swapi.co/api/people/";

class App extends Component {
  constructor() {
    super();
    this.state = {
      people: []
    };
  }
  componentDidMount() {
    fetch(URL)
      .then(response => response.json())
      .then(json => {
        this.setState({ people: json.results });
      });
  }
  render() {
    const { people } = this.state;
    return (
      <div className="App">
        {people.map(person => {
          return person.name;
        })}
      </div>
    );
  }
}

export default App;
