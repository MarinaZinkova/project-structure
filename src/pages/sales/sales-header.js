const header = [
  {
    id: 'id',
    title: 'ID',
    sortable: true,
    sortType: 'number'    
  },
  {
    id: 'user',
    title: 'Клиент',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'createdAt',
    title: 'Дата',
    sortable: true,
    sortType: 'custom',
    template: data => {
      const d = new Date(data);
      const monthA = 'января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря'.split(',');
      return `<div class="sortable-table__cell">${d.getDate()} ${monthA[d.getMonth()]} ${d.getFullYear()}</div>`;
    },
    customSorting: function(a, b){
      return a['createdAt']> b['createdAt'] ? 1 : 0;
    }
  },
  {
    id: 'totalCost',
    title: 'Стоимость',
    sortable: true,
    sortType: 'number',
    template: data => {
      return `<div class="sortable-table__cell">$${data}</div>`;
    }
  },
  {
    id: 'delivery',
    title: 'Статус',
    sortable: true,
    sortType: 'string'
  },
];

export default header;
