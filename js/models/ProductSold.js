function ProductSold (idSale, idProduct, unitPrice, quantity){
    this.idSale=idSale;
    this.idProduct=idProduct;
    this.unitPrice=parseFloat(unitPrice);
    this.quantity=quantity;
    this.partialAmount=parseFloat(unitPrice*quantity);
}