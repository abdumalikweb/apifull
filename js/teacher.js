let person = document.querySelector(".row");
let formName = document.querySelector("#categoryName");
let formlast = document.querySelector("#categoryLastname");
let formimg = document.querySelector("#categoryImage");
let formphone = document.querySelector("#category_phone");
let formemail = document.querySelector("#category_email");
let formcheck = document.querySelector(".radio");
let form = document.querySelector("#categoryForm");
let formgroup = document.querySelector("#category_group");
let modal = document.querySelector("#category-modal");
const categoryBtn = document.getElementById("category-add-btn");
let selected = null;
let page = 1;
let limit = 10;
let pagination_items;

const Getteacher = ({
  avatar,
  firstName,
  lastName,
  groups,
  isMarried,
  phoneNumber,
  email,
  id,
}) => {
  return ` <div class="col-md-6 col-lg-3 my-3">
      <div class="card">
        <img src="${avatar}" class="card-img-top" alt="..." />
        <div class="card-body">
          <h5 class="card-title">${firstName} ${lastName}</h5>
          <p class="card-text">
          <b>Group</b>:${groups} <br>
          <b>Marrid : </b>${isMarried ? "Ha" : "Yoq"} <br>
           <b>Tel</b>:${phoneNumber} <br>
            <b>Email</b>: ${email}
          </p>
                   <button class="btn btn-danger"onclick="deleteCategory(${id})" >Del</button>
          <button class="btn btn-primary" onclick="editCategory(${id})" data-bs-toggle="modal" data-bs-target="#category-modal">Edit</button>
          
        </div>
      </div>
    </div>`;
};

async function getCategories() {
  person.innerHTML = `<div class="spinner-border text-secondary mt-5 m-auto" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;
  let res = await fetch(ENDPOINT + `teacher`, {
    method: "GET",
  });
  let teacher = await res.json();
  person.innerHTML = "";
  teacher.forEach((teacher) => {
    person.innerHTML += Getteacher(teacher);
  });
}

getCategories();

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let check = this.checkValidity();
  this.classList.add("was-validated");
  if (check) {
    bootstrap.Modal.getInstance(modal).hide();
    let data = {
      firstName: formName.value,
      lastName: formlast.value,
      avatar: formimg.value,
      isMarried: formcheck.value,
      phoneNumber: formphone.value,
      email: formemail.value,
      groups: formgroup.value.split(","),
    };
    if (selected) {
      fetch(ENDPOINT + `teacher/${selected}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      }).then(() => {
        alert("Malumot qoshildi!");
        getCategories();
        emptyForm();
      });
    } else {
      fetch(ENDPOINT + "teacher", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      }).then(() => {
        alert("Malumot qoshildi!");
        getCategories();
        emptyForm();
      });
    }
  }
});

function emptyForm() {
  formName.value = "";
  formlast.value = "";
  formimg.value = "";
  formcheck.value = "";
  formphone.value = "";
  formemail.value = "";
  formgroup.value = "";
}

function editCategory(id) {
  selected = id;
  categoryBtn.innerHTML = "Save category";
  fetch(ENDPOINT + `teacher/${id}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      formName.value = res.firstName;
      formlast.value = res.lastName;
      formimg.value = res.avatar;
      formcheck.value = res.isMarried;
      formphone.value = res.phoneNumber;
      formemail.value = res.email;
      formgroup.value = res.groups;
    });
}

function deleteCategory(id) {
  let check = confirm("Rostanam o'chirishni xohlaysizmi ?");
  if (check) {
    fetch(ENDPOINT + `teacher/${id}`, { method: "DELETE" }).then(() => {
      getCategories();
    });
  }
}

modal.addEventListener("click", () => {
  selected = null;
});
