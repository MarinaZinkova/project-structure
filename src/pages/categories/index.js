import SortableList from '../../components/sortable-list/index.js';
//import Tooltip from '../../components/tooltip/index.js';

import fetchJson from '../../utils/fetch-json.js';

export default class Page {
  element;
  subElements = {};
  components = {};

  async updateComponents () {
    const data = await fetchJson(`${process.env.BACKEND_URL}api/rest/categories?_sort=weight&_refs=subcategory`);
    return data;
  }

  initComponents () {
    /*const to = new Date();
    const from = new Date(to.getTime() - (30 * 24 * 60 * 60 * 1000));

    const sortableList = new SortableList();

    const rangePicker = new RangePicker({
      from,
      to
    });

    const sortableTable = new SortableTable(header, {
      url: this.getApi(from, to),
      isSortLocally: true
    });

    this.components = {
      sortableTable,
      rangePicker
    };*/
  }

  async render () {
    this.data = await this.updateComponents();
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;
    //this.subElements = this.getSubElements(this.element);

    //this.initComponents();

    //this.renderComponents();
    this.initEventListeners();

    return this.element;
  }

  renderComponents () {
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      root.append(element);
    });
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  createList(subcategories) {
    //const { imageListContainer } = this.subElements;
    //const { images } = this.formData;

    const items = subcategories.map((item) => this.getItem(item));

  
    const sortableList = new SortableList({
      items
    });

    const ul = document.createElement('div');
    ul.append(sortableList.element);

  //console.error('2', ul.firstElementChild.outerHTML);

    //imageListContainer.append(sortableList.element);
    return ul.firstElementChild.outerHTML; //sortableList.element.outerHTML;
  }

  getItem(obj) {    
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
    <li class="categories__sortable-list-item sortable-list__item" data-grab-handle="" data-id="${obj.id}">
      <strong>${obj.title}</strong>
      <span><b>${obj.count}</b> products</span>
    </li>`;

    return wrapper.firstElementChild;
  }

  getTable(){
    let res = '';
    for(let t of this.data){
      //console.error('1', t);
      res = res + `
<div class="category category_open" data-id="${t.id}">
    <header class="category__header">${t.title}</header>
    <div class="category__body">
      <div class="subcategory-list">
          ${this.createList(t.subcategories)}
      </div>
    </div>
  </div>`;
    }

    return res;
  }
  
  getTemplate () {
    return `<div class="categories">
    <div class="content__top-panel">
      <h1 class="page-title">Категории товаров</h1>
    </div>
    <div data-elem="categoriesContainer">${this.getTable()}</div>
  </div>`;
  }

  initEventListeners () {
    // Слушаем событие в элементе rangePicker, и если происходит то обновляем
    /*document.addEventListener('sortable-list-reorder', event => {
      // Здесь нужно отправить запрос на сервер + вывести сообщение тултип
      console.error('sortable-list-reorder');
      //const { from, to } = event.detail;

      //this.updateComponents(from, to);
    });*/

    this.element.addEventListener('click', event => {
      if(event.target.tagName === 'HEADER'){
        const div =  event.target.closest('.category');
        if(div){
          // toggle - добавляет класс в список если его нет, и удаляет его оттуда если он есть
          div.classList.toggle('category_open');
        }        
      }
    });
  }

  remove () {
    this.element.remove();
  }

  destroy () {
    this.remove();

    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}

// Не работает компонент sortable-list. Нет отправки изменений на ПОСТ


