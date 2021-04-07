import {DataGrid} from '@material-ui/data-grid';
import DeleteIcon from '@material-ui/icons/Delete'
import Papa from "papaparse";
import items from "./items.csv";
// import * as fs from 'fs'
// import neatCsv from 'neat-csv'
import { Component } from "react";
import "./app.css";
import {
  Button,
  TableBody,
  TextField,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableCell,
  TableRow,
  TableHead,
} from "@material-ui/core";
const fs = require("fs");

function product(sku, name, location) {
  return { sku, name, location };
}

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchSku: "",
      newName: "",
      newSku: "",
      newLocation: "",
      searchProduct: null,
      removeSku: "",
      data: [],
      products: {},
    };

    this.searchSku = this.searchSku.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
  }

  async componentDidMount() {
    const productsData = localStorage.getItem("products");
    let products = JSON.parse(productsData);
    if (isEmpty(products)) {
      fetch(items)
        .then((r) => r.text())
        .then((text) => {
          console.log("text decoded:", text);
        });

      // const items = fs.readFileSync('./items.csv',{encoding:'utf-8'})
      console.log(items);
    }
    this.setState({ products });
  }

  handleInputChange(event, key) {
    this.setState({ [key]: event.target.value });
  }

  searchSku() {
    this.setState((state) => ({
      searchProduct: state.products[state.searchSku],
    }));
  }

  addProduct() {
    this.setState((state) => {
      if (!state.newSku || !state.newName || !state.newLocation) {
        return state;
      }
      const newProduct = product(
        state.newSku,
        state.newName,
        state.newLocation
      );
      const products = { ...state.products, [newProduct.sku]: newProduct };
      localStorage.setItem("products", JSON.stringify(products));
      return {
        products,
      };
    });
  }

  removeProduct() {
    this.setState((state) => {
      const products = { ...state.products };
      delete products[state.removeSku];
      localStorage.setItem("products", JSON.stringify(products));
      return { products };
    });
  }

  deleteAll() {
    this.setState((state) => {
      const products = {};
      localStorage.setItem("products", JSON.stringify(products));
      return { products };
    });
  }

  onChangeHandler = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      worker: true,
      header: true,
      complete: (result) => {
        let products = {};
        console.log(result.data)

        for (const item of result.data) {
          console.log(item)
          products[item.SKU] = product(item.SKU, item.NAME, "---");
          
        }
        console.log(products);
        this.setState({ products });
      },
    });
  };

  render() {
    const product = this.state.searchProduct;
    const rows = Object.values(this.state.products).map(product => ({...product,id:product.sku}))
    const columns = [
      {field: "sku", headerName: 'SKU'},
      {field: "name", headerName: 'Description',width:300},
      {field: "location", headerName: 'Location',width:150},
    ]
    return (
      <div>
        <input type="file" name="file" onChange={this.onChangeHandler} />

        <Typography variant="h2">ReefH20 Warehouse</Typography>
        <Paper>
          <Typography variant="h3">Search Inventory</Typography>
          <TextField
            label="SKU"
            variant="outlined"
            onChange={(event) => this.handleInputChange(event, "searchSku")}
          />
          <Button onClick={this.searchSku}>Search</Button>
          <br />
          <br />
          <div>
            <Typography>SKU: {product?.sku ?? "#####"}</Typography>
            <Typography>Name: {product?.name ?? "#####"}</Typography>
            <Typography>Location: {product?.location ?? "#####"}</Typography>
          </div>
          <br />
          <Typography variant="h3">Add Product</Typography>
          <div>
            <TextField
              label="SKU"
              variant="outlined"
              onChange={(event) => this.handleInputChange(event, "newSku")}
            />
          </div>
          <TextField
            label="Name"
            variant="outlined"
            onChange={(event) => this.handleInputChange(event, "newName")}
          />
          <div>
            <TextField
              label="Location"
              variant="outlined"
              onChange={(event) => this.handleInputChange(event, "newLocation")}
            />
          </div>
          <Button onClick={this.addProduct}>Add</Button>
          <br />
          <Typography variant="h3">Remove Product</Typography>
          <TextField
            label="SKU"
            variant="outlined"
            onChange={(event) => this.handleInputChange(event, "removeSku")}
          />
          <Button
            onClick={(e) => {
              if (window.confirm("Are you sure you want to remove product?"))
                this.deleteAll(e);
            }}
          >
            Remove
          </Button>
          <br />
          <Button variant='contained' color='secondary' startIcon={<DeleteIcon/>}
            onClick={(e) => {
              if (
                window.confirm("Are you sure you want to delete all products?")
              )
                this.deleteAll(e);
            }}
          >
            {" "}
            Delete All{" "}
          </Button>
        </Paper>
        <Typography variant="h3">Inventory</Typography>
        {/* <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(this.state.products).map((product) => (
                <TableRow key={product.sku}>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer> */}
        <DataGrid rows={rows} columns={columns} pageSize={100} checkboxSelection/>
      </div>
    );            
  }
}

export default App;
