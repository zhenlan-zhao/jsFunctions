document.body.innerHTML = `
  <div id="a">
    <div id="b"></div>
  </div>
`

function appendChildren (decorateDivFunction) {
  let originalDivList = document.getElementsByTagName('div');
  for (let divDom of originalDivList) {
    let appendDiv = document.createElement('div');
    divDom.appendChild(appendDiv);
    decorateDivFunction(divDom);
  }
}

appendChildren(div => {console.log(div.outerHTML)})
console.log(document.body.innerHTML);