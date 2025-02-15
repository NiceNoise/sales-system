function Seller(name, email, phone) {
    this.idSeller= Date.now();
    this.name=name;
    this.email=email;
    this.phone=phone;
    this.date = new Date();
}