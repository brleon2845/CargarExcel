
var bd = JSON.parse(localStorage.getItem("tableData")) || [];

class Excel {
  constructor(content) {
    this.content = content;
  }

  header() {
    return this.content[0];
  }

  rows() {
    return new RowCollection(this.content.slice(1, this.content.length));
  }
}

class RowCollection {
  constructor(rows) {
    this.rows = rows;
  }

  first() {
    return new Row(this.rows[0]);
  }

  get(index) {
    return new Row(this.rows[index]);
  }

  count() {
    return this.rows.length;
  }
}

class Row {
  constructor(row) {
    this.row = row;
  }

  name() {
    return this.row[0];
  }

  lastname() {
    return this.row[1];
  }

  identification() {
    return this.row[2];
  }

  role() {
  }
}

class ExcelPrinter {
  static print(tableId, excel) {
    const table = document.getElementById(tableId);
    const tbody = document.getElementById("table-body");

    // Clear existing rows
    tbody.innerHTML = "";

    
    for (let index = 0; index < excel.rows().count(); index++) {
      const row = excel.rows().get(index);
      const newRow = document.createElement("tr");

      
      for (const cellValue of [row.name(), row.lastname(), row.identification()]) {
        const cell = document.createElement("td");
        cell.textContent = cellValue;
        newRow.appendChild(cell);
      }

      tbody.appendChild(newRow);
    }
  }
}

const excelInput = document.getElementById('excel-input');

excelInput.addEventListener('change', async function() {
  const content = await readXlsxFile(excelInput.files[0]);
  const excel = new Excel(content);

  // Convert excel data to JSON
  bd = [];
  for (let index = 0; index < excel.rows().count(); index++) {
    const row = excel.rows().get(index);
    bd.push({
      nombre: row.name(),
      apellido: row.lastname(),
      cedula: row.identification(),
    });
  }

  // Store data in local storage
  /* `localStorage.setItem("tableData", JSON.stringify(bd));` almacena los datos en la matriz `bd` como una cadena JSON en el almacenamiento local del navegador bajo la clave "tableData". Esto permite que los datos persistan incluso si la página se actualiza o se cierra, de modo que puedan recuperarse y usarse más tarde. */
  localStorage.setItem("tableData", JSON.stringify(bd));

  ExcelPrinter.print("excel-table", excel);
});

// Load initial data from local storage
document.addEventListener("DOMContentLoaded", function() {
  nuevosdatos();
});

function nuevosdatos() {
  // Get data from local storage
  bd = JSON.parse(localStorage.getItem("tableData")) || [];

  // Print data in table
  ExcelPrinter.print("excel-table", new Excel(bd));
}
