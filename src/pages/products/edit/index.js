import ProductForm from "../../../components/product-form";

export default class Page {
  element;
  subElements = {};
  components = {};

  async render() {
    const element = document.createElement('div');

    element.innerHTML = `
    <div class="products-edit">
      <div class="content__top-panel">
        <h1 class="page-title">
          <a href="/products" class="link">Товары</a> / Добавить
        </h1>
      </div>
      <div class="content-box" data-elem="box">
    
      </div>
    </div>`;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.initComponents();
    await this.renderComponents();
    this.initEventListeners();    

    return this.element;
  }

  initComponents(){
    const searchString = new URL(window.location.href);
    const path = searchString.pathname;
    const productId = path.slice(path.lastIndexOf('/') + 1);
    if(productId==="add"){
      this.components.productFrom = new ProductForm();
    }
    else{
      this.components.productFrom = new ProductForm(productId);
    }
  }

  async renderComponents() {
    const element = await this.components.productFrom.render();
    this.subElements.box.append(element);
  }

  initEventListeners () {
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-elem]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.elem] = subElement;

      return accum;
    }, {});
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