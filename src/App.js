import React, { Component } from "react";

const ROOT_URL = "https://swapi.co/api/people/";

const fetchAndUnpack = url => {
  return fetch(url).then(response => response.json());
};

// TODO: fetch species
const SPECIES_FROM_URL = {
  "https://swapi.co/api/species/1/": "human",
  "https://swapi.co/api/species/2/": "droid"
};

const ICON_CLASSES = {
  droid: "fas fa-android",
  human: "fas fa-user-circle",
  warning: "fas fa-exclamation-triangle",
  loading: "fas fa-spinner fa-spin"
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
      // TODO: fetch an cache species
      // species: {},
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
      // TODO: follow this by fetching species
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
      // TODO: follow this by fetching species
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
      const species = SPECIES_FROM_URL[person.species];
      const iconClass = species ? ICON_CLASSES[species] : ICON_CLASSES.warning;
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
          <div className={`loader ${ICON_CLASSES.loading}`} />
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
