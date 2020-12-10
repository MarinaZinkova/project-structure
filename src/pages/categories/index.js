import SortableList from '../../components/sortable-list/index.js';
import NotificationMessage from '../../components/notification/index.js';

import fetchJson from '../../utils/fetch-json.js';

export default class Page {
  element;
  subElements = {};
  components = {};

  async updateComponents () {
    const data = await fetchJson(`${process.env.BACKEND_URL}api/rest/categories?_sort=weight&_refs=subcategory`);
    return data;
  }

  async postCopmonent(data){
    const result = await fetchJson(`${process.env.BACKEND_URL}api/rest/subcategories`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
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
    this.subElements = this.getSubElements(this.element);

    //this.initComponents();

    //this.renderComponents();
    
    this.getUpdateTable();

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
    const elements = $element.querySelectorAll('[data-id]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.id] = subElement;

      return accum;
    }, {});
  }

  createList(tab) {
    const items = tab.subcategories.map((item) => this.getItem(item));
    const sortableList = new SortableList({
      items
    });
    
    const elem = document.createElement('div');
    elem.className = "subcategory-list";
    elem.append(sortableList.element);

    const elem2 = document.createElement('div');
    elem2.className = "category__body";
    elem2.append(elem);

    return elem2;
  }

  getUpdateTable(){
    let res = '';
    for(let t of this.data){
      this.subElements[t.id].append(this.createList(t));
    }
  }

  getTable(){
    let res = '';
    for(const t of this.data){
      res = res + `
<div class="category category_open" data-id="${t.id}">
    <header class="category__header">${t.title}</header>
  </div>`;
     }

   return res;
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
  
  getTemplate () {
    return `<div class="categories">
    <div class="content__top-panel">
      <h1 class="page-title">Категории товаров</h1>
    </div>
    <div data-elem="categoriesContainer">${this.getTable()}</div>
  </div>`;
  }

  initEventListeners () {
    // Слушаем событие в элементе
    document.addEventListener('sortable-list-reorder', event => {
      // Здесь нужно отправить запрос на сервер + вывести сообщение тултип

      //console.error('sortable-list-reorder', 1);
      const mass = [];
      for(let i = 0; i < 3; i++){
        const id = event.target.children[i].dataset.id;
        mass.push({ id, weight: i + 1});
      }

      this.postCopmonent(mass);

      
        const notification = new NotificationMessage('Category order saved_3214', {
          duration: 2000
        });
    
        notification.show(this.element);


      /*const element = document.createElement('div');
      element.innerHTML = `<div class="notification notification_success show">
      <div class="notification__content">Category order saved</div>
    </div>`;
       document.body.append(element.firstElementChild);*/
    });

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




