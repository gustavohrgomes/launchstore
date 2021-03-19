const formDelete = document.querySelector("#form-delete");
formDelete.addEventListener("submit", function (event) {
  const confirmResponse = confirm("Deseja mesmo deletar este registro?");
  if (!confirmResponse) {
    event.preventDefault();
  }
});
