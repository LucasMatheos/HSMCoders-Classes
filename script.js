const Modal = {
  modalBox: document.querySelector(".modal-overlay"),
  OpenCloseModal() {
    Modal.modalBox.classList.toggle("active");
  },
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.classes:courses")) || [];
  },
  set(courses) {
    localStorage.setItem("dev.classes:courses", JSON.stringify(courses));
  },
};

const Courses = {
  all: Storage.get(),
  add(course) {
    Courses.all.push(course);
    App.reload();
  },
  remove(index) {
    console.log(index);
    Courses.all.splice(index, 1);
    App.reload();
  },
  edit(index) {
    const allCourses = [...Courses.all];
    console.log(allCourses);
    allCourses[0].id = 1324232;
    console.log(Courses.all);
  },
};

const DOM = {
  table: document.querySelector("#table-content tbody"),
  innerHTMLCourses(course, index) {
    const html = `<td>${course.id}</td>
    <td>${course.title}</td>
    <td class="table-description">
      <p>
      ${course.description}
      </p>
    </td>
    <td class="table-image">
      <img src=${course.image} alt="Imagem do Curso" />
    </td>
    <td >${course.teacher}</td>
    <td class="table-classes">
    ${course.classes}
    </td>
    <td class="table-edit">
      <button onclick="Courses.edit(${index})">Edit</button>
    </td>
    <td class="table-remove">
      <img onclick="Courses.remove(${index})" src="./assets/minus.svg" alt="random image" />
    </td>`;

    return html;
  },
  addCourse(course, index) {
    const tr = document.createElement("tr");
    tr.classList.add("table-row");
    tr.innerHTML = DOM.innerHTMLCourses(course, index);
    DOM.table.appendChild(tr);
    tr.dataset.index = index;
  },
  clearCourse() {
    DOM.table.innerHTML = "";
  },
};

const Form = {
  id: document.querySelector("input#id"),
  title: document.querySelector("input#title"),
  description: document.querySelector("input#description"),
  image: document.querySelector("input#image"),
  teacher: document.querySelector("input#teacher"),
  classes: document.querySelector("input#classes"),

  getValues() {
    return {
      id: Form.id.value,
      title: Form.title.value,
      description: Form.description.value,
      image: Form.image.value,
      teacher: Form.teacher.value,
      classes: Form.classes.value,
    };
  },

  validateFields() {
    const { id, title, description, image, teacher, classes } =
      Form.getValues();
    const searchID = Courses.all.find((course) => course.id == id);
    console.log(searchID);
    if (
      id === "" ||
      title === "" ||
      description === "" ||
      image === "" ||
      classes === "" ||
      teacher === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
    if (!!searchID) {
      throw new Error("ID do repetido, por favor insira outro");
    }
  },
  saveCourse(course) {
    Courses.add(course);
  },
  clearFields() {
    Form.id.value = "";
    Form.description.value = "";
    Form.title.value = "";
    Form.image.value = "";
    Form.classes.value = "";
    Form.teacher.value = "";
  },
  submit(event) {
    event.preventDefault();
    try {
      Form.validateFields();
      const course = Form.getValues();
      Form.saveCourse(course);
      Form.clearFields();
      Modal.OpenCloseModal();
    } catch (error) {
      alert(error.message);
    }
  },
};
const App = {
  init() {
    Courses.all.forEach((course, index) => {
      DOM.addCourse(course, index);
    });
    Storage.set(Courses.all);
  },
  reload() {
    DOM.clearCourse();
    App.init();
  },
};

App.init();
