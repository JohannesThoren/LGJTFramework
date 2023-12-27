function Tag(name, ...children) {
    let tag = document.createElement(name);
  
    tag.OnAppend = (call = function() {return}) => { call(); return tag; }
  
    tag.Arg = (name, value) => {
      tag.setAttribute(name, value);
      return tag
    }
  
    tag.Id = (name) => {
      tag.Arg('id', name);
      return tag;
    }
  
    tag.Class = (name) => {
      tag.Arg('class', name);
      return tag;
    }
  
    tag.Child = (child) => {
      if(child.OnAppend) {
        child.OnAppend()
      }
      tag.appendChild(child);
  
      return tag;
    }
  
    children.forEach(child => tag.Child(child));
  
    return tag
  }
  
  function Text(text) {
    let textNode = document.createTextNode(text);
    return textNode;
  }
  
  function Div(...children) {
    return Tag('div', ...children);
  }
  
  function H(text, level = 1) {
    return Tag('h' + level, Text(text));
  }
  
  function P(text) {
    return Tag('p', Text(text));
  }
  
  function A(text, link) {
    return Tag('a', Text(text)).Arg("href", link)
  }
  
  function Li(...children) {
    return Tag('li', ...children);
  }
  
  function Ol(...children) {
    return Tag('ol', ...children);
  }
  
  function Ul(...children) {
    return Tag('ul', ...children);
  }
  
  function Img(src, alt) {
    return Tag('img').Arg("src", src).Arg("alt", alt)
  }
  
  function Button(text, click) {
    let button = Tag('button').Child(Text(text));
    button.addEventListener('click', click);
    return button;
  }
  
  function Tab(name, body) {
    return { name: name, body: body }
  }
  
  
  // TODO: make this be dependent on queries, so that we can get urls to each tab.
  function TabRoot(...tabs) {
    let tabNav = Div().Id("tabNav");
    let tabBody = Div().Id("tabBody");
    let tabRoot = Div().Id("tabRoot");;
  
  
    tabs.forEach(tab => {
      let btn = Button(tab.name, () => {
        tabBody.replaceChildren(tab.body);
        tabRoot.Active.button.Arg("data-active", false)
        tabRoot.Active = { button: btn, body: tab.body, name: tab.name }
        tabRoot.Active.button.Arg("data-active", true)
  
      }).Class("tab-nav-item").Arg("data-tab", tab.name).Arg("data-active", false);
  
      tabNav.Child(btn)
  
    })
  
    tabRoot.Active = { button: tabNav.children[0], body: tabs[0].body, name: tabs[0].name };
    tabBody.replaceChildren(tabRoot.Active.body);
    tabRoot.Active.button.Arg("data-active", true)
  
  
    return tabRoot.Child(tabNav).Child(tabBody);
  }
  
  
  function OnLoad(...child) {
    window.addEventListener('load', () => {
      child.forEach(c => {
        document.querySelector("body").appendChild(c);
      })
    })
  }