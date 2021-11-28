const Modal = {
  modalBox: document.querySelector(".modal-overlay"),
  OpenCloseModal() {
    Modal.modalBox.classList.toggle("active");
  },
  newCourse() {
    Form.modalName.innerHTML = "Novo Curso";
    Form.clearFields();
    Form.id.removeAttribute("readonly");
    Modal.OpenCloseModal();
  },
  editCourse(index) {
    Form.modalName.innerHTML = "Editar Curso";
    Form.id.setAttribute("readonly", "true");
    Form.getEditCourseValues(index);
    Modal.OpenCloseModal();
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
    Courses.all.splice(index, 1);
    App.reload();
  },
  edit(index, newTitle, newDescription, newImage, newTeacher, newClasses) {
    let editCourse = Courses.all[index];
    editCourse.title = newTitle;
    editCourse.description = newDescription;
    editCourse.image = newImage;
    editCourse.teacher = newTeacher;
    editCourse.classes = newClasses;
    App.reload();
  },
  search() {
    DOM.searchCourse();
  },
};

const DOM = {
  searchBox: document.querySelector("#search"),
  table: document.querySelector("#table-content tbody"),
  innerHTMLCourses(course, index) {
    const classesArray = course.classes.trim().split(",");
    const classesList = classesArray.map(
      (classe, index) =>
        `<li class="classe-content" ><a href="${classe}" target="_blank">Aula ${
          index + 1
        }</a></li>`
    );
    const classesHTML = `<ul class="classe-list">${classesList
      .toString()
      .replace(/\,/g, "")}</ul>`;
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
    ${classesHTML}
    </td>
    <td class="table-edit">
      <button onclick="Modal.editCourse(${index})">Edit</button>
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
  editCourse(index) {
    let AllCourses = [...Courses.all];
    let idOld = AllCourses[index].id;
    let titleOld = AllCourses[index].title;
    let descriptionOld = AllCourses[index].description;
    let imageOld = AllCourses[index].image;
    let teacherOld = AllCourses[index].teacher;
    let classesOld = AllCourses[index].classes;

    return {
      idOld,
      titleOld,
      descriptionOld,
      imageOld,
      teacherOld,
      classesOld,
    };
  },
  searchCourse() {
    const courseID = DOM.searchBox.value;
    const courseFinded = Courses.all.find((course) => course.id == courseID);
    let position = 0;
    if (!!courseFinded) {
      position = Courses.all
        .map((course) => {
          return course.id;
        })
        .indexOf(courseID);
    }
    try {
      if (!courseFinded) {
        throw new Error("Curso não existe");
      }
      if (courseID == "") {
        throw new Error("Digite um ID");
      }
      Modal.editCourse(position);
      DOM.searchBox.value = "";
    } catch (error) {
      alert(error.message);
    }
  },
};

const Form = {
  id: document.querySelector("input#id"),
  title: document.querySelector("input#title"),
  description: document.querySelector("input#description"),
  image: document.querySelector("input#image"),
  teacher: document.querySelector("input#teacher"),
  classes: document.querySelector("input#classes"),
  modalName: document.querySelector("#form-name"),
  position: 0,
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
  getEditCourseValues(index) {
    Form.id.value = DOM.editCourse(index).idOld;
    Form.title.value = DOM.editCourse(index).titleOld;
    Form.description.value = DOM.editCourse(index).descriptionOld;
    Form.image.value = DOM.editCourse(index).imageOld;
    Form.teacher.value = DOM.editCourse(index).teacherOld;
    Form.classes.value = DOM.editCourse(index).classesOld;
    Form.position = index;
  },

  validateFields() {
    const { id, title, description, image, teacher, classes } =
      Form.getValues();
    const searchID = Courses.all.find((course) => course.id == id);

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
    if (!!searchID && !Form.id.getAttribute("readonly")) {
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
    Form.position = "";
  },
  submitNew(event) {
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
  submitEdit(event) {
    event.preventDefault();
    try {
      Form.validateFields();
      const course = Form.getValues();
      Courses.edit(
        Form.position,
        course.title,
        course.description,
        course.image,
        course.teacher,
        course.classes
      );
      Form.clearFields();
      Form.id.removeAttribute("readonly");
      Modal.OpenCloseModal();
    } catch (error) {
      alert(error.message);
    }
  },
  submit(event) {
    if (Form.modalName.innerHTML == "Novo Curso") {
      return Form.submitNew(event);
    }
    if (Form.modalName.innerHTML == "Editar Curso") {
      return Form.submitEdit(event);
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
