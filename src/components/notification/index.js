export default class NotificationMessage {
  element;

  constructor(mes = '', { duration = 0, type = ''} = {}){
      this.message = mes;
      this.duration = duration;
      this.type = type;
      this.Two = type === '';
      this.render();
  }

  render(){
      //Создаем элемент
      const elem = document.createElement('div');
      elem.innerHTML = this.Two ? this.getTemplate2() : this.getTemplate();
      this.element = elem.firstElementChild;
  }

  show(elemDir){
      if(elemDir === undefined){
          elemDir = document.body;
      }

      //Поиск элемента в elemDir.
      const elemDoc = elemDir.querySelector('.notification');
      if(elemDoc === null){
          //Не нашли - добавляем
          elemDir.append(this.element);            
      }
      
      //Удаляем элемент
      setTimeout((el) => this.remove(), this.duration, this.element);
  }

  getTemplate(){
      return `
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
          <div class="timer"></div>
          <div class="inner-wrapper">
              <div class="notification-header">${this.type}</div>
              <div class="notification-body">
                  ${this.message}
              </div>
          </div>
      </div>`;
  }

  getTemplate2(){
    return `
    <div class="notification notification.success notification.show">
      <div class="notification__content">${this.message}</div>
    </div>`;
  } 

  remove () {
      if(this.element != null){
          this.element.remove();
      }
  }
  
  destroy() {
      this.remove();
      this.element = null;
  }
}
