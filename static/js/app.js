const e = React.createElement;

/* Application root component */
class App extends React.Component {
	
	constructor(props) {
		super(props);

		this.SEARCH_RESULT_LIMIT = 25;

		this.onSearchInputEnter = this.onSearchInputEnter.bind(this);
		this.onSearchResultReceived = this.onSearchResultReceived.bind(this);
		this.fetchData = this.fetchData.bind(this);
		this.onPaginationForward = this.onPaginationForward.bind(this);
		this.onPaginationBackward = this.onPaginationBackward.bind(this);

		this.state = {keyword: '', meta: null, programs: [], isSearching: false};
	}

	onSearchInputEnter(keyword) {
		this.setState({'keyword': keyword, isSearching: true});
		this.fetchData(keyword, 0, this.onSearchResultReceived);
	}

	onSearchResultReceived(result) {
		this.setState({meta: result.meta, programs: result.programs, isSearching: false})
	}

	onPaginationBackward() {
		var offset = parseInt(this.state.meta.offset);
		var limit = parseInt(this.state.meta.limit);

		if(offset > 0) {
			var newOffset = offset - limit;
			if(newOffset < 0) newOffset = 0;
			this.setState({'isSearching': true});
			this.fetchData(this.state.keyword, newOffset, this.onSearchResultReceived);
		}
	}

	onPaginationForward() {
		
		if( (parseInt(this.state.meta.offset) + this.state.programs.length) < parseInt(this.state.meta.count) ) {
			var newOffset = parseInt(this.state.meta.offset) + this.state.programs.length;
			this.setState({'isSearching': true});
			this.fetchData(this.state.keyword, newOffset, this.onSearchResultReceived);
		}
	}

	/* Uses fetch-api to query programs with the given keyword */
	fetchData(keyword, offset, callback) {

		fetch('/programs?q=' + keyword + '&limit=' + this.SEARCH_RESULT_LIMIT + '&offset=' + parseInt(offset)).then(function(response) {
			response.json().then(function(result) {
				callback(result);
			});
		});
	}

	render() {

		const search = e('div', {className: 'row'}, e('div', {className: 'col-lg-12'}, e(SearchInput, {onSearchInputEnter: this.onSearchInputEnter}), e(SearchLink, {onSearchInputEnter: this.onSearchInputEnter})));
		const pagination = e('div', {className: 'row'}, e('div', {className: 'col-lg-12'}, e(Pagination, {meta: this.state.meta, programs: this.state.programs, onPaginationForward: this.onPaginationForward, onPaginationBackward: this.onPaginationBackward})));
		const result = e('div', {className: 'row'}, e('div', {className: 'col-lg-12'}, e(List, this.state)));
		
		return(e(
				'div', 
				null, 
				search,
				pagination,
				result
			)
		);
	}
}

/* Input field for entering search keyword */
class SearchInput extends React.Component {

	constructor(props) {
		super(props);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	handleKeyUp(e) {
		if(e.keyCode == 13) {
			e.preventDefault();
			this.props.onSearchInputEnter(e.target.value.toString());
		}
	}

	render() {
		return e('input', {id: 'searchInput', type: 'search', className: 'form-control search-input', onKeyUp: this.handleKeyUp});
	}
}

/* Button component for executing the search field */
class SearchButton extends React.Component {

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		e.preventDefault();
		var keyword = document.getElementById('searchInput').value;
		this.props.onSearchInputEnter(keyword);
	}

	render() {
		return e('button', {className: 'form-control search-button', onClick: this.handleClick}, '>');
	}
}

/* Link version of the SearchButton */
class SearchLink extends React.Component {

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		e.preventDefault();
		var keyword = document.getElementById('searchInput').value;
		this.props.onSearchInputEnter(keyword);
	}

	render() {
		return e('a', {className: 'search-link', href: '#', onClick: this.handleClick}, 'Hae');
	}
}

/* Implements search result listing */
class List extends React.Component {
	
	constructor(props) {
		super(props);
	}

	render() {

		if(this.props.isSearching) {
			return e('div', {className: 'search-result-list-searching'}, 'Haetaan...');
		} else {
			return e('div', {className: 'search-result-list'}, this.props.programs.map(function(d){
				return e( ListItem, {key: d.id, itemData: d}, null );
			}));
		}
	}
}

/* Single item element of List */
class ListItem extends React.Component {

	render() {
		const data = this.props.itemData;
		const link = e('a', {href: '/play/' + data.id + '/' + data.media_id}, data.title.fi)
		const title = e('h5', {className: 'search-result-title'}, link);
		const description = e('p', null, data.description.fi);

		return e('div', {className: 'search-result-list-item'}, title, description);
	}
}

/* Pagination controls for the pagination of the search results */
class Pagination extends React.Component {

	constructor(props) {
		super(props);
		this.handleClickBackward = this.handleClickBackward.bind(this);
		this.handleClickForward = this.handleClickForward.bind(this);
	}

	handleClickBackward(e) {
		e.preventDefault();
		this.props.onPaginationBackward();
	}

	handleClickForward(e) {
		e.preventDefault();
		this.props.onPaginationForward();
	}

	render() {
		// If search meta data is null, no search has been executed, and we don't want to show any information
		if(this.props.meta === null) {
			return false;
		}

		var offset = parseInt(this.props.meta.offset);
		var firstItemOrderNumber = parseInt(this.props.meta.offset) + 1;

		const info = e('span', null, firstItemOrderNumber + '-' + (offset + this.props.programs.length) + ' /' + this.props.meta.count);
		const backward = e('a', {href: '#', className: 'pagination-backward', onClick: this.handleClickBackward}, '<<');
		const forward = e('a', {href: '#', className: 'pagination-forward', onClick: this.handleClickForward}, '>>');

		return e('p', {className: 'search-result-pagination'}, backward, info, forward);
	}
}

function renderApp() {
	ReactDOM.render(React.createElement(App), document.getElementById('root'));
}

renderApp();