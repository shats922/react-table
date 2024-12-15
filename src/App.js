import "react-tabulator/lib/styles.css";
import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css";
import "./App.css";
import { ReactTabulator } from "react-tabulator";
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const list = ["To Do", "In Progress", "Done"];
var table;

let flag = 0;
function onTableRef(ref) {
  table = ref.current;
  flag++;

  if(isDev && flag === 1) {
    return;
  }
  // fetch data from api
  // set in data, get only 1st 20
  fetch("https://jsonplaceholder.typicode.com/todos")
    .then((res) => res.json())
    .then((data) => {
      // add data to table
      console.log(data);
      const newData = data.slice(0, 20).map((d) => ({
        id: d.id,
        title: d.title,
        desc: d.title,
        status: d.completed ? "Done" : "To Do",
      }));
      table.addData(newData);
    });
}

function addTask(formData) {
  const title = formData.get("title");
  const desc = formData.get("desc");
  const status = formData.get("status");
  const data = table.getData();
  const i = data.length + 1;

  table.addData(
    [
      {
        id: i,
        title: title,
        desc: desc,
        status: status,
      },
    ],
    false
  );
}

const columns = [
  { title: "Task ID", field: "id" },
  { title: "Title", field: "title", editor: "input", width: "20px" },
  { title: "Description", field: "desc", editor: "input", width: "35px" },
  {
    title: "Status",
    field: "status",
    editor: "list",
    editorParams: {
      values: list,
    },
    width: 200,
    cellClick: (e, cell) => {
      // get current position
      const pos = e.target.getBoundingClientRect();
      // get popup container element
      const load = () => {
        const popup = document.body.querySelector(".tabulator-popup-container");
        if (popup) {
          popup.style.top = pos.top + 34 + "px";
          popup.style.left = pos.left + "px";
        } else {
          setTimeout(load, 100);
        }
      };
      load();
    },
    headerFilter: true,
    headerFilterParams: { values: list, clearable: true },
  },
  {
    title: "",
    formatter: "buttonCross",
    width: 10,
    cellClick: function (e, cell) {
      // cell.row.delete();
      cell.getRow().delete();
      console.log(cell, e);
    },
  },
];

function App() {
  return (
    <div className="App">
      <ReactTabulator
        id="table"
        columns={columns}
        layout={"fitData"}
        onRef={onTableRef}
      />
      <form  action={addTask} class="addTask">
        Title
        <input name="title" />
        Description
        <input name="desc" />
        <label>
          Status:
          <select name="status">
            {list.map((d) => (
              <option value={d}>{d}</option>
            ))}
          </select>
        </label>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
}

export default App;
