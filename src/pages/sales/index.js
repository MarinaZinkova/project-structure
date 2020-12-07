import RangePicker from '../../components/range-picker/index.js';
import SortableTable from '../../components/sortable-table/index.js';
import header from './sales-header.js';

import fetchJson from '../../utils/fetch-json.js';

export default class Page {
  element;
  subElements = {};
  components = {};

  async updateComponents (from, to) {
    const data = await fetchJson(`${process.env.BACKEND_URL}${this.getApi(from, to)}`);
    this.components.sortableTable.addRows(data);
  }

  initComponents () {
    const to = new Date();
    const from = new Date(to.getTime() - (30 * 24 * 60 * 60 * 1000));

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
    };
  }

  getApi(from, to){
      return `api/rest/orders?createdAt_gte=${from.toISOString()}&createdAt_lte=${to.toISOString()}&_sort=createdAt&_order=desc&_start=0&_end=30`
  }

  get template () {
    return `
<div class="sales full-height flex-column">
  <div class="content__top-panel">
    <h1 class="page-title">Продажи</h1>
    <!-- RangePicker component -->
    <div data-element="rangePicker"></div>
  </div>

  <div data-elem="ordersContainer" class="full-height flex-column">
    <div data-element="sortableTable">
        <!-- sortable-table component -->
    </div>
  </div>
</div>`;
  }

  async render () {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.initComponents();

    this.renderComponents();
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

  initEventListeners () {
    // Слушаем событие в элементе rangePicker, и если происходит то обновляем
    this.components.rangePicker.element.addEventListener('date-select', event => {
      const { from, to } = event.detail;

      this.updateComponents(from, to);
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


// Добавить сортировку по дате