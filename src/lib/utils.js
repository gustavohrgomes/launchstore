module.exports = {
  date(timeStamp) {
    const date = new Date(timeStamp);

    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hour = date.getHours();
    const minutes = date.getMinutes();

    return {
      day,
      month,
      day,
      hour,
      minutes,
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}`,
      format: `${day}/${month}/${year}`,
    };
  },
  formatPrice(price) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price / 100);
  },
};
