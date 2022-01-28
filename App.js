import './App.css';
import react from 'react';
import train from './train.png';

class App extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      wikiReturnedSearchResults: [],
      giphyReturnedSearchResults: [],
      giphyReturnedSearchErr: [],
      wikiReturnedSearchErr: [],
      SearchValue: ''
    }
  } 
  
  runSearchEngine = (e) => {
    e.preventDefault();

    this.setState({
      wikiReturnedSearchResults: [],
      giphyReturnedSearchResults: [],
      giphyReturnedSearchErr: [],
      wikiReturnedSearchErr: []
    });

    const pointerToThis = this;

    var wikiurl = "https://en.wikipedia.org/w/api.php";
    var giphyurl = "https://api.giphy.com/v1/gifs/search?api_key=z9uqv4gHj3QbcxPLDX28GHdbAS1E8igD&limit=10&offset=0&q=";

    var params = {
      action: 'query',
      list: 'search',
      srsearch: this.state.SearchValue,
      format: 'json'
    };

    wikiurl = wikiurl + '?origin=*';
    Object.keys(params).forEach((key) => {
      wikiurl += "&" + key + "=" + params[key];
    });

    fetch(wikiurl)
      .then(
        function (response) {
          return response.json();
        }
      )
      .then(
        function (response) {
          for (var x in response.query.search) {
            pointerToThis.state.wikiReturnedSearchResults.push({
              queryResultPageFullURL: 'no link',
              queryResultPageID: response.query.search[x].pageid,
              queryResultPageTitle: response.query.search[x].title,
              queryResultPageSnippet: response.query.search[x].snippet
            });
          }

          if (response.query.search.length == 0){
            pointerToThis.state.wikiReturnedSearchErr.push({
              err: 'response.query.search.length'
            });
            pointerToThis.forceUpdate();
          }
          
        }

      )

      .then(
        function (response) {
          for (var x in pointerToThis.state.wikiReturnedSearchResults) {
            let page = pointerToThis.state.wikiReturnedSearchResults[x];
            let pageID = page.queryResultPageID;
            let urlForRetrievingPageURLByPageID = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${pageID}&inprop=url&format=json`;

            fetch(urlForRetrievingPageURLByPageID)
              .then(
                function (response) {
                  return response.json();
                }
              )
              .then(
                function (response) {
                  page.queryResultPageFullURL = response.query.pages[pageID].fullurl;

                  pointerToThis.forceUpdate();
                }
              )
          }
        }
      )
    
    fetch(giphyurl+this.state.SearchValue)
    .then(
      (responseGiphy)=>{
        return responseGiphy.json();
      })
    .then((result)=>{

      for (var x in result.data) {
        pointerToThis.state.giphyReturnedSearchResults.push({
          gif: result.data[x].images.fixed_height.url,
          gifFullURL: result.data[x].url
        });  
      }

      if (result.data.length == 0){
        pointerToThis.state.giphyReturnedSearchErr.push({
          err: 'result.data.length'
        });
        pointerToThis.forceUpdate();
      }
      
    })
  }

  setSearchValue = (e) => {
    this.setState({
      SearchValue: e.target.value
    });
  }
  
  render() {
    let wikiSearchResults = [];
    let giphySearchResults = [];

    for(var x in this.state.wikiReturnedSearchResults) {
      if(x == 0) {
        wikiSearchResults.push(
          <div className="trackDiv" key={-1}>
            {"Track 1: Wiki"}
          </div>
        )
      }
      wikiSearchResults.push(
        <div className="wikiSearchResultDiv" key={x}>
          <h3><a href={this.state.wikiReturnedSearchResults[x].queryResultPageFullURL}>{this.state.wikiReturnedSearchResults[x].queryResultPageTitle}</a></h3>
          <p className="description" dangerouslySetInnerHTML={{__html: this.state.wikiReturnedSearchResults[x].queryResultPageSnippet}}></p>
        </div>
      )
    }

    for(var w in this.state.wikiReturnedSearchErr){
      wikiSearchResults.push(
        <div className="errDiv" key={-1}>
          {"Your search has been derailed!"}
        </div>
      )
    }

    for(var y in this.state.giphyReturnedSearchResults) {
      
      if(y == 0) {
        giphySearchResults.push(
          <div className="trackDiv" key={-1}>
            {"Track 2: Giphy"}
          </div>
        )
      }
      giphySearchResults.push(
        <div className="giphySearchResultDiv" key={y}>
          <a href={this.state.giphyReturnedSearchResults[y].gifFullURL}>
            <img src={this.state.giphyReturnedSearchResults[y].gif} alt=''/>
          </a>
        </div>
      )
    }

    for(var z in this.state.giphyReturnedSearchErr){
      giphySearchResults.push(
        <div className="errDiv" key={-1}>
          {"Please try a different search to get back on track!"}
        </div>
      )
    }

    return (
      <div className="App">
        <h1> The Little Engine That Could</h1>
        <img src={train} alt=''/>
        <form action="">
          <input type="text" value={this.state.SearchValue || ''} onChange={this.setSearchValue} placeholder=' Choo Choo Choose Your Search'/>
          <button type='submit' onClick={this.runSearchEngine}> All Aboard! </button>
        </form>

      <div className="wiki">
        {wikiSearchResults} 
      </div>
      <div className="giphy">
        {giphySearchResults}
      </div>
      </div>
    );
  }
  
}

export default App;
