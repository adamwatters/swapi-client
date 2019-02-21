import React, { Component } from "react";

const URL = "https://swapi.co/api/people/";
const ICON_CLASSES = {
  droid: "fa-android",
  human: "fa-user-circle",
  warning: "fa-exclamation-triangle"
};

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
        <div className="controls">
          <div className="search">
            <input placeholder="Search..." type="text" />
          </div>
          <div className="sort">
            <input placeholder="Sort results..." type="select" />
          </div>
        </div>
        <div className="list">
          {people.map(person => {
            // basic style - need to implement API to get species
            console.log(person.species);
            const iconClass = `fas ${ICON_CLASSES[person.species] ||
              ICON_CLASSES["warning"]}`;
            return (
              <div className="item">
                <div className="name">
                  <div className={`icon ${iconClass}`} />
                  {person.name}
                </div>
                <div className="stats">
                  {`height: ${person.height}`}
                  <div className="stats-divider" />
                  {`mass: ${person.mass}`}
                  <div className="stats-divider" />
                  {`gender: ${person.gender}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
