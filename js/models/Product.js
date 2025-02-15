function Product(name, price, stock) {
    this.idProduct= Date.now();
    this.name=name;
    this.price=parseFloat(price);
    this.stock=parseInt(stock);
}
