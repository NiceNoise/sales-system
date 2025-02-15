function Sale(idCustomer,idSeller) {
    this.idSale= Date.now();
    this.idSeller=idSeller;
    this.idCustomer=idCustomer;
    this.date = new Date();
}