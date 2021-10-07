const { fromEvent, from } = rxjs;
const { ajax } = rxjs.ajax;
const {
  map,
  filter,
  distinctUntilChanged,
  debounceTime,
  switchMap,
  catchError,
} = rxjs.operators;

const searchBox = document.getElementById("search");
const results = document.getElementById("results");

const searchGithub = (query) => {
  return ajax.getJSON(getApiUrl(query)).pipe(
    map((data) => data),
    catchError((error) => {
      console.error("error: ", error);
      return of(error);
    })
  );
};

const getApiUrl = (query) => `https://api.github.com/search/users?q=${query}`;

const input$ = fromEvent(searchBox, "input").pipe(
  map((e) => e.target.value),
  debounceTime(250),
  filter((query) => query.length >= 2 || query.length === 0),
  distinctUntilChanged(),
  switchMap((query) =>
    query ? searchGithub(query) : from(Promise.resolve({ items: [] }))
  )
);

input$.subscribe(({ items }) => {
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
  items.map((user) => {
    const newResult = document.createElement("a");
    newResult.textContent = user.login;
    newResult.href = user.html_url;
    newResult.target = "_blank";
    results.appendChild(newResult);
  });
});
