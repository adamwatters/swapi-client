import React, { Component } from "react";

const ROOT_URL = "https://swapi.co/api/people/";

const fetchAndUnpack = url => {
  return fetch(url).then(response => response.json());
};

const ICON_CLASSES = {
  droid: "fa-android",
  human: "fa-user-circle",
  warning: "fa-exclamation-triangle",
  loading: "fa-spinner"
};

class Store extends Component {
  actions = {
    changeSearch: str => {
      this.search(str);
      this.setState({ search: str });
    }
  };

  constructor() {
    super();
    this.state = {
      species: {},
      searches: {},
      pages: {},
      page: 1,
      search: ""
    };
  }

  componentDidMount() {
    this.get(this.state.page);
  }

  async get(page) {
    if (!this.state.pages[page]) {
      this.setState({ pages: { ...this.state.pages, [page]: "LOADING" } });
      const newPage = await fetchAndUnpack(`${ROOT_URL}?page=${page}`);
      this.setState({
        pages: { ...this.state.pages, [page]: newPage.results }
      });
    }
  }

  async search(search) {
    if (!this.state.searches[search]) {
      this.setState({
        searches: { ...this.state.searches, [search]: "LOADING" }
      });
      const newSearch = await fetchAndUnpack(`${ROOT_URL}?search=${search}`);
      this.setState({
        searches: { ...this.state.searches, [search]: newSearch.results }
      });
    }
  }

  render() {
    return this.props.render(this.state, this.actions);
  }
}

const List = ({ people }) => (
  <>
    {people.map(person => {
      // basic style - need to implement API to get species
      console.log(person.species);
      const iconClass = `fas ${ICON_CLASSES[person.species] ||
        ICON_CLASSES.warning}`;
      return (
        <div key={person.url} className="item">
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
  </>
);

const View = ({ page, search, pages, searches, changeSearch }) => {
  const people = search ? searches[search] : pages[page];
  return (
    <div className="container">
      <div className="controls">
        <div className="search">
          <input
            placeholder="Search..."
            onChange={e => changeSearch(e.target.value)}
            value={search}
            type="text"
          />
        </div>
        <div className="sort">
          <input placeholder="Sort results..." disabled />
        </div>
      </div>
      <div className="list-container">
        {!people || people === "LOADING" ? (
          "LOADING"
        ) : people.length === 0 ? (
          <div className="item">
            <div className="name">
              <div className={`icon ${ICON_CLASSES.warning}`} />
              We couldn't find the droids you were looking for.
            </div>
            <div className="stats">please try a different search query.</div>
          </div>
        ) : (
          <List people={people} />
        )}
      </div>
    </div>
  );
};

class App extends Component {
  render() {
    return (
      <Store render={(store, actions) => <View {...store} {...actions} />} />
    );
  }
}

export default App;
