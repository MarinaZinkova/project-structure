import SortableTable from '../../../components/sortable-table/index.js';
import DoubleSlider from '../../../components/double-slider/index.js';

import header from './products-header.js';
import fetchJson from '../../../utils/fetch-json.js';

export default class Page {
  element;
  subElements = {};
  components = {};
  api = {
    products: 'api/rest/products'
  }
  params = {
    price_gte: null,
    price_lte: null,
    title_like: null,
    status: null,
    _sort: 'title',
    _order: 'asc',
    _start: 0,
    _end: 30
  }

  initComponents(){
    const productsContainer = new SortableTable(header, {
      url: 'api/rest/products?_embed=subcategory.category&_sort=title&_order=asc&_start=0&_end=30',
      isSortLocally: true
    });

    const slider = new DoubleSlider(/*{ min = 0, max = 4000 }*/);

    this.components = {
      productsContainer,
      slider    
    };

    /*const productId = '101-planset-lenovo-yt3-x90l-64-gb-3g-lte-cernyj';
    this.components.productFrom = new ProductForm(productId);*/
  }

  async render() {
    const element = document.createElement('div');

    element.innerHTML = this.getTamplate();

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
   // console.error(this.subElements);

    this.initComponents();
    await this.renderComponents();
    this.initEventListeners();

    return this.element;
  }

  async updateComponents () {
    const data = await fetchJson(`${process.env.BACKEND_URL}${this.api.products}?_embed=subcategory.category&${this.getParams()}`);
    this.components.productsContainer.addRows(data);
  }

  getParams(){
    const set = new Set(Object.keys(this.params).map(param => {
      if(this.params[param] != null){
        return `${param}=${this.params[param]}`;
      }
    }));
    const mas = [...set];
    return mas.join(`&`);
  }

  async renderComponents() {
    //const element = await this.components.productFrom.render();

    //this.element.append(element);
    
    this.subElements.productsContainer.append(this.components.productsContainer.element);
    this.subElements.sliderContainer.append(this.components.slider.element);
  }

  getTamplate(){
    return `<div class="products-list">
    <div class="content__top-panel">
      <h1 class="page-title">Товары</h1>
      <a href="/products/add" class="button-primary">Добавить товар</a>
    </div>
  
    <div class="content-box content-box_small">
      <form class="form-inline">
        <div class="form-group">
          <label class="form-label">Сортировать по:</label>
          <input type="text" data-elem="filterName" class="form-control" placeholder="Название товара">
        </div>
        <div class="form-group" data-elem="sliderContainer">
          <label class="form-label">Цена:</label>
        </div>
        <div class="form-group">
          <label class="form-label">Статус:</label>
          <select class="form-control" data-elem="filterStatus">
            <option value="" selected="">Любой</option>
            <option value="1">Активный</option>
            <option value="0">Неактивный</option>
          </select>
        </div>
      </form>
    </div>
  
    <div data-elem="productsContainer" class="products-list__container">
      <div class="sortable-table"></div>
    </div>
  </div>`;
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-elem]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.elem] = subElement;

      return accum;
    }, {});
  }

  initEventListeners () {
    // Слушаем событие в элементе rangePicker, и если происходит то обновляем
    this.components.slider.element.addEventListener('range-select', event => {
      const { from, to } = event.detail;
      this.params.price_gte = from === 0 ? null : from;
      this.params.price_lte = to === 4000 ? null :  to;

      this.updateComponents()
    });

    this.subElements.filterStatus.addEventListener('change', event => {
      const value = this.subElements.filterStatus.value;
      this.params.status = value == '' ? null : value;

      this.updateComponents()
    });

    this.subElements.filterName.addEventListener('keyup', event => {
      const value = this.subElements.filterName.value;
      this.params.title_like = value === '' ? null : value;

      this.updateComponents()
    });
    
//!!!
    this.components.productsContainer.subElements.body.addEventListener('pointerdown', event =>{
      const row = event.target.closest('.sortable-table__row');
      const elemid = row.dataset.id;
      document.location.href = '/products/' + elemid;
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
