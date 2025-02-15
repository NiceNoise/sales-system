function Customer(name, email, phone) {
    this.idCustomer= Date.now();
    this.name=name;
    this.email=email;
    this.phone=phone;
    this.date = new Date();
}